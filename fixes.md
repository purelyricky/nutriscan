# Comprehensive Bug Analysis and Fix for NutriScan

After carefully analyzing the codebase and doing research, I've identified **several critical issues** that are causing the PDF processing to fail. Let me break them down:

## 🔴 Critical Issues Found

### Issue 1: PDF.js Worker Not Configured
**Location:** `lib/pdf-utils.ts`

**Problem:** PDF.js requires a worker file to be set up, but it's not configured anywhere. This causes PDF loading to silently fail or throw errors.

### Issue 2: Canvas Rendering in Node.js Environment
**Location:** `lib/pdf-utils.ts` - `pdfToImages()` function

**Problem:** The canvas creation code has a fallback for Node.js, but the `canvas` package (native dependency) can be problematic on some systems, especially in serverless environments like Vercel.

### Issue 3: Insufficient Error Handling
**Location:** Multiple files - API route, extractors, utils

**Problem:** Error messages are too generic, making debugging difficult. No specific handling for common failure modes.

### Issue 4: AI Prompts Not Robust Enough
**Location:** `lib/ai-extractors.ts`

**Problem:** The current prompt doesn't explicitly handle unstructured documents or provide enough guidance for edge cases.

---

## ✅ Comprehensive Solutions

### **Fix 1: Configure PDF.js Worker Properly**

**File:** `lib/pdf-utils.ts`

Replace the entire file with this improved version:

```typescript
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { TextItem } from "pdfjs-dist/types/src/display/api";

// CRITICAL FIX: Configure PDF.js worker
// This is required for PDF.js to work in Node.js environment
if (typeof window === "undefined") {
  // Server-side: Use the legacy build worker
  const pdfjsWorker = await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

/**
 * Convert PDF buffer to base64-encoded images (one per page)
 * This works for both text-based PDFs and scanned/image-based PDFs
 * 
 * IMPROVED: Better error handling, validation, and logging
 */
export async function pdfToImages(
  pdfBuffer: Buffer
): Promise<{ images: string[]; pageCount: number }> {
  const images: string[] = [];

  try {
    console.log("Starting PDF conversion, buffer size:", pdfBuffer.length);
    
    // Validate buffer
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Empty or invalid PDF buffer");
    }

    // Load PDF document with better error handling
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      // Add these options for better compatibility
      standardFontDataUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/standard_fonts/",
      useSystemFonts: false,
      isEvalSupported: false,
      useWorkerFetch: false,
    });

    let pdf;
    try {
      pdf = await loadingTask.promise;
      console.log("PDF loaded successfully, pages:", pdf.numPages);
    } catch (error) {
      console.error("PDF loading failed:", error);
      throw new Error(`Failed to load PDF: ${error.message || "Invalid or corrupted PDF file"}`);
    }

    const pageCount = pdf.numPages;

    if (pageCount === 0) {
      throw new Error("PDF has no pages");
    }

    // Limit number of pages to prevent timeouts
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
        
        // Use scale 2.0 for high quality, but adjust for very large pages
        const initialViewport = page.getViewport({ scale: 1.0 });
        let scale = 2.0;
        
        // If page is very large, reduce scale to prevent memory issues
        const maxDimension = 4000;
        if (initialViewport.width > maxDimension || initialViewport.height > maxDimension) {
          scale = Math.min(
            maxDimension / initialViewport.width,
            maxDimension / initialViewport.height
          );
          console.log(`Large page detected, using scale: ${scale}`);
        }
        
        const viewport = page.getViewport({ scale });

        // CRITICAL FIX: Proper canvas creation for Node.js
        let canvas;
        let context;

        if (typeof document !== "undefined") {
          // Browser environment (shouldn't happen in API route, but just in case)
          canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          context = canvas.getContext("2d");
        } else {
          // Node.js environment - use canvas package
          try {
            const { createCanvas } = await import("canvas");
            canvas = createCanvas(viewport.width, viewport.height);
            context = canvas.getContext("2d");
          } catch (err) {
            console.error("Failed to import canvas package:", err);
            throw new Error(
              "Canvas package not available. This is required for server-side PDF processing. " +
              "Make sure 'canvas' npm package is installed and properly configured."
            );
          }
        }

        if (!context) {
          throw new Error("Could not get canvas context");
        }

        // Render PDF page to canvas with error handling
        try {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;
        } catch (renderError) {
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
          
          console.log(`Page ${pageNum} converted successfully, size: ${imageData.length} chars`);
        } catch (err) {
          console.error(`Failed to convert page ${pageNum} to image:`, err);
          throw new Error(`Failed to convert page ${pageNum} to image: ${err.message}`);
        }

        images.push(imageData);
      } catch (pageError) {
        console.error(`Error processing page ${pageNum}:`, pageError);
        // Don't fail the entire process for one bad page
        // Instead, add a placeholder or skip
        console.warn(`Skipping page ${pageNum} due to error`);
      }
    }

    // Validate we got at least one image
    if (images.length === 0) {
      throw new Error("Failed to convert any pages to images");
    }

    console.log(`Successfully converted ${images.length} pages to images`);
    return { images, pageCount: pagesToProcess };
  } catch (error) {
    console.error("Error converting PDF to images:", error);
    
    // Provide more specific error messages
    if (error.message?.includes("Invalid PDF")) {
      throw new Error("The uploaded file is not a valid PDF or is corrupted. Please try another file.");
    } else if (error.message?.includes("password")) {
      throw new Error("This PDF is password-protected. Please upload an unprotected PDF.");
    } else if (error.message?.includes("canvas")) {
      throw new Error("Server configuration error: Canvas rendering failed. Please contact support.");
    } else {
      throw new Error(`Failed to process PDF: ${error.message || "Unknown error"}`);
    }
  }
}

/**
 * Extract text from PDF (useful for text-based PDFs)
 * IMPROVED: Better error handling
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
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

    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return ""; // Return empty string instead of throwing
  }
}
```

