# NutriScan - AI-Powered Nutrition & Allergen Analyzer

![NutriScan Demo](/assets/nutriscan.gif)

![NutriScan](https://img.shields.io/badge/AI-Powered-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

An intelligent web application that automatically extracts allergens and nutritional values from PDF documents containing food product descriptions using AI vision models.

## Features

- **PDF Document Processing**: Handles both text-based and scanned/image-based PDFs
- **Dual AI Provider Support**: Choose between Google Gemini 2.0 Flash or OpenAI GPT-4o
- **Multi-Language Support**: Automatically detects and processes documents in Hungarian and English
- **Comprehensive Allergen Detection**: Identifies 10 common allergens (gluten, egg, crustaceans, fish, peanut, soy, milk, tree nuts, celery, mustard)
- **Nutritional Value Extraction**: Extracts energy, fat, carbohydrate, sugar, protein, sodium, and salt content
- **Unstructured Data Handling**: Works with tables, lists, and any document format
- **Beautiful UI**: Clean, responsive interface with real-time extraction status
- **Structured Output**: JSON-formatted data with validated schemas

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **Lucide React** icons

### Backend
- **Next.js API Routes** (Node.js runtime)
- **pdfjs-dist** for PDF processing
- **OpenAI GPT-4o** for vision-based extraction
- **Google Gemini 2.0 Flash** for document AI
- **Zod** for schema validation

### AI Models
- [Google Gemini 2.0 Flash](https://ai.google.dev/gemini-api) - Fast, cost-effective, excellent for documents
- [OpenAI GPT-4o](https://platform.openai.com/) - High accuracy vision model with structured outputs

## How It Works

### Architecture Overview

1. **PDF Upload**: User uploads a food product PDF document
2. **PDF to Image Conversion**: Backend converts PDF pages to high-resolution images using pdfjs-dist
3. **AI Vision Analysis**: Images are sent to selected AI provider (Gemini or OpenAI)
4. **Structured Extraction**: AI extracts data following predefined JSON schema
5. **Validation**: Extracted data is validated using Zod schemas
6. **Display**: Results are beautifully rendered with language-appropriate labels

### Why Vision-Based Approach?

Unlike traditional OCR → text parsing pipelines, our vision-based approach offers:

- **Universal PDF Support**: Works with both text-based and scanned PDFs
- **Format Flexibility**: Handles tables, lists, and any document structure
- **Context Understanding**: AI models understand semantic meaning, not just text
- **No Preprocessing**: No need for separate OCR, deskewing, or noise removal
- **Higher Accuracy**: Modern vision models excel at document understanding

### Why No S3 Storage?

We removed S3 storage from the original template because:

- PDFs are processed in real-time, not stored long-term
- Direct file upload to API is more efficient
- Reduces infrastructure complexity and costs
- Both OpenAI and Gemini can process base64-encoded images directly
- Better for privacy - documents aren't stored in cloud storage

## Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for OpenAI and/or Google Gemini

### 1. Clone the Repository

```bash
git clone https://github.com/[your-username]/nutri-scan.git
cd nutri-scan
```

> **Note:** Replace `[your-username]` with your GitHub username

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini Configuration
GOOGLE_API_KEY=your_google_api_key_here

# Next.js Configuration (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Getting API Keys:**

- **OpenAI**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- **Google Gemini**: Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
npm start
```

## Usage

### Basic Workflow

1. **Upload PDF**: Click the upload area or drag and drop a PDF file
2. **Select AI Provider**: Choose between Google Gemini 2.0 or OpenAI GPT-4o
3. **Extract Data**: Click "Extract Data" button
4. **View Results**: See allergens and nutritional values displayed in a structured format

### Supported Documents

- Food product specification sheets
- Nutritional labels
- Product packaging information
- Hungarian or English language documents
- Both text-based and scanned PDFs

### Data Extracted

**Allergens (10 types):**
- Gluten (Glutén)
- Egg (Tojás)
- Crustaceans (Rákfélék)
- Fish (Hal)
- Peanut (Földimogyoró)
- Soy (Szója)
- Milk (Tej)
- Tree Nuts (Diófélék)
- Celery (Zeller)
- Mustard (Mustár)

**Nutritional Values (per 100g/100ml):**
- Energy (kJ and kcal)
- Fat
- Saturated Fat
- Carbohydrate
- Sugar
- Protein
- Salt
- Sodium

**Additional Information:**
- Product Name
- Ingredients List
- Serving Size
- Other relevant details

## API Reference

### POST `/api/extract`

Extract nutrition and allergen data from a PDF document.

**Request Body:**
```json
{
  "file": "data:application/pdf;base64,...",
  "provider": "gemini" | "openai"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "productName": "Product Name",
    "language": "en" | "hu",
    "allergens": {
      "gluten": true,
      "egg": false,
      ...
    },
    "nutritionalValues": {
      "energy": { "kj": 2000, "kcal": 478 },
      "fat": 25.0,
      "saturatedFat": 12.0,
      "carbohydrate": 50.0,
      "sugar": 15.0,
      "protein": 8.0,
      "salt": 1.2,
      "sodium": 0.48
    },
    "ingredients": "...",
    "servingSize": "100g",
    "additionalInfo": "..."
  },
  "pageCount": 2
}
```

## Project Structure

```
nutri-scan/
├── app/
│   ├── api/
│   │   └── extract/
│   │       └── route.ts          # PDF extraction API endpoint
│   ├── fonts/
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── components/
│   ├── ui/                       # Shadcn UI components
│   └── spinner.tsx               # Loading spinner
├── lib/
│   ├── ai-extractors.ts          # OpenAI & Gemini integration
│   ├── pdf-utils.ts              # PDF processing utilities
│   ├── schemas.ts                # Zod validation schemas
│   └── utils.ts                  # Utility functions
├── .env.local                    # Environment variables (create this)
├── .example.env                  # Example environment variables
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Development Guide

### Adding New Allergens

1. Update the schema in `lib/schemas.ts`:
```typescript
export const allergenSchema = z.object({
  // ... existing allergens
  newAllergen: z.boolean().describe("Contains new allergen"),
});
```

2. Add label translations in `app/page.tsx`:
```typescript
const allergenLabels: Record<string, { en: string; hu: string }> = {
  // ... existing labels
  newAllergen: { en: "New Allergen", hu: "Új Allergén" },
};
```

### Adding New Nutritional Fields

Update the nutrition schema in `lib/schemas.ts`:
```typescript
export const nutritionSchema = z.object({
  // ... existing fields
  newField: z.number().nullable().describe("Description"),
});
```

### Customizing AI Prompts

Edit prompts in `lib/ai-extractors.ts`:
- `EXTRACTION_PROMPT_EN` for English documents
- `EXTRACTION_PROMPT_HU` for Hungarian documents

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker container

## Performance & Costs

### Response Times
- PDF conversion: ~2-5 seconds
- AI extraction: ~5-15 seconds depending on document complexity and provider
- Total: ~10-20 seconds per document

### API Costs (Estimated)
- **Google Gemini 2.0 Flash**: ~$0.0001-0.0005 per document
- **OpenAI GPT-4o**: ~$0.005-0.01 per document

### Recommendations
- Use Gemini for high-volume, cost-sensitive applications
- Use GPT-4o for maximum accuracy requirements
- Implement rate limiting for production use
- Consider caching for frequently analyzed documents

## Troubleshooting

### PDF Processing Issues

**Problem**: "Failed to process PDF file"
- **Solution**: Ensure PDF is not corrupted or password-protected
- Check PDF file size (recommend < 10MB per page)

### API Errors

**Problem**: "OPENAI_API_KEY is not configured"
- **Solution**: Check `.env.local` file exists and contains valid API key
- Restart development server after adding environment variables

**Problem**: "Failed to extract data with Gemini"
- **Solution**: Verify Google API key has Gemini API enabled
- Check API quota and billing status

### Low Extraction Accuracy

- Try the alternative AI provider
- Ensure document text is legible (for scanned PDFs, use high-resolution scans)
- Check that document language is Hungarian or English
- Verify nutritional table is clearly visible

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Powered by [Google Gemini](https://ai.google.dev/gemini-api) and [OpenAI](https://openai.com/)
- PDF processing with [PDF.js](https://mozilla.github.io/pdf.js/)

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation carefully

---

**Built for accurate nutrition and allergen analysis**
