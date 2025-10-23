# NutriScanner - AI-Powered Nutritional Information Extractor

NutriScanner is a web application that automatically extracts allergen information and nutritional values from food product PDF documents using AI. It supports both Hungarian and English documents, including scanned images.

## Features

- 📄 **PDF Support**: Upload regular PDFs or scanned (image-based) PDFs
- 🌍 **Multi-language**: Handles Hungarian and English documents gracefully
- 🤖 **Multiple AI Models**: Choose between Google Gemini Pro and OpenAI GPT-4
- 🥜 **Allergen Detection**: Identifies 10 common allergens (Gluten, Egg, Crustaceans, Fish, Peanut, Soy, Milk, Tree nuts, Celery, Mustard)
- 📊 **Nutritional Values**: Extracts Energy, Fat, Carbohydrate, Sugar, Protein, and Sodium values
- 🎯 **Unstructured Data**: Works with tables, lists, and unstructured text formats

## Extracted Data

### Allergens
- Gluten (Glutén)
- Egg (Tojás)
- Crustaceans (Rák)
- Fish (Hal)
- Peanut (Földimogyoró)
- Soy (Szója)
- Milk (Tej)
- Tree nuts (Diófélék)
- Celery (Zeller)
- Mustard (Mustár)

### Nutritional Values
- Energy (Energia) - in kJ/kcal
- Fat (Zsír) - in grams
- Carbohydrate (Szénhidrát) - in grams
- Sugar (Cukor) - in grams
- Protein (Fehérje) - in grams
- Sodium (Nátrium) - in mg/g

## Setup

### Prerequisites

- Node.js 18+ installed
- API keys for:
  - Google Gemini API (if using Gemini)
  - OpenAI API (if using GPT-4)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nutriscanner.git
cd nutriscanner
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Select AI Model**: Choose between Google Gemini Pro or OpenAI GPT-4
2. **Upload PDF**: Drag and drop or click to browse for a PDF file (max 5MB)
3. **Extract**: Click "Extract Information" to start the analysis
4. **View Results**: Review the extracted allergens and nutritional values in structured tables

## Tech Stack

- **Framework**: Next.js 15
- **AI SDK**: Vercel AI SDK
- **AI Models**: Google Gemini Pro, OpenAI GPT-4
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Language**: TypeScript

## Project Structure

```
nutriscanner/
├── app/
│   ├── (preview)/
│   │   ├── page.tsx          # Main application page
│   │   └── layout.tsx         # Layout with metadata
│   └── api/
│       └── extract/
│           └── route.ts       # API route for extraction
├── components/
│   └── ui/
│       ├── results-table.tsx  # Results display component
│       └── ...                # Other UI components
├── lib/
│   └── schemas.ts             # Zod schemas for validation
└── README.md
```

## Development Notes

- The application uses streaming responses for real-time progress updates
- PDF files are converted to base64 before being sent to the AI model
- The AI models handle OCR for scanned documents automatically
- Allergens are marked as boolean values (present/not present)
- Nutritional values include units (g, mg, kJ, kcal)

## Learn More

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google Gemini API](https://ai.google.dev/)
- [OpenAI API](https://platform.openai.com/docs)

## License

MIT License - feel free to use this project for your own purposes.