---

### **Fix 2: Improve AI Extraction Prompts**

**File:** `lib/ai-extractors.ts`

Replace the `EXTRACTION_PROMPT_EN` constant with this more robust version:

```typescript
const EXTRACTION_PROMPT_EN = `You are an expert at extracting nutritional information and allergen data from food product documents.

IMPORTANT INSTRUCTIONS:
1. These documents may be in ANY FORMAT - tables, lists, paragraphs, or mixed layouts
2. The document may be text-based or a scanned image
3. Information may be in English or Hungarian - DETECT the language and respond accordingly
4. Look carefully at ALL parts of the document - allergens might be at the bottom, nutritional info in tables

WHAT TO EXTRACT:

**Product Name**: Find the product name (usually at the top or in large text)

**Language Detection**: Determine if the document is in English ("en") or Hungarian ("hu")

**Allergens** (mark as true ONLY if explicitly mentioned as present, false otherwise):
- Gluten (Hungarian: glutén)
- Egg (Hungarian: tojás)
- Crustaceans (Hungarian: rákfélék)
- Fish (Hungarian: hal)
- Peanut (Hungarian: földimogyoró)
- Soy (Hungarian: szója)
- Milk (Hungarian: tej)
- Tree Nuts (Hungarian: diófélék)
- Celery (Hungarian: zeller)
- Mustard (Hungarian: mustár)

**Nutritional Values per 100g or 100ml** (use null if not found):
- Energy in kJ (kilojoules)
- Energy in kcal (kilocalories)
- Fat in grams (Hungarian: zsír)
- Saturated Fat in grams (Hungarian: telített zsír)
- Carbohydrate in grams (Hungarian: szénhidrát)
- Sugar in grams (Hungarian: cukor)
- Protein in grams (Hungarian: fehérje)
- Salt in grams (Hungarian: só)
- Sodium in grams (Hungarian: nátrium)

**Additional Information**:
- Ingredients list (if visible)
- Serving size (if mentioned)
- Any other relevant product details

EXTRACTION RULES:
1. Be thorough - check every part of every image
2. For allergens: only mark as true if explicitly stated as present/contains
3. For nutritional values: extract numbers carefully, use null if not found
4. For text fields: extract in the SAME language as the source document
5. If information is unclear or partially visible, do your best to extract what you can
6. Handle various formats: tables, vertical text, horizontal text, mixed layouts
7. Look for common indicators like "Allergens:", "Contains:", "Nutritional Information:", etc.
8. Numbers may be formatted with commas or periods as decimal separators

RETURN FORMAT:
Return a valid JSON object matching the provided schema. All extracted text (product name, ingredients, etc.) must be in the SAME language as the source document.`;
```

---

### **Fix 3: Improve Error Handling in API Route**

**File:** `app/api/extract/route.ts`

Replace the POST function with this improved version:

