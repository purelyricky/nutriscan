# NutriScanner Developer Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Setup & Installation](#setup--installation)
5. [API Routes](#api-routes)
6. [Components](#components)
7. [Schemas & Validation](#schemas--validation)
8. [AI Model Integration](#ai-model-integration)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

## Architecture Overview

NutriScanner follows a modern Next.js 15 architecture with App Router:

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │ ──────> │   Next.js    │ ──────> │  AI Model   │
│  (Client)   │ <────── │  (Server)    │ <────── │ (Gemini/GPT)│
└─────────────┘         └──────────────┘         └─────────────┘
      │                        │
      │                        │
      ▼                        ▼
  React UI              API Routes
  Components            /api/extract
```

### Data Flow

1. User uploads PDF via React component
2. PDF is encoded to base64 on client
3. Client sends request to `/api/extract` with PDF data and model selection
4. Server forwards PDF to selected AI model (Gemini or OpenAI)
5. AI model processes PDF using vision/OCR capabilities
6. Structured data is streamed back to client
7. Client displays results in tables

## Project Structure

```
nutriscanner/
├── app/
│   ├── (preview)/                  # Main application route group
│   │   ├── page.tsx               # Main page component
│   │   ├── layout.tsx             # Root layout with metadata
│   │   └── globals.css            # Global styles
│   └── api/
│       └── extract/
│           └── route.ts           # Extraction API endpoint
│
├── components/
│   └── ui/
│       ├── results-table.tsx      # Results display component
│       ├── file-upload.tsx        # File upload component
│       ├── button.tsx             # Button component
│       ├── card.tsx               # Card component
│       ├── progress.tsx           # Progress bar component
│       ├── select.tsx             # Select dropdown component
│       └── ...                    # Other shadcn/ui components
│
├── lib/
│   ├── schemas.ts                 # Zod validation schemas
│   └── utils.ts                   # Utility functions
│
├── .env.local                     # Environment variables (not in git)
├── .env.example                   # Environment template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.ts             # Tailwind CSS configuration
├── next.config.mjs                # Next.js configuration
├── README.md                      # Project README
├── USER_GUIDE.md                  # User documentation
└── DEVELOPER_DOCUMENTATION.md     # This file
```

## Technology Stack

### Core Framework
- **Next.js 15.1.0**: React framework with App Router
- **React 19.0.0**: UI library
- **TypeScript 5.7.2**: Type safety

### AI Integration
- **Vercel AI SDK 4.0.16**: Unified AI interface
- **@ai-sdk/google**: Google Gemini integration
- **@ai-sdk/openai**: OpenAI GPT-4 integration

### UI & Styling
- **Tailwind CSS 3.4.16**: Utility-first CSS
- **shadcn/ui**: Component library
- **Radix UI**: Headless UI components
- **Framer Motion 11.14.1**: Animations
- **Lucide React**: Icons

### Validation & Data
- **Zod 3.24.1**: Schema validation
- **clsx**: Conditional class names
- **tailwind-merge**: Merge Tailwind classes

### Developer Experience
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **Sonner**: Toast notifications

## Setup & Installation

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/nutriscanner.git
cd nutriscanner
```

### Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

Note: `--legacy-peer-deps` may be needed due to React 19 peer dependency conflicts with some libraries.

### Step 3: Configure Environment

Create `.env.local` file:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
OPENAI_API_KEY=your_openai_api_key
```

**Getting API Keys:**
- Google Gemini: https://ai.google.dev/
- OpenAI: https://platform.openai.com/api-keys

### Step 4: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### Step 5: Build for Production

```bash
npm run build
npm start
```

## API Routes

### POST /api/extract

Extracts allergen and nutritional information from PDF.

**Request:**

```typescript
{
  files: Array<{
    name: string;
    type: string;
    data: string; // base64 encoded PDF
  }>;
  model: "gemini" | "openai";
}
```

**Response (Streamed):**

```typescript
{
  allergens: {
    gluten: boolean;
    egg: boolean;
    crustaceans: boolean;
    fish: boolean;
    peanut: boolean;
    soy: boolean;
    milk: boolean;
    treeNuts: boolean;
    celery: boolean;
    mustard: boolean;
  };
  nutritionalValues: {
    energy?: string;
    fat?: string;
    carbohydrate?: string;
    sugar?: string;
    protein?: string;
    sodium?: string;
  };
  detectedLanguage: "hungarian" | "english" | "both" | "unknown";
  productName?: string;
  confidence?: "high" | "medium" | "low";
}
```

**Implementation:**

```typescript
// app/api/extract/route.ts
import { extractionResultSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";

export async function POST(req: Request) {
  const { files, model } = await req.json();

  const selectedModel = model === "openai"
    ? openai("gpt-4o")
    : google("gemini-1.5-pro-latest");

  const result = streamObject({
    model: selectedModel,
    messages: [/* ... */],
    schema: extractionResultSchema,
  });

  return result.toTextStreamResponse();
}
```

## Components

### Main Page Component

**Location:** `app/(preview)/page.tsx`

**Key Features:**
- File upload with drag & drop
- Model selection (Gemini/OpenAI)
- Progress tracking
- Results display
- Error handling

**State Management:**

```typescript
const [files, setFiles] = useState<File[]>([]);
const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
const [selectedModel, setSelectedModel] = useState<"gemini" | "openai">("gemini");
```

**Hooks Used:**
- `experimental_useObject`: Streaming AI responses
- `useState`: Component state
- `AnimatePresence`: Animations

### ResultsTable Component

**Location:** `components/ui/results-table.tsx`

**Props:**

```typescript
interface ResultsTableProps {
  result: ExtractionResult;
}
```

**Features:**
- Product information card
- Allergens table with visual indicators
- Nutritional values table
- Bilingual labels (English/Hungarian)

### FileUpload Component

**Location:** `components/ui/file-upload.tsx`

**Props:**

```typescript
interface FileUploadComponentProps {
  onFileChange: (files: File[]) => void;
  selectedFiles: File[];
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}
```

**Features:**
- Drag & drop support
- File type validation (PDF only)
- File size validation (5MB max)
- Visual feedback

## Schemas & Validation

### Extraction Result Schema

**Location:** `lib/schemas.ts`

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

export const nutritionalValueSchema = z.object({
  energy: z.string().optional(),
  fat: z.string().optional(),
  carbohydrate: z.string().optional(),
  sugar: z.string().optional(),
  protein: z.string().optional(),
  sodium: z.string().optional(),
});

export const extractionResultSchema = z.object({
  allergens: allergenSchema,
  nutritionalValues: nutritionalValueSchema,
  detectedLanguage: z.enum(["hungarian", "english", "both", "unknown"]),
  productName: z.string().optional(),
  confidence: z.enum(["high", "medium", "low"]).optional(),
});
```

## AI Model Integration

### Gemini Integration

```typescript
import { google } from "@ai-sdk/google";

const model = google("gemini-1.5-pro-latest");
```

**Capabilities:**
- Native PDF processing
- OCR for scanned documents
- Multi-language support
- Vision capabilities for images

**API Key:** `GOOGLE_GENERATIVE_AI_API_KEY`

### OpenAI Integration

```typescript
import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4o");
```

**Capabilities:**
- Advanced PDF understanding
- OCR via vision API
- Excellent structured output
- Multi-language processing

**API Key:** `OPENAI_API_KEY`

### System Prompt

The AI models receive this system prompt:

```
You are an expert nutritional information extraction assistant.

IMPORTANT INSTRUCTIONS:
1. The document may be in Hungarian, English, or both languages - handle both gracefully
2. The document may be a scanned image or a regular PDF - extract text accordingly
3. The data may be unstructured, in tables, or in lists - parse all formats
4. For allergens, mark as true ONLY if explicitly mentioned as present/contains
5. For nutritional values, extract the exact values WITH their units
6. If a value is not found, leave it as undefined/null
7. Detect the primary language used in the document
8. Extract the product name if clearly stated
```

### Streaming Responses

The API uses streaming for real-time updates:

```typescript
const { object: partialResult, isLoading } = experimental_useObject({
  api: "/api/extract",
  schema: extractionResultSchema,
  onFinish: ({ object }) => {
    setExtractionResult(object ?? null);
  },
});
```

## Deployment

### Vercel Deployment

1. **Push to GitHub:**
```bash
git add .
git commit -m "Deploy NutriScanner"
git push origin main
```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Import repository
   - Add environment variables

3. **Environment Variables:**
   ```
   GOOGLE_GENERATIVE_AI_API_KEY
   OPENAI_API_KEY
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Other Platforms

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

**Environment Variables:**
- Ensure API keys are set in hosting environment
- Use secrets management for production

## Troubleshooting

### Common Issues

**1. React 19 Peer Dependency Warnings**

Solution: Use `--legacy-peer-deps` flag:
```bash
npm install --legacy-peer-deps
```

**2. API Key Not Found**

Check:
- `.env.local` file exists
- Keys are properly formatted
- Server was restarted after adding keys

**3. PDF Upload Fails**

Verify:
- File is actually PDF format
- File size < 5MB
- MIME type is `application/pdf`

**4. Streaming Doesn't Work**

Ensure:
- Using Next.js 15+
- API route returns `toTextStreamResponse()`
- Client uses `experimental_useObject`

**5. TypeScript Errors**

Run:
```bash
npm run build
```
Check `tsconfig.json` settings.

### Debug Mode

Enable verbose logging:

```typescript
// In API route
console.log("Processing file:", files[0].name);
console.log("Using model:", model);
```

### Testing

**Manual Testing:**
1. Upload sample PDFs
2. Try both AI models
3. Test Hungarian and English documents
4. Test scanned vs regular PDFs

**API Testing:**
```bash
curl -X POST http://localhost:3000/api/extract \
  -H "Content-Type: application/json" \
  -d '{"files": [...], "model": "gemini"}'
```

## Performance Optimization

### Recommendations

1. **Image Optimization:**
   - Next.js Image component for logos
   - Lazy load components

2. **Code Splitting:**
   - Dynamic imports for heavy components
   - Route-based splitting (automatic)

3. **Caching:**
   - Cache API responses if needed
   - Use SWR or React Query

4. **Bundle Size:**
   ```bash
   npm run build
   # Check .next/analyze
   ```

## Security Considerations

1. **API Keys:**
   - Never commit to version control
   - Use environment variables
   - Rotate keys regularly

2. **File Upload:**
   - Validate file types
   - Limit file sizes
   - Sanitize file names

3. **CORS:**
   - Configure allowed origins
   - Set proper headers

4. **Rate Limiting:**
   - Implement rate limiting
   - Monitor API usage

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - See LICENSE file

## Support

For issues or questions:
- GitHub Issues
- Developer email
- Documentation wiki

---

**Version:** 1.0.0
**Last Updated:** October 2025
**Maintained by:** NutriScanner Team
