import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { TextItem } from "pdfjs-dist/types/src/display/api";

/**
 * Convert PDF buffer to base64-encoded images (one per page)
 * This works for both text-based PDFs and scanned/image-based PDFs
 */
export async function pdfToImages(
  pdfBuffer: Buffer
): Promise<{ images: string[]; pageCount: number }> {
  const images: string[] = [];

  try {
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
    });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    // Convert each page to an image
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

      // Create canvas
      const canvas =
        typeof document !== "undefined"
          ? document.createElement("canvas")
          : (await import("canvas")).createCanvas(
              viewport.width,
              viewport.height
            );

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Could not get canvas context");
      }

      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Convert canvas to base64 image
      const imageData = canvas.toDataURL("image/png");
      images.push(imageData);
    }

    return { images, pageCount };
  } catch (error) {
    console.error("Error converting PDF to images:", error);
    throw new Error("Failed to process PDF file");
  }
}

/**
 * Extract text from PDF (useful for text-based PDFs)
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
    });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
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
    }

    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
}
