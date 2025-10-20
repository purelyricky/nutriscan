# Developer Documentation - NutriScan

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [PDF Processing Pipeline](#pdf-processing-pipeline)
4. [AI Integration](#ai-integration)
5. [Data Schemas](#data-schemas)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Testing Strategy](#testing-strategy)
9. [Best Practices](#best-practices)
10. [Deployment Guide](#deployment-guide)

---

## Architecture Overview

### Technology Stack

```
Frontend (Client-Side)
├── Next.js 14 (App Router)
├── React 18 + TypeScript
├── Tailwind CSS
└── Shadcn/ui Components

Backend (API Routes)
├── Next.js API Routes (Node.js)
├── PDF.js (pdfjs-dist)
├── OpenAI SDK
├── Google Generative AI SDK
└── Zod (Schema Validation)

AI Providers
├── OpenAI GPT-4o
└── Google Gemini 2.0 Flash
```

### Request Flow

```
User → Upload PDF
  ↓
Frontend (page.tsx)
  ↓ base64-encoded PDF
API Route (/api/extract)
  ↓
PDF to Images (pdf-utils.ts)
  ↓ array of base64 images
AI Extractor (ai-extractors.ts)
  ↓ structured JSON
Schema Validation (schemas.ts)
  ↓ validated ProductInfo
Frontend Display
```

---

## Core Components

### 1. PDF Processing (`lib/pdf-utils.ts`)

#### `pdfToImages(pdfBuffer: Buffer)`

Converts PDF pages to base64-encoded PNG images.

**Why this approach?**
- Works uniformly for text-based and scanned PDFs
- High-quality image output (2x scale)
- Compatible with both OpenAI and Gemini vision APIs

**Implementation Details:**
```typescript
// PDF.js configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// For each page:
// 1. Load PDF document
// 2. Get page viewport (scale 2.0 for quality)
// 3. Render to canvas
// 4. Convert canvas to base64 PNG
```

**Performance:**
- ~1-3 seconds per page
- Memory usage: ~10-20MB per page

#### `extractTextFromPDF(pdfBuffer: Buffer)`

Extracts raw text from text-based PDFs (currently unused but available for optimization).

---

### 2. AI Extractors (`lib/ai-extractors.ts`)

#### `extractWithOpenAI(images: string[])`

**OpenAI GPT-4o Integration:**

```typescript
// Features used:
// - Vision capabilities (image understanding)
// - Structured outputs (JSON Schema)
// - High detail mode for images

const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: EXTRACTION_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: "..." },
        { type: "image_url", image_url: { url: imageData, detail: "high" } }
      ]
    }
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "product_info",
      strict: true,
      schema: zodToJsonSchema(productInfoSchema)
    }
  },
  temperature: 0.1  // Low for consistency
});
```

**Advantages:**
- Strict schema adherence (guaranteed valid JSON)
- High accuracy for complex layouts
- Excellent language understanding

**Limitations:**
- Higher cost (~$0.005-0.01 per document)
- Slower response time (~10-15 seconds)

#### `extractWithGemini(images: string[])`

**Google Gemini 2.0 Flash Integration:**

```typescript
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.1,
    responseMimeType: "application/json",
    responseSchema: zodToJsonSchema(productInfoSchema)
  }
});

const result = await model.generateContent([
  EXTRACTION_PROMPT,
  "Instructions...",
  ...imageParts  // Base64 images
]);
```

**Advantages:**
- Very cost-effective (~$0.0001-0.0005 per document)
- Fast response time (~5-10 seconds)
- Native document understanding

**Limitations:**
- Less strict schema adherence (may require validation)
- Occasional hallucinations with complex tables

---

### 3. Data Schemas (`lib/schemas.ts`)

#### Schema Design Philosophy

We use **Zod** for runtime validation and type inference:

```typescript
// Design pattern:
// 1. Define Zod schema
export const allergenSchema = z.object({...});

// 2. Infer TypeScript type
export type Allergen = z.infer<typeof allergenSchema>;

// 3. Validate at runtime
const validated = allergenSchema.parse(data);
```

#### Allergen Schema

```typescript
export const allergenSchema = z.object({
  gluten: z.boolean(),
  egg: z.boolean(),
  crustaceans: z.boolean(),
  fish: z.boolean(),
  peanut: z.boolean(),
  soy: z.boolean(),
  milk: z.boolean(),
  treeNuts: z.boolean(),
  celery: z.boolean(),
  mustard: z.boolean(),
});
```

**Design Decision:** Boolean instead of nullable
- Missing allergen info = `false` (safer default)
- Explicit presence = `true`
- Simpler UI logic

#### Nutrition Schema

```typescript
export const nutritionSchema = z.object({
  energy: z.object({
    kj: z.number().nullable(),
    kcal: z.number().nullable()
  }),
  fat: z.number().nullable(),
  saturatedFat: z.number().nullable(),
  carbohydrate: z.number().nullable(),
  sugar: z.number().nullable(),
  protein: z.number().nullable(),
  salt: z.number().nullable(),
  sodium: z.number().nullable(),
});
```

**Design Decision:** Nullable numbers
- `null` = value not found in document
- Allows distinguishing "not found" from "zero"
- Frontend can conditionally render

---

## PDF Processing Pipeline

### Step-by-Step Breakdown

#### 1. Frontend File Upload (`app/page.tsx`)

```typescript
const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];

  // Validation
  if (file.type !== "application/pdf") {
    alert("Please upload a PDF file");
    return;
  }

  // Store file locally (no upload yet)
  setFile(file);
};
```

#### 2. Convert to Base64

```typescript
const handleSubmit = async () => {
  const reader = new FileReader();
  const base64File = await new Promise<string>((resolve) => {
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  // Send to API
  await fetch("/api/extract", {
    method: "POST",
    body: JSON.stringify({ file: base64File, provider })
  });
};
```

#### 3. API Processing (`app/api/extract/route.ts`)

```typescript
export async function POST(req: NextRequest) {
  // 1. Parse and validate request
  const { file, provider } = requestSchema.parse(await req.json());

  // 2. Decode base64 to Buffer
  const base64Data = file.replace(/^data:application\/pdf;base64,/, "");
  const pdfBuffer = Buffer.from(base64Data, "base64");

  // 3. Convert PDF to images
  const { images, pageCount } = await pdfToImages(pdfBuffer);

  // 4. Extract with AI
  const productInfo = await extractProductInfo(images, provider);

  // 5. Return structured data
  return NextResponse.json({ success: true, data: productInfo });
}
```

#### 4. PDF to Images (`lib/pdf-utils.ts`)

```typescript
export async function pdfToImages(pdfBuffer: Buffer) {
  const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
  const images: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    // Render to canvas
    const canvas = createCanvas(viewport.width, viewport.height);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

    // Convert to base64
    images.push(canvas.toDataURL("image/png"));
  }

  return { images, pageCount: pdf.numPages };
}
```

---

## AI Integration

### Prompt Engineering

#### English Prompt (`EXTRACTION_PROMPT_EN`)

```typescript
const EXTRACTION_PROMPT_EN = `You are an expert at extracting nutritional information and allergen data from food product documents.

Analyze this product document and extract:
1. Product name
2. Allergens (mark true if present, false otherwise)
3. Nutritional values per 100g/100ml (use null if not found)
4. Ingredients list (if available)
5. Serving size (if available)

The document may be in Hungarian or English. Detect the language and return extracted text in the SAME language.

Be thorough and handle both structured tables and unstructured text formats.`;
```

**Key Techniques:**
- Clear role definition ("You are an expert...")
- Explicit instructions for edge cases (null vs false)
- Language detection requirement
- Format flexibility instruction

#### Hungarian Prompt (`EXTRACTION_PROMPT_HU`)

Identical content, translated to Hungarian for potential future optimization.

### Structured Output Configuration

#### OpenAI (Strict Schema)

```typescript
response_format: {
  type: "json_schema",
  json_schema: {
    name: "product_info",
    strict: true,  // Enforces exact schema match
    schema: zodToJsonSchema(productInfoSchema)
  }
}
```

**Benefits:**
- Guaranteed valid JSON
- No parsing errors
- Type-safe extraction

#### Gemini (Schema Guidance)

```typescript
generationConfig: {
  responseMimeType: "application/json",
  responseSchema: zodToJsonSchema(productInfoSchema)
}
```

**Benefits:**
- Still provides JSON
- More flexible (can handle edge cases)
- Slightly less strict but faster

---

## API Endpoints

### POST `/api/extract`

#### Request

```typescript
interface ExtractRequest {
  file: string;  // Base64-encoded PDF (with data URI prefix)
  provider: "openai" | "gemini";  // AI provider selection
}
```

**Example:**
```json
{
  "file": "data:application/pdf;base64,JVBERi0xLjQK...",
  "provider": "gemini"
}
```

#### Response (Success)

```typescript
interface ExtractResponse {
  success: true;
  data: ProductInfo;
  pageCount: number;
}
```

**Example:**
```json
{
  "success": true,
  "data": {
    "productName": "Édes Anna Paprika",
    "language": "hu",
    "allergens": {
      "gluten": false,
      "egg": false,
      "milk": false,
      ...
    },
    "nutritionalValues": {
      "energy": { "kj": 1250, "kcal": 300 },
      "fat": 15.0,
      ...
    },
    "ingredients": "Paprika, só, fűszerek",
    "servingSize": "100g",
    "additionalInfo": null
  },
  "pageCount": 2
}
```

#### Response (Error)

```typescript
interface ExtractErrorResponse {
  error: string;
  message?: string;
}
```

**Example:**
```json
{
  "error": "Extraction failed",
  "message": "OPENAI_API_KEY is not configured"
}
```

#### Error Codes

- `400`: Invalid request (bad file format, missing parameters)
- `500`: Server error (PDF processing failure, AI API error)

---

## Frontend Components

### Main Page (`app/page.tsx`)

#### Component Structure

```typescript
export default function Page() {
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">();
  const [provider, setProvider] = useState<"openai" | "gemini">("gemini");

  // Handlers
  const handleFileUpload = async (event) => { ... };
  const handleSubmit = async () => { ... };
  const clearFile = () => { ... };

  // Render
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {/* Upload Section */}
      <Card>...</Card>

      {/* Results Section */}
      {status === "idle" && <EmptyState />}
      {status === "loading" && <LoadingSkeleton />}
      {status === "success" && <ResultsDisplay data={productInfo} />}
      {status === "error" && <ErrorDisplay message={errorMessage} />}
    </div>
  );
}
```

#### Multi-Language Support

```typescript
// Dynamic language selection based on extracted data
const lang = productInfo?.language || "en";

// Usage in UI
<h4>{lang === "hu" ? "Allergének" : "Allergens"}</h4>

// Label translations
const allergenLabels: Record<string, { en: string; hu: string }> = {
  gluten: { en: "Gluten", hu: "Glutén" },
  ...
};
```

---

## Testing Strategy

### Unit Tests (Recommended)

```typescript
// Test PDF processing
describe("pdfToImages", () => {
  it("should convert PDF to images", async () => {
    const buffer = fs.readFileSync("test.pdf");
    const result = await pdfToImages(buffer);
    expect(result.images).toHaveLength(2);
    expect(result.pageCount).toBe(2);
  });
});

// Test schema validation
describe("productInfoSchema", () => {
  it("should validate correct data", () => {
    const data = { productName: "Test", language: "en", ... };
    expect(() => productInfoSchema.parse(data)).not.toThrow();
  });

  it("should reject invalid data", () => {
    const data = { productName: 123, ... };  // Wrong type
    expect(() => productInfoSchema.parse(data)).toThrow();
  });
});
```

### Integration Tests

```typescript
// Test full extraction flow
describe("/api/extract", () => {
  it("should extract data from PDF", async () => {
    const pdfBase64 = fs.readFileSync("test.pdf", "base64");
    const response = await fetch("/api/extract", {
      method: "POST",
      body: JSON.stringify({
        file: `data:application/pdf;base64,${pdfBase64}`,
        provider: "gemini"
      })
    });

    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.data.productName).toBeDefined();
  });
});
```

### Manual Testing Checklist

- [ ] Upload text-based PDF
- [ ] Upload scanned/image-based PDF
- [ ] Upload Hungarian document
- [ ] Upload English document
- [ ] Upload multi-page document
- [ ] Test with OpenAI provider
- [ ] Test with Gemini provider
- [ ] Test error handling (invalid file, missing API key)
- [ ] Test UI responsiveness (mobile, tablet, desktop)
- [ ] Test language switching

---

## Best Practices

### 1. Error Handling

```typescript
// Always wrap AI calls in try-catch
try {
  const result = await extractWithGemini(images);
  return result;
} catch (error) {
  console.error("Extraction error:", error);
  // Provide user-friendly error message
  throw new Error("Failed to extract data. Please try again or use a different provider.");
}
```

### 2. API Key Management

```typescript
// Never expose API keys in frontend
// Always check keys exist before using

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not configured");
}
```

### 3. Performance Optimization

```typescript
// Consider implementing caching for frequently analyzed documents
// Example using a simple in-memory cache:

const cache = new Map<string, ProductInfo>();

export async function extractProductInfo(images: string[], provider: string) {
  const cacheKey = `${provider}-${hashImages(images)}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const result = await (provider === "openai" ? extractWithOpenAI : extractWithGemini)(images);
  cache.set(cacheKey, result);
  return result;
}
```

### 4. Rate Limiting

```typescript
// Implement rate limiting for production
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10  // Limit each IP to 10 requests per windowMs
});

// Apply to API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb"  // Limit PDF size
    }
  }
};
```

---

## Deployment Guide

### Environment Variables

```bash
# Production .env
OPENAI_API_KEY=sk-proj-...
GOOGLE_API_KEY=AIza...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add OPENAI_API_KEY
vercel env add GOOGLE_API_KEY

# Deploy to production
vercel --prod
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t nutri-scan .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_key \
  -e GOOGLE_API_KEY=your_key \
  nutri-scan
```

### Monitoring & Logging

```typescript
// Add structured logging
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info"
});

// Usage in API
logger.info({ provider, pageCount }, "Starting extraction");
logger.error({ error }, "Extraction failed");
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)
- [Zod Documentation](https://zod.dev/)

---

**Last Updated:** 2025-10-20
**Version:** 1.0.0
