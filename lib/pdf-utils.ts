import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { TextItem } from "pdfjs-dist/types/src/display/api";

// Configure PDF.js worker using CDN (most reliable for production)
// This works in both development and serverless environments
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

/**
 * Convert PDF buffer to base64-encoded images (one per page)
 * This works for both text-based PDFs and scanned/image-based PDFs
 *
 * PRODUCTION-READY: Uses @napi-rs/canvas for Vercel compatibility
 * - Smaller bundle size (fits within 50MB serverless limit)
 * - Zero system dependencies
 * - Same API as node-canvas
 */
export async function pdfToImages(
  pdfBuffer: Buffer
): Promise<{ images: string[]; pageCount: number }> {
  const images: string[] = [];

  try {
    console.log("Starting PDF conversion, buffer size:", pdfBuffer.length, "bytes");

    // Validate buffer
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Empty or invalid PDF buffer");
    }

    // Validate PDF magic number (first 4 bytes should be '%PDF')
    const pdfMagic = pdfBuffer.toString('utf8', 0, 4);
    if (pdfMagic !== '%PDF') {
      throw new Error("Invalid PDF file format - file does not start with PDF magic number");
    }

    // Load PDF document with enhanced options
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      // These options improve compatibility and error handling
      standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/standard_fonts/`,
      useSystemFonts: false,
      isEvalSupported: false,
      useWorkerFetch: false,
    });

    let pdf;
    try {
      pdf = await loadingTask.promise;
      console.log("PDF loaded successfully, pages:", pdf.numPages);
    } catch (error: any) {
      console.error("PDF loading failed:", error);

      // Provide specific error messages for common issues
      if (error.message?.includes("password")) {
        throw new Error("This PDF is password-protected. Please upload an unprotected PDF.");
      } else if (error.message?.includes("Invalid PDF")) {
        throw new Error("Invalid or corrupted PDF file. Please try re-saving the PDF and uploading again.");
      } else {
        throw new Error(`Failed to load PDF: ${error.message || "Unknown error"}`);
      }
    }

    const pageCount = pdf.numPages;

    if (pageCount === 0) {
      throw new Error("PDF has no pages");
    }

    // Limit number of pages to prevent timeouts (especially important for serverless)
    const maxPages = 20;
    const pagesToProcess = Math.min(pageCount, maxPages);

    if (pageCount > maxPages) {
      console.warn(`PDF has ${pageCount} pages, processing only first ${maxPages}`);
    }

    // Convert each page to an image
    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
      try {
        console.log(`Processing page ${pageNum}/${pagesToProcess}`);

        const page = await pdf.getPage(pageNum);

        // Calculate optimal scale
        const initialViewport = page.getViewport({ scale: 1.0 });
        let scale = 2.0; // Higher scale for better quality

        // If page is very large, reduce scale to prevent memory issues
        const maxDimension = 4000;
        if (initialViewport.width > maxDimension || initialViewport.height > maxDimension) {
          scale = Math.min(
            maxDimension / initialViewport.width,
            maxDimension / initialViewport.height
          );
          console.log(`Large page detected, using scale: ${scale.toFixed(2)}`);
        }

        const viewport = page.getViewport({ scale });

        // Create canvas - use @napi-rs/canvas for server-side
        let canvas;
        let context;

        if (typeof document !== "undefined") {
          // Browser environment (shouldn't happen in API route, but defensive coding)
          canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          context = canvas.getContext("2d");
        } else {
          // Node.js environment - use @napi-rs/canvas
          try {
            const { createCanvas } = await import("@napi-rs/canvas");
            canvas = createCanvas(viewport.width, viewport.height);
            context = canvas.getContext("2d");
          } catch (err: any) {
            console.error("Failed to import @napi-rs/canvas:", err);
            throw new Error(
              "Canvas package not available. Server configuration error. " +
              "Please ensure '@napi-rs/canvas' is installed. " +
              `Details: ${err.message}`
            );
          }
        }

        if (!context) {
          throw new Error("Could not get canvas context");
        }

        // Render PDF page to canvas
        try {
          await page.render({
            canvasContext: context as any,
            viewport: viewport,
          }).promise;
        } catch (renderError: any) {
          console.error(`Failed to render page ${pageNum}:`, renderError);
          throw new Error(`Failed to render page ${pageNum}: ${renderError.message}`);
        }

        // Convert canvas to base64 image
        let imageData;
        try {
          imageData = canvas.toDataURL("image/png");

          // Validate that we got actual image data
          if (!imageData || !imageData.startsWith("data:image/png;base64,")) {
            throw new Error("Invalid image data generated");
          }

          console.log(`Page ${pageNum} converted successfully, data URL length: ${imageData.length} chars`);
        } catch (err: any) {
          console.error(`Failed to convert page ${pageNum} to image:`, err);
          throw new Error(`Failed to convert page ${pageNum} to image: ${err.message}`);
        }

        images.push(imageData);
      } catch (pageError: any) {
        console.error(`Error processing page ${pageNum}:`, pageError);
        // For now, re-throw to fail fast. In production, you might want to skip bad pages
        throw pageError;
      }
    }

    // Validate we got at least one image
    if (images.length === 0) {
      throw new Error("Failed to convert any pages to images");
    }

    console.log(`Successfully converted ${images.length} pages to images`);
    return { images, pageCount: pagesToProcess };
  } catch (error: any) {
    console.error("Error converting PDF to images:", error);

    // Re-throw with user-friendly message
    if (error.message?.includes("password")) {
      throw new Error("This PDF is password-protected. Please upload an unprotected PDF.");
    } else if (error.message?.includes("Invalid PDF") || error.message?.includes("magic number")) {
      throw new Error("The uploaded file is not a valid PDF or is corrupted. Please try another file.");
    } else if (error.message?.includes("canvas") || error.message?.includes("Canvas")) {
      throw new Error("Server configuration error: Canvas rendering failed. Please contact support.");
    } else if (error.message) {
      throw error; // Re-throw with original message if it's already user-friendly
    } else {
      throw new Error(`Failed to process PDF: ${error.toString()}`);
    }
  }
}

/**
 * Extract text from PDF (useful for text-based PDFs)
 * Enhanced with better error handling and page limits
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    console.log("Extracting text from PDF...");

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
    });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    let fullText = "";

    // Limit pages for performance
    const maxPages = Math.min(pageCount, 20);

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      try {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => {
            if ("str" in item) {
              return (item as TextItem).str;
            }
            return "";
          })
          .join(" ");
        fullText += pageText + "\n\n";
      } catch (pageError) {
        console.error(`Error extracting text from page ${pageNum}:`, pageError);
        // Continue with other pages
      }
    }

    console.log(`Extracted ${fullText.length} characters of text from ${maxPages} pages`);
    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return ""; // Return empty string instead of throwing
  }
}
