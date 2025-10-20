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
    // Parse request body
    const body = await req.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.issues },
        { status: 400 }
      );
    }

    const { file, provider } = result.data;

    // Decode base64 PDF file
    const base64Data = file.replace(/^data:application\/pdf;base64,/, "");
    const pdfBuffer = Buffer.from(base64Data, "base64");

    // Convert PDF to images
    console.log("Converting PDF to images...");
    const { images, pageCount } = await pdfToImages(pdfBuffer);
    console.log(`Converted ${pageCount} pages to images`);

    // Extract product information using AI
    console.log(`Extracting product info using ${provider}...`);
    const productInfo = await extractProductInfo(images, provider);
    console.log("Extraction completed:", productInfo);

    return NextResponse.json({
      success: true,
      data: productInfo,
      pageCount,
    });
  } catch (error) {
    console.error("Extraction error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Extraction failed",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds timeout for API route
