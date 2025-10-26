# NutriScanner - AI-Powered Nutritional Information Extractor

![NutriScanner](public/nutriscanner.gif)

NutriScanner is a production-ready web application that automatically extracts allergen information and nutritional values from food product PDF documents using advanced AI vision models. It supports both Hungarian and English documents, handles scanned images, and provides real-time streaming extraction with confidence scoring.

## Features

- 📄 **PDF Support**: Upload regular PDFs or scanned (image-based) PDFs up to 5MB
- 🌍 **Multi-language**: Seamlessly handles Hungarian and English documents
- 🤖 **Dual AI Models**: Choose between OpenAI GPT-4o (most accurate) and Google Gemini 2.5-Flash (fast and production-ready)
- 🥜 **Comprehensive Allergen Detection**: Identifies all 10 EU-regulated allergens with bilingual labels
- 📊 **Nutritional Values Extraction**: Extracts Energy, Fat, Carbohydrates, Sugar, Protein, and Sodium with units preserved
- 🎯 **Unstructured Data Handling**: Works with tables, lists, paragraphs, and mixed formats
- ⚡ **Real-Time Streaming**: Live progress updates during extraction
- 🎨 **Modern UI**: Built with Next.js 15, React 19, and Tailwind CSS
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Extracted Data

### Allergens (10 EU-Regulated)
- **Gluten** (Glutén) - Wheat, barley, rye, oats
- **Egg** (Tojás) - Egg white, yolk, egg protein
- **Crustaceans** (Rák) - Shrimp, lobster, crab
- **Fish** (Hal) - Tuna, salmon, and other fish
- **Peanut** (Földimogyoró) - Peanuts and peanut products
- **Soy** (Szója) - Soy protein, soy lecithin
- **Milk** (Tej) - Milk powder, whey, lactose
- **Tree Nuts** (Diófélék) - Almonds, walnuts, cashews, pistachios, hazelnuts
- **Celery** (Zeller) - Celery root and stalks
- **Mustard** (Mustár) - Mustard seeds and products

### Nutritional Values
- **Energy** (Energia) - Extracted in kJ/kcal format
- **Fat** (Zsír) - Grams per 100g/100ml
- **Carbohydrates** (Szénhidrát) - Grams per 100g/100ml
- **Sugar** (Cukor) - Grams per 100g/100ml ("of which sugars")
- **Protein** (Fehérje) - Grams per 100g/100ml
- **Sodium** (Nátrium) - Milligrams or grams per 100g/100ml

### Additional Metadata
- **Detected Language**: Hungarian, English, Both, or Unknown
- **Product Name**: Extracted from document or filename
- **Confidence Level**: High, Medium, or Low (based on document quality)

## Tech Stack

### Frontend
- **Framework**: Next.js 15.1.0 (App Router with React Server Components)
- **Language**: TypeScript 5.7.2
- **UI Library**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.16
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Animations**: Framer Motion 11.14.1
- **Icons**: Lucide React 0.468.0
- **Notifications**: Sonner 1.7.1 (Toast library)
- **Validation**: Zod 3.24.1 (runtime schema validation)

### Backend / AI Integration
- **AI SDK**: Vercel AI SDK 5.0.0
- **OpenAI Integration**: @ai-sdk/openai 2.0.53 (GPT-4o with vision)
- **Google Integration**: @ai-sdk/google 2.0.23 (Gemini 2.5-Flash)
- **React Hooks**: @ai-sdk/react 2.0.79 (`experimental_useObject` for streaming)