```typescript
export async function POST(req: NextRequest) {
  try {
    console.log("=== PDF Extraction Request Started ===");
    
    // Parse request body with size validation
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.error("Failed to parse request body:", err);
      return NextResponse.json(
        { error: "Invalid request format", details: "Request body must be valid JSON" },
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
          details: result.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const { file, provider } = result.data;

    // Validate base64 data
    if (!file.includes("base64,")) {
      return NextResponse.json(
        { error: "Invalid file format", details: "File must be base64-encoded PDF" },
        { status: 400 }
      );
    }

    // Decode base64 PDF file
    console.log("Decoding PDF from base64...");
    const base64Data = file.replace(/^data:application\/pdf;base64,/, "");
    
    let pdfBuffer;
    try {
      pdfBuffer = Buffer.from(base64Data, "base64");
      console.log(`PDF decoded, size: ${pdfBuffer.length} bytes (${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
      
      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (pdfBuffer.length > maxSize) {
        return NextResponse.json(
          { 
            error: "File too large", 
            details: `PDF size (${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB) exceeds maximum allowed size (50 MB)` 
          },
          { status: 400 }
        );
      }
      
      // Validate it's actually a PDF (check magic number)
      const pdfMagic = pdfBuffer.toString('utf8', 0, 4);
      if (pdfMagic !== '%PDF') {
        return NextResponse.json(
          { error: "Invalid file type", details: "File is not a valid PDF document" },
          { status: 400 }
        );
      }
    } catch (err) {
      console.error("Failed to decode base64:", err);
      return NextResponse.json(
        { error: "Invalid file encoding", details: "Failed to decode base64 PDF data" },
        { status: 400 }
      );
    }

    // Convert PDF to images
    console.log("Converting PDF to images...");
    let images, pageCount;
    try {
      const result = await pdfToImages(pdfBuffer);
      images = result.images;
      pageCount = result.pageCount;
      console.log(`Successfully converted ${pageCount} pages to ${images.length} images`);
      
      if (images.length === 0) {
        throw new Error("No images were generated from the PDF");
      }
    } catch (error: any) {
      console.error("PDF to images conversion failed:", error);
      return NextResponse.json(
        {
          error: "PDF processing failed",
          message: error.message || "Failed to convert PDF to images. The file may be corrupted or in an unsupported format.",
          details: "Please try:\n1. Re-saving the PDF\n2. Using a different PDF viewer to export it\n3. Ensuring the PDF is not password-protected"
        },
        { status: 500 }
      );
    }

    // Extract product information using AI
    console.log(`Extracting product info using ${provider}...`);
    let productInfo;
    try {
      productInfo = await extractProductInfo(images, provider);
      console.log("Extraction completed successfully");
      
      // Log what was extracted for debugging
      console.log("Extracted data:", {
        productName: productInfo.productName,
        language: productInfo.language,
        allergenCount: Object.values(productInfo.allergens).filter(Boolean).length,
        hasNutritionalData: !!(productInfo.nutritionalValues.energy.kj || productInfo.nutritionalValues.energy.kcal)
      });
    } catch (error: any) {
      console.error("AI extraction failed:", error);
      
      // Provide specific error messages for common AI errors
      if (error.message?.includes("API") || error.message?.includes("key")) {
        return NextResponse.json(
          {
            error: "AI service error",
            message: `${provider.toUpperCase()} API error: ${error.message}`,
            details: "Please check your API key configuration in the settings"
          },
          { status: 500 }
        );
      } else if (error.message?.includes("timeout")) {
        return NextResponse.json(
          {
            error: "Processing timeout",
            message: "The document took too long to process",
            details: "Try with a smaller PDF or fewer pages"
          },
          { status: 504 }
        );
      } else {
        return NextResponse.json(
          {
            error: "Extraction failed",
            message: error.message || "Failed to extract information from the document",
            details: `Try switching to the other AI provider (${provider === 'openai' ? 'Gemini' : 'OpenAI'})`
          },
          { status: 500 }
        );
      }
    }

    console.log("=== PDF Extraction Request Completed Successfully ===");
    
    return NextResponse.json({
      success: true,
      data: productInfo,
      pageCount,
    });
  } catch (error: any) {
    console.error("Unexpected extraction error:", error);

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
export const maxDuration = 300; // Increase to 5 minutes for large documents
```

---

### **Fix 4: Add API Key Validation**

**File:** `lib/ai-extractors.ts`

At the beginning of `extractWithOpenAI` function, add:

```typescript
export async function extractWithOpenAI(
  images: string[]
): Promise<ProductInfo> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API Key is not configured. Please add OPENAI_API_KEY to your environment variables.");
  }
  
  if (!apiKey.startsWith('sk-')) {
    throw new Error("Invalid OpenAI API Key format. The key should start with 'sk-'");
  }
