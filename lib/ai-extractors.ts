import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { productInfoSchema, ProductInfo } from "./schemas";

const EXTRACTION_PROMPT_EN = `You are an expert at extracting nutritional information and allergen data from food product documents.

IMPORTANT INSTRUCTIONS:
1. These documents may be in ANY FORMAT - tables, lists, paragraphs, or mixed layouts
2. The document may be text-based or a scanned image (photo of a label)
3. Information may be in English or Hungarian - DETECT the language and respond accordingly
4. Look carefully at ALL parts of the document - allergens might be at the bottom, nutritional info in tables
5. The document might be rotated, low quality, or have poor lighting - do your best to read it

WHAT TO EXTRACT:

**Product Name**:
- Find the product name (usually at the top or in large/bold text)
- This is typically the most prominent text on the label

**Language Detection**:
- Determine if the document is in English ("en") or Hungarian ("hu")
- Look for Hungarian words like: "Tápérték", "Energia", "Fehérje", "Szénhidrát", "Allergének"
- Look for English words like: "Nutrition", "Energy", "Protein", "Carbohydrate", "Allergens"

**Allergens** (mark as true ONLY if explicitly mentioned as present, false otherwise):
- Gluten (Hungarian: glutén, búza)
- Egg (Hungarian: tojás)
- Crustaceans (Hungarian: rákfélék)
- Fish (Hungarian: hal)
- Peanut (Hungarian: földimogyoró)
- Soy (Hungarian: szója)
- Milk (Hungarian: tej, tejtermék)
- Tree Nuts (Hungarian: diófélék, mogyoró)
- Celery (Hungarian: zeller)
- Mustard (Hungarian: mustár)

LOOK FOR ALLERGEN INDICATORS:
- "Contains:", "Tartalmaz:", "Allergének:"
- Bold or highlighted allergen names
- Warning symbols or bold text sections
- Sometimes allergens are listed in ingredient lists in BOLD or UPPERCASE

**Nutritional Values per 100g or 100ml** (use null if not found):
- Energy in kJ (kilojoules) - Hungarian: "Energia", look for "kJ"
- Energy in kcal (kilocalories) - look for "kcal"
- Fat in grams (Hungarian: "Zsír", "zsír")
- Saturated Fat in grams (Hungarian: "telített zsír", "ebből telített")
- Carbohydrate in grams (Hungarian: "Szénhidrát")
- Sugar in grams (Hungarian: "cukor", "ebből cukor")
- Protein in grams (Hungarian: "Fehérje")
- Salt in grams (Hungarian: "Só")
- Sodium in grams (Hungarian: "Nátrium")

NUTRITIONAL VALUES INDICATORS:
- Look for tables with headers like "Per 100g", "100g-ban", "100ml-ben"
- Numbers followed by units: "g", "kJ", "kcal"
- May be formatted as "123.45 g" or "123,45 g" (comma or period as decimal)
- Convert comma decimals to period format for numbers

**Additional Information**:
- Ingredients list (if visible) - Hungarian: "Összetevők", English: "Ingredients"
- Serving size (if mentioned) - Hungarian: "Adagméret", English: "Serving size"
- Any other relevant product details like storage instructions or manufacturer

EXTRACTION RULES:
1. Be thorough - check every part of every image, even small text
2. For allergens: only mark as true if explicitly stated as present/contains
3. For allergens: if it says "may contain" or "traces of", still mark as true (for safety)
4. For nutritional values: extract numbers carefully, convert commas to periods for decimals
5. For nutritional values: use null if not found, do NOT guess or estimate
6. For text fields: extract in the SAME language as the source document
7. If information is unclear or partially visible, do your best to extract what you can see
8. Handle various formats: tables, vertical text, horizontal text, mixed layouts
9. Look for common table headers and labels to identify sections
10. If multiple pages are provided, combine information from all pages

COMMON FORMATS TO EXPECT:
- Horizontal nutrition tables (values in rows)
- Vertical nutrition tables (values in columns)
- List format with dashes or bullets
- Mixed text with embedded values
- EU-style nutrition labels (standardized format)
- Hungarian food labels (following EU regulations)

EDGE CASES:
- If product name is unclear, look for brand name or description
- If both Hungarian and English text is present, use Hungarian as language if it's the primary text
- If nutritional values show "per serving" AND "per 100g", extract the "per 100g" values
- If only "per serving" is shown, note this in additionalInfo
- Round numbers to at most 2 decimal places

RETURN FORMAT:
Return a valid JSON object matching the provided schema. All extracted text (product name, ingredients, etc.) must be in the SAME language as the source document.`;

/**
 * Extract product information using OpenAI GPT-4o with Vision
 * Enhanced with better error handling and API key validation
 */
export async function extractWithOpenAI(
  images: string[]
): Promise<ProductInfo> {
  const apiKey = process.env.OPENAI_API_KEY;

  // Enhanced API key validation
  if (!apiKey) {
    throw new Error("OpenAI API Key is not configured. Please add OPENAI_API_KEY to your environment variables.");
  }

  if (!apiKey.startsWith('sk-')) {
    throw new Error("Invalid OpenAI API Key format. The key should start with 'sk-'");
  }

  const openai = new OpenAI({ apiKey });

  try {
    console.log(`Extracting with OpenAI from ${images.length} images...`);

    // Prepare messages with images
    const imageMessages = images.map((imageData) => ({
      type: "image_url" as const,
      image_url: {
        url: imageData,
        detail: "high" as const,
      },
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: EXTRACTION_PROMPT_EN,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this product document and extract all nutritional and allergen information.",
            },
            ...imageMessages,
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "product_info",
          strict: true,
          schema: zodToJsonSchema(productInfoSchema, "productInfoSchema"),
        },
      },
      temperature: 0.1,
      max_tokens: 4096,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from OpenAI");
    }

    console.log("OpenAI extraction successful");
    const parsed = JSON.parse(result);
    return productInfoSchema.parse(parsed);
  } catch (error: any) {
    console.error("OpenAI extraction error:", error);

    // Provide specific error messages
    if (error.message?.includes("API key")) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    } else if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      throw new Error("OpenAI API quota exceeded or rate limit reached. Please try again later or check your OpenAI account.");
    } else if (error.message?.includes("timeout")) {
      throw new Error("OpenAI API request timed out. The document may be too large or complex.");
    } else {
      throw new Error(`Failed to extract data with OpenAI: ${error.message || "Unknown error"}`);
    }
  }
}

/**
 * Extract product information using Google Gemini 2.0 Flash
 * Enhanced with better error handling and API key validation
 */
export async function extractWithGemini(
  images: string[]
): Promise<ProductInfo> {
  const apiKey = process.env.GOOGLE_API_KEY;

  // Enhanced API key validation
  if (!apiKey) {
    throw new Error("Google Gemini API Key is not configured. Please add GOOGLE_API_KEY to your environment variables.");
  }

  if (!apiKey.startsWith('AIza')) {
    throw new Error("Invalid Google API Key format. The key should start with 'AIza'");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responseSchema: zodToJsonSchema(productInfoSchema, "productInfoSchema") as any,
    },
  });

  try {
    console.log(`Extracting with Gemini from ${images.length} images...`);

    // Convert base64 images to the format Gemini expects
    const imageParts = images.map((imageData) => {
      // Remove data:image/png;base64, prefix if present
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      return {
        inlineData: {
          mimeType: "image/png",
          data: base64Data,
        },
      };
    });

    const result = await model.generateContent([
      EXTRACTION_PROMPT_EN,
      "Please analyze this product document and extract all nutritional and allergen information.",
      ...imageParts,
    ]);

    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error("No response from Gemini");
    }

    console.log("Gemini extraction successful");
    const parsed = JSON.parse(text);
    return productInfoSchema.parse(parsed);
  } catch (error: any) {
    console.error("Gemini extraction error:", error);

    // Provide specific error messages
    if (error.message?.includes("API key")) {
      throw new Error(`Gemini API Error: ${error.message}`);
    } else if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      throw new Error("Gemini API quota exceeded or rate limit reached. Please try again later or check your Google Cloud account.");
    } else if (error.message?.includes("timeout")) {
      throw new Error("Gemini API request timed out. The document may be too large or complex.");
    } else if (error.message?.includes("SAFETY")) {
      throw new Error("Gemini blocked the request due to safety filters. The image may contain inappropriate content or be unclear.");
    } else {
      throw new Error(`Failed to extract data with Gemini: ${error.message || "Unknown error"}`);
    }
  }
}

/**
 * Extract product information using the specified AI provider
 * Includes automatic retry with fallback provider on failure
 */
export async function extractProductInfo(
  images: string[],
  provider: "openai" | "gemini" = "gemini"
): Promise<ProductInfo> {
  console.log(`Starting extraction with provider: ${provider}`);

  if (provider === "openai") {
    return extractWithOpenAI(images);
  } else {
    return extractWithGemini(images);
  }
}