## Setup

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Version 10 or higher (or yarn/pnpm)
- **API Keys**:
  - OpenAI API key (required) - [Get it here](https://platform.openai.com/api-keys)
  - Google Gemini API key (required) - [Get it here](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/purelyricky/nutriscan.git
cd nutriscan
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**

Create a `.env.local` file in the root directory with the following content:

```env
# OpenAI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini Configuration (Required)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Usage

### Step-by-Step Guide

1. **Select AI Model**
   - Choose between **OpenAI GPT-4o** (recommended for highest accuracy) or **Google Gemini 2.5-Flash** (fast and production-ready)

2. **Upload PDF File**
   - Drag and drop a PDF file into the upload area, or click to browse
   - Maximum file size: 5MB
   - Supports both digital PDFs and scanned images

3. **Extract Information**
   - Click the "Extract Information" button
   - Watch real-time progress as the AI analyzes your document (10-100%)

4. **Review Results**
   - View extracted allergen information in a clear table with visual indicators
   - Check nutritional values with original units preserved
   - See detected language and confidence level
   - Product name is automatically extracted when available

5. **Scan Another Document**
   - Click "Scan Another" to upload and process additional PDFs

## Project Structure

```
nutriscan/
├── app/
│   ├── (preview)/
│   │   ├── page.tsx              # Main application UI
│   │   ├── layout.tsx            # Root layout with metadata
│   │   ├── globals.css           # Global styles
│   │   └── docs/
│   │       └── page.tsx          # Developer documentation
│   └── api/
│       └── extract/
│           ├── openai/
│           │   └── route.ts      # OpenAI GPT-4o extraction endpoint
│           └── gemini/
│               └── route.ts      # Google Gemini extraction endpoint
├── components/
│   └── ui/
│       ├── results-table.tsx     # Results display component
│       ├── button.tsx            # Button component
│       ├── card.tsx              # Card container
│       ├── progress.tsx          # Progress bar
│       └── ...                   # Other shadcn/ui components
├── lib/
│   ├── schemas.ts                # Zod validation schemas
│   ├── system-prompt.ts          # AI extraction instructions
│   └── utils.ts                  # Utility functions
├── public/
│   ├── nutriscanner.svg          # Application logo
│   ├── openai.svg                # OpenAI logo
│   └── google.svg                # Google Gemini logo
└── README.md                     # This file
```

## API Endpoints

### POST /api/extract/openai

Extracts allergen and nutritional data using OpenAI GPT-4o.

**Request:**
```json
{
  "files": [{
    "name": "product-label.pdf",
    "type": "application/pdf",
    "data": "data:application/pdf;base64,JVBERi0xLjQK..."
  }]
}
```

**Response:** Streaming JSON with extraction results
```json
{
  "allergens": {
    "gluten": true,
    "egg": false,
    ...
  },
  "nutritionalValues": {
    "energy": "1500kJ/350kcal",
    "fat": "12g",
    ...
  },
  "detectedLanguage": "hungarian",
  "productName": "Sample Product",
  "confidence": "high"
}
```

### POST /api/extract/gemini

Identical to the OpenAI endpoint but uses Google Gemini 2.5-Flash for faster, cost-effective extraction.

## Development Notes

### How It Works

1. **PDF Upload**: User uploads a PDF file (up to 5MB) via drag-and-drop or file picker
2. **Base64 Encoding**: Browser converts PDF to base64 data URL
3. **API Request**: Frontend sends base64-encoded file to selected AI model endpoint
4. **Vision Processing**: AI model (GPT-4o or Gemini) uses vision capabilities to read the PDF
5. **Structured Extraction**: AI extracts allergens, nutritional values, language, and product name
6. **Schema Validation**: Response is validated against Zod schemas for type safety
7. **Streaming Response**: Results are streamed back to the client in real-time
8. **Results Display**: Extraction data is displayed in organized, bilingual tables

### Key Features

- **Streaming with Progress**: Uses Vercel AI SDK's `streamObject()` for real-time updates
- **Schema Validation**: Zod schemas ensure runtime validation and TypeScript type safety
- **Bilingual UI**: All labels displayed in both English and Hungarian
- **Vision Capabilities**: AI models automatically handle OCR for scanned documents
- **Confidence Scoring**: Every extraction includes a confidence assessment (High/Medium/Low)
- **Smart Allergen Detection**: Distinguishes between confirmed allergens and trace warnings
- **Unit Preservation**: Nutritional values keep their original units (no conversion)

### Allergen Detection Rules

The AI model is instructed to:
- Mark allergen as **TRUE** only if document explicitly states "contains" or equivalent
- Mark allergen as **FALSE** for "may contain traces" or cross-contamination warnings
- Search ingredient lists for emphasized allergens (bold, underlined)
- Recognize both English and Hungarian terminology

### Nutritional Value Extraction

- Searches for "Nutrition Facts" / "Tápértékadatok" sections
- Extracts values per 100g/100ml when available
- Preserves original units (kJ, kcal, g, mg)
- Does NOT calculate or estimate missing values
- Only includes fields explicitly found in the document

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o model | ✅ Yes |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google API key for Gemini model | ✅ Yes |

## Troubleshooting

### PDF extraction returns empty results
- Ensure PDF contains actual nutritional information
- Try switching between OpenAI and Gemini models
- Check PDF quality - scanned images should be clear and legible
- Verify file is under 5MB

### API errors or timeouts
- Verify API keys are correctly set in `.env.local`
- Check API key validity and account credits
- Maximum processing time is 60 seconds per document
- Large, complex PDFs may take longer to process

### Model-specific issues
- **OpenAI**: Most accurate but requires credits - check usage at [platform.openai.com](https://platform.openai.com/usage)
- **Gemini**: Faster and cost-effective - check quota at [aistudio.google.com](https://aistudio.google.com)

## Deployment

### Vercel (Recommended)

1. Push your repository to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables in project settings
4. Deploy

### Other Platforms

NutriScanner works on any platform that supports Next.js 15:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted with Node.js

## Learn More

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [Zod Schema Validation](https://zod.dev)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI integration powered by [Vercel AI SDK](https://sdk.vercel.ai/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**NutriScanner** - Making nutritional information accessible through AI
