import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { pdfToImages } from "@/lib/pdf-utils";
import { extractProductInfo } from "@/lib/ai-extractors";

const requestSchema = z.object({
  file: z.string().describe("Base64-encoded PDF file"),
  provider: z
    .enum(["openai", "gemini"])
    .default("gemini")
    .describe("AI provider to use for extraction"),
});

export async function POST(req: NextRequest) {
  try {
    console.log("=== PDF Extraction Request Started ===");
    console.log("Request received at:", new Date().toISOString());

    // Parse request body with error handling
    let body;
    try {
      body = await req.json();
    } catch (err: any) {
      console.error("Failed to parse request body:", err);
      return NextResponse.json(
        {
          error: "Invalid request format",
          message: "Request body must be valid JSON",
          details: err.message
        },
        { status: 400 }
      );
    }

    // Validate request schema
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      console.error("Schema validation failed:", result.error.issues);
      return NextResponse.json(
        {
          error: "Invalid request",
          message: "Request validation failed",
          details: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const { file, provider } = result.data;

    // Validate base64 data format
    if (!file.includes("base64,")) {
      return NextResponse.json(
        {
          error: "Invalid file format",
          message: "File must be a base64-encoded PDF",
          details: "Expected format: data:application/pdf;base64,..."
        },
        { status: 400 }
      );
    }

    // Decode base64 PDF file
    console.log("Decoding PDF from base64...");
    const base64Data = file.replace(/^data:application\/pdf;base64,/, "");

    let pdfBuffer;
    try {
      pdfBuffer = Buffer.from(base64Data, "base64");
      const sizeInMB = (pdfBuffer.length / 1024 / 1024).toFixed(2);
      console.log(`PDF decoded successfully. Size: ${pdfBuffer.length} bytes (${sizeInMB} MB)`);

      // Check file size (50MB limit for serverless functions)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (pdfBuffer.length > maxSize) {
        return NextResponse.json(
          {
            error: "File too large",
            message: `PDF size (${sizeInMB} MB) exceeds maximum allowed size (50 MB)`,
            details: "Please reduce the file size or number of pages and try again"
          },
          { status: 400 }
        );
      }

      // Warn about large files
      if (pdfBuffer.length > 10 * 1024 * 1024) { // > 10MB
        console.warn(`Large file detected (${sizeInMB} MB). Processing may take longer.`);
      }

      // Validate it's actually a PDF (check magic number)
      const pdfMagic = pdfBuffer.toString('utf8', 0, 4);
      if (pdfMagic !== '%PDF') {
        console.error("Invalid PDF magic number:", pdfMagic);
        return NextResponse.json(
          {
            error: "Invalid file type",
            message: "File is not a valid PDF document",
            details: "The file does not appear to be a PDF. Please ensure you're uploading a PDF file."
          },
          { status: 400 }
        );
      }
    } catch (err: any) {
      console.error("Failed to decode base64:", err);
      return NextResponse.json(
        {
          error: "Invalid file encoding",
          message: "Failed to decode PDF data",
          details: err.message
        },
        { status: 400 }
      );
    }

    // Convert PDF to images
    console.log("Converting PDF to images...");
    let images, pageCount;
    try {
      const conversionStartTime = Date.now();
      const result = await pdfToImages(pdfBuffer);
      images = result.images;
      pageCount = result.pageCount;
      const conversionTime = ((Date.now() - conversionStartTime) / 1000).toFixed(2);

      console.log(`PDF conversion completed in ${conversionTime}s`);
      console.log(`Successfully converted ${pageCount} pages to ${images.length} images`);

      if (images.length === 0) {
        throw new Error("No images were generated from the PDF");
      }

      // Log image sizes for debugging
      images.forEach((img, idx) => {
        console.log(`  Image ${idx + 1} size: ${(img.length / 1024).toFixed(0)} KB`);
      });
    } catch (error: any) {
      console.error("PDF to images conversion failed:", error);

      // Provide user-friendly error messages
      let errorMessage = error.message || "Failed to convert PDF to images";
      let errorDetails = "The file may be corrupted or in an unsupported format.";

      if (error.message?.includes("password")) {
        errorMessage = "This PDF is password-protected";
        errorDetails = "Please remove the password protection and try again";
      } else if (error.message?.includes("Invalid PDF") || error.message?.includes("magic number")) {
        errorMessage = "Invalid or corrupted PDF file";
        errorDetails = "Please try:\n1. Re-saving the PDF\n2. Using a different PDF viewer to export it\n3. Ensuring the file is not corrupted";
      } else if (error.message?.includes("canvas") || error.message?.includes("Canvas")) {
        errorMessage = "Server configuration error";
        errorDetails = "Canvas rendering failed. Please contact support.";
      }

      return NextResponse.json(
        {
          error: "PDF processing failed",
          message: errorMessage,
          details: errorDetails
        },
        { status: 500 }
      );
    }

    // Extract product information using AI
    console.log(`Extracting product info using ${provider.toUpperCase()}...`);
    let productInfo;
    try {
      const extractionStartTime = Date.now();
      productInfo = await extractProductInfo(images, provider);
      const extractionTime = ((Date.now() - extractionStartTime) / 1000).toFixed(2);

      console.log(`AI extraction completed in ${extractionTime}s`);
      console.log("Extraction successful:");
      console.log({
        productName: productInfo.productName,
        language: productInfo.language,
        allergenCount: Object.values(productInfo.allergens).filter(Boolean).length,
        hasNutritionalData: !!(productInfo.nutritionalValues.energy.kj || productInfo.nutritionalValues.energy.kcal),
        hasIngredients: !!productInfo.ingredients
      });
    } catch (error: any) {
      console.error("AI extraction failed:", error);

      // Provide specific error messages for common AI errors
      let errorMessage = error.message || "Failed to extract information from the document";
      let errorDetails = `Try switching to the other AI provider (${provider === 'openai' ? 'Gemini' : 'OpenAI'})`;

      if (error.message?.includes("API key") || error.message?.includes("API Key")) {
        errorMessage = `${provider.toUpperCase()} API configuration error`;
        errorDetails = "Please check that your API key is correctly configured in the environment variables";
      } else if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
        errorMessage = "API quota exceeded or rate limit reached";
        errorDetails = "Please try again later or switch to the other AI provider";
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Processing timeout";
        errorDetails = "The document took too long to process. Try with a smaller PDF or fewer pages";
      } else if (error.message?.includes("SAFETY")) {
        errorMessage = "Content blocked by safety filters";
        errorDetails = "The AI provider blocked the request. Try switching providers or using a different document";
      }

      return NextResponse.json(
        {
          error: "Extraction failed",
          message: errorMessage,
          details: errorDetails,
          provider: provider
        },
        { status: 500 }
      );
    }

    console.log("=== PDF Extraction Request Completed Successfully ===");

    return NextResponse.json({
      success: true,
      data: productInfo,
      pageCount,
      metadata: {
        provider,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error("Unexpected extraction error:", error);
    console.error("Error stack:", error.stack);

    return NextResponse.json(
      {
        error: "Unexpected error",
        message: error.message || "An unexpected error occurred during processing",
        details: "Please try again or contact support if the issue persists"
      },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes for complex documents (max for Vercel Hobby)