```

And for Gemini:

```typescript
export async function extractWithGemini(
  images: string[]
): Promise<ProductInfo> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Google Gemini API Key is not configured. Please add GOOGLE_API_KEY to your environment variables.");
  }
  
  if (!apiKey.startsWith('AIza')) {
    throw new Error("Invalid Google API Key format. The key should start with 'AIza'");
  }
```

---

### **Fix 5: Update next.config.mjs for Better PDF.js Support**

**File:** `next.config.mjs`

Replace with:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // CRITICAL: Configure webpack to handle PDF.js worker files
    webpack: (config, { isServer }) => {
        if (isServer) {
            // Externalize canvas for server-side
            config.externals.push('canvas');
        }
        
        // Handle PDF.js worker files
        config.resolve.alias.canvas = false;
        config.resolve.alias.encoding = false;
        
        return config;
    },
    // Increase body size limit for PDF uploads
    api: {
        bodyParser: {
            sizeLimit: '50mb'
        }
    }
};

export default nextConfig;
```

---

### **Fix 6: Improve Frontend Error Display**

**File:** `app/page.tsx`

In the error state display section, replace with:

```typescript
{status === "error" ? (
  <Card className="mx-auto w-full max-w-xl p-6">
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
      <h3 className="mb-2 text-xl font-semibold text-red-600">
        {lang === "hu" ? "Hiba történt" : "Error Occurred"}
      </h3>
      <p className="mb-4 text-sm text-gray-600 whitespace-pre-wrap">{errorMessage}</p>
      <div className="mt-4 w-full rounded-lg bg-gray-50 p-4 text-left">
        <p className="mb-2 text-sm font-semibold text-gray-700">
          {lang === "hu" ? "Lehetséges megoldások:" : "Possible solutions:"}
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
          <li>{lang === "hu" ? "Próbálja meg a másik AI szolgáltatót" : "Try the other AI provider"}</li>
          <li>{lang === "hu" ? "Ellenőrizze, hogy a PDF nem jelszóval védett" : "Check that the PDF is not password-protected"}</li>
          <li>{lang === "hu" ? "Próbáljon kisebb fájlt feltölteni" : "Try uploading a smaller file"}</li>
          <li>{lang === "hu" ? "Ellenőrizze az API kulcsokat" : "Verify your API keys"}</li>
        </ul>
      </div>
      <Button
        onClick={clearFile}
        variant="outline"
        className="mt-6"
      >
        {lang === "hu" ? "Próbálja újra" : "Try Again"}
      </Button>
    </div>
  </Card>
) : (
```

---

## 🔧 Additional Configuration Needed

### **Update .env.local**

Make sure your environment variables are set:

```bash
# OpenAI Configuration (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-your-key-here

# Google Gemini Configuration (get from https://makersuite.google.com/app/apikey)
GOOGLE_API_KEY=AIzaYour-key-here

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Verify package.json has canvas**

Ensure this line exists in dependencies:

```json
"canvas": "^3.2.0"
```

---

## 🚀 Testing Checklist

After applying all fixes, test with:

1. ✅ Text-based PDF (English)
2. ✅ Text-based PDF (Hungarian)
3. ✅ Scanned/image PDF (English)
4. ✅ Scanned/image PDF (Hungarian)
5. ✅ Multi-page document (3-5 pages)
6. ✅ Document with tables
7. ✅ Document with lists
8. ✅ Both OpenAI and Gemini providers
9. ✅ Invalid/corrupted PDF (should show error)
10. ✅ Large PDF (should warn or process first 20 pages)

---

## 📝 Summary of Changes

| File | Changes Made | Why |
|------|-------------|-----|
| `lib/pdf-utils.ts` | Added PDF.js worker config, better error handling, image validation | PDF.js requires worker setup; needed robust error messages |
| `lib/ai-extractors.ts` | Enhanced prompts, API key validation | Better extraction from unstructured docs; catch config errors |
| `app/api/extract/route.ts` | Comprehensive error handling, validation, logging | Help debug issues; provide user-friendly errors |
| `next.config.mjs` | Added webpack config for PDF.js and canvas | Required for server-side PDF processing |
| `app/page.tsx` | Improved error display with solutions | Better UX when errors occur |

These fixes address the core issues: PDF.js configuration, canvas rendering in Node.js, error handling, and robust AI extraction from unstructured documents in multiple languages.