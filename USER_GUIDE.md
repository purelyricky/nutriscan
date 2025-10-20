# NutriScan User Guide

Welcome to NutriScan! This guide will help you get started with extracting nutritional information and allergen data from your food product documents.

## What is NutriScan?

NutriScan is an AI-powered tool that automatically reads food product PDFs and extracts:
- **Allergen information** (gluten, milk, eggs, nuts, etc.)
- **Nutritional values** (calories, protein, fat, carbohydrates, etc.)
- **Ingredients lists**
- **Product details**

No more manual data entry - just upload your PDF and let AI do the work!

---

## Getting Started

### Step 1: Open NutriScan

Navigate to the NutriScan website in your web browser. You'll see a clean interface with two main sections:
- **Left side**: Upload area
- **Right side**: Results display

### Step 2: Upload Your PDF

1. Click on the upload area or drag and drop your PDF file
2. Make sure your file is:
   - **PDF format** (.pdf extension)
   - **Food product documentation** (nutrition labels, product specs, etc.)
   - **In English or Hungarian**

**Supported PDF types:**
- Text-based PDFs (digital documents)
- Scanned PDFs (images of printed documents)
- Multi-page documents

### Step 3: Choose AI Provider

Select which AI model to use for extraction:

- **Google Gemini 2.0** (Default)
  - Faster processing
  - More cost-effective
  - Great for most documents

- **OpenAI GPT-4o**
  - Higher accuracy
  - Better with complex layouts
  - Slightly slower

**Tip:** Start with Gemini - it works great for most cases!

### Step 4: Extract Data

Click the **"Extract Data"** or **"Elemzés Indítása"** button (Hungarian).

**What happens next:**
1. Your PDF is uploaded securely
2. AI analyzes the document (takes 10-20 seconds)
3. Results appear on the right side

### Step 5: Review Results

The results are organized into clear sections:

#### Product Name
The name of the food product is displayed at the top.

#### Allergens
A grid showing all 10 common allergens:
- ✅ **Green boxes** = Allergen NOT present (safe)
- ⚠️ **Red boxes** = Allergen IS present (warning)

**Allergens checked:**
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

#### Nutritional Values
All nutritional information per 100g or 100ml:
- **Energy**: Listed in both kJ and kcal
- **Fat**: Total fat and saturated fat
- **Carbohydrate**: Total carbs and sugars
- **Protein**: Protein content
- **Salt/Sodium**: Salt or sodium content

#### Additional Information
- **Ingredients**: Full list of ingredients (if available)
- **Serving Size**: Recommended serving size (if available)
- **Other Details**: Any other relevant information

---

## Tips for Best Results

### Document Quality
- ✅ **DO**: Use high-resolution scans (300 DPI or higher)
- ✅ **DO**: Ensure text is readable and not blurry
- ✅ **DO**: Make sure nutritional tables are fully visible
- ❌ **DON'T**: Use password-protected PDFs
- ❌ **DON'T**: Upload extremely large files (> 50MB)

### If Results Aren't Accurate

1. **Try the other AI provider**
   - Switch between Gemini and OpenAI
   - Sometimes one works better than the other

2. **Check your PDF**
   - Is the nutrition table clear?
   - Is the text legible?
   - Are important sections cut off?

3. **Re-scan your document** (if it's a scan)
   - Use higher resolution
   - Ensure good lighting
   - Keep document flat and aligned

---

## Language Support

### Automatic Language Detection

NutriScan automatically detects whether your document is in:
- **English** 🇬🇧
- **Hungarian** 🇭🇺

The interface and results will adapt to match your document's language!

### Hungarian Interface

If your PDF is in Hungarian, you'll see:
- "Allergének" instead of "Allergens"
- "Tápértékek" instead of "Nutritional Values"
- "Összetevők" instead of "Ingredients"
- All labels in Hungarian

---

## Common Questions

### How long does extraction take?

Typically **10-20 seconds**, depending on:
- Document complexity
- Number of pages
- AI provider selected

### Is my data secure?

Yes! Your PDFs are:
- Processed in real-time
- Not stored on any server
- Deleted immediately after processing
- Never shared with third parties

### What if some values are missing?

If the AI can't find certain information in your document, those fields will simply not appear in the results. This is normal - not all documents contain all information.

### Can I process multiple documents?

Yes! After reviewing your results, click **"Clear"** or **"Törlés"** to upload another document.

### What file size is supported?

- **Recommended**: Under 10MB
- **Maximum**: 50MB
- **Pages**: Up to 20 pages

---

## Example Workflow

### Scenario: Analyzing a Hungarian Product

1. **You have**: A scanned PDF of "Édes Anna Paprikakrém" product specification
2. **Upload**: Drag the PDF to NutriScan
3. **Select**: Gemini (default)
4. **Click**: "Elemzés Indítása"
5. **Wait**: ~15 seconds
6. **Results**:
   - Product Name: "UNIVER ÉDES ANNA 200 GR"
   - Allergens: Mustard detected (red), others safe (green)
   - Nutritional Values: Full breakdown displayed
   - Ingredients: Listed in Hungarian
   - Language: Hungarian interface

### Scenario: Analyzing an English Product

1. **You have**: A digital PDF of nutrition facts
2. **Upload**: Click upload area and select file
3. **Select**: OpenAI GPT-4o (for high accuracy)
4. **Click**: "Extract Data"
5. **Wait**: ~12 seconds
6. **Results**:
   - Product Name: "Organic Pork Tenderloin"
   - Allergens: All safe (green)
   - Nutritional Values: Complete profile
   - Language: English interface

---

## Troubleshooting

### "Please upload a PDF file" error
**Cause**: You're trying to upload a non-PDF file
**Solution**: Convert your file to PDF first (use Word, scanner software, or online converters)

### "Failed to process PDF file" error
**Cause**: PDF is corrupted or protected
**Solution**: Try re-saving or re-scanning the PDF

### "OPENAI_API_KEY is not configured" error
**Cause**: OpenAI provider is not set up (administrator issue)
**Solution**: Use Gemini provider instead, or contact administrator

### Slow extraction (> 30 seconds)
**Cause**: Large file or complex document
**Solution**:
- Try splitting multi-page PDFs
- Compress the PDF file
- Use Gemini (usually faster)

### Inaccurate allergen detection
**Cause**: Document doesn't clearly list allergens
**Solution**:
- Verify allergen information is visible in PDF
- Try the alternative AI provider
- Manually verify critical allergen information

---

## Keyboard Shortcuts

- **Upload file**: Click upload area or drag & drop
- **Clear file**: Click X button or "Clear" button
- **Scroll results**: Use mouse wheel or touchpad

---

## Mobile Usage

NutriScan works on mobile devices!

### Mobile Tips:
- Use landscape mode for better layout
- Tap upload area to select PDF from your device
- Results scroll smoothly
- All features work the same as desktop

---

## Export Results (Future Feature)

Currently, results are displayed on screen. Future versions will support:
- Export to Excel
- Export to CSV
- Print-friendly format
- Email results
- Save as JSON

---

## Privacy & Data Policy

### What We Process
- PDF documents (temporarily)
- Extracted text and data
- AI analysis results

### What We DON'T Store
- Your PDF files
- Personal information
- Usage history
- Extracted data

### Third-Party Services
- OpenAI API (if using GPT-4o)
- Google Gemini API (if using Gemini)

Both services process data according to their privacy policies.

---

## Support

### Need Help?

**For technical issues:**
- Check this user guide
- Try the alternative AI provider
- Verify your PDF is valid

**For feature requests:**
- Submit feedback through your organization
- Suggest improvements

**For bugs:**
- Note the error message
- Try to reproduce the issue
- Report to administrator with details

---

## Best Practices

### ✅ DO:
- Use clear, high-quality PDFs
- Verify critical allergen information manually
- Try both AI providers for comparison
- Keep documents under 10MB

### ❌ DON'T:
- Upload sensitive personal information
- Rely solely on AI for medical/allergy decisions
- Upload extremely large files
- Use password-protected PDFs

---

## Glossary

**AI Provider**: The artificial intelligence service used to analyze your document (Gemini or OpenAI)

**Allergen**: A substance that can cause an allergic reaction

**Base64**: A way to encode files for secure transfer (technical detail)

**Extraction**: The process of pulling data from your document

**kJ/kcal**: Units of energy measurement (kilojoules/kilocalories)

**PDF**: Portable Document Format - a common file type for documents

**Saturated Fat**: A type of fat typically listed separately in nutrition facts

**Structured Data**: Information organized in a consistent, readable format

---

## Version History

- **v1.0.0** (2025-10-20)
  - Initial release
  - Support for English and Hungarian
  - Gemini and OpenAI integration
  - 10 allergen types
  - Complete nutritional value extraction

---

**Happy Scanning! 🎉**

For additional information, visit our documentation or contact support.
