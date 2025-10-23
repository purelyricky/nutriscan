# NutriScanner User Guide

Welcome to NutriScanner! This guide will help you extract allergen information and nutritional values from food product PDFs.

## Getting Started

### What is NutriScanner?

NutriScanner is a web application that uses AI to automatically extract:
- **Allergen information** (10 common allergens)
- **Nutritional values** (Energy, Fat, Carbohydrate, Sugar, Protein, Sodium)

from food product description PDFs.

### Supported Documents

NutriScanner can handle:
- ✅ Regular PDF documents
- ✅ Scanned (image-based) PDFs
- ✅ Hungarian language documents
- ✅ English language documents
- ✅ Documents with both languages
- ✅ Unstructured data (tables, lists, paragraphs)

**File Size Limit**: Maximum 5MB per PDF

## How to Use NutriScanner

### Step 1: Select AI Model

Choose your preferred AI model:
- **Google Gemini Pro**: Google's advanced AI model
- **OpenAI GPT-4**: OpenAI's powerful language model

Both models provide excellent results. Choose based on your API key availability.

### Step 2: Upload PDF

You have two options to upload your PDF:

**Option A: Drag & Drop**
1. Drag your PDF file
2. Drop it onto the upload area

**Option B: Click to Browse**
1. Click on the upload area
2. Select your PDF file from your computer

### Step 3: Extract Information

1. Click the "Extract Information" button
2. Wait while the AI analyzes your document
3. You'll see a progress bar during extraction

### Step 4: Review Results

Once extraction is complete, you'll see two tables:

**Allergens Table**
- Shows all 10 allergens with their names in both English and Hungarian
- ✓ (green checkmark) = Allergen is present
- ✗ (red X) = Allergen is not present

**Nutritional Values Table**
- Shows 6 nutritional components
- Values include their units (g, mg, kJ, kcal)
- "Not found" indicates the value wasn't detected in the document

### Step 5: Scan Another Document

Click "Scan Another" button to analyze a new PDF document.

## Allergens Detected

NutriScanner identifies these 10 common allergens:

| English | Hungarian |
|---------|-----------|
| Gluten | Glutén |
| Egg | Tojás |
| Crustaceans | Rák |
| Fish | Hal |
| Peanut | Földimogyoró |
| Soy | Szója |
| Milk | Tej |
| Tree nuts | Diófélék |
| Celery | Zeller |
| Mustard | Mustár |

## Nutritional Values Extracted

| Nutrient | Unit | Hungarian |
|----------|------|-----------|
| Energy | kJ/kcal | Energia |
| Fat | g | Zsír |
| Carbohydrate | g | Szénhidrát |
| Sugar | g | Cukor |
| Protein | g | Fehérje |
| Sodium | mg/g | Nátrium |

## Tips for Best Results

### Document Quality
- Use clear, readable PDFs when possible
- Scanned documents should be at least 300 DPI
- Avoid heavily distorted or blurry images

### Document Structure
- The AI can handle any format (tables, lists, paragraphs)
- No specific structure is required
- Both structured and unstructured data are supported

### Language
- Documents can be in Hungarian, English, or both
- The AI automatically detects the language
- Mixed-language documents are fully supported

### Allergen Information
- Allergens must be explicitly mentioned in the document
- The AI marks allergens as present only when clearly stated
- "May contain" warnings are not marked as confirmed allergens

### Nutritional Values
- Values are extracted with their units
- If multiple formats exist (e.g., kJ and kcal for energy), both may be captured
- Missing values will show as "Not found"

## Troubleshooting

### PDF Won't Upload
- Check file size (must be under 5MB)
- Ensure the file is a PDF (not DOC, JPG, etc.)
- Try converting scanned images to PDF format

### Extraction Failed
- Verify your internet connection
- Check that API keys are configured correctly
- Try a different AI model
- Ensure the PDF contains readable text or clear images

### Incorrect Results
- Verify the source document contains the information
- Try uploading a clearer version of the document
- Switch to a different AI model for comparison

### Slow Processing
- Large PDFs take longer to process
- Scanned documents require OCR processing
- Complex layouts may need more time

## Privacy & Security

- PDFs are processed securely
- Files are not stored permanently
- Data is transmitted via encrypted connections
- API keys are stored securely in environment variables

## Example Documents

For testing, you can use the example food product PDFs available in the project documentation.

## Support

For technical issues or questions:
1. Check the DEVELOPER_DOCUMENTATION.md for technical details
2. Review the README.md for setup instructions
3. Contact your system administrator

## Version Information

**Current Version**: 1.0.0
**Last Updated**: October 2025

---

Thank you for using NutriScanner! We hope this tool makes nutritional information extraction quick and easy.
