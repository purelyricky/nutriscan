import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { zodToJsonSchema } from "zod-to-json-schema";
import { productInfoSchema, ProductInfo } from "./schemas";

const EXTRACTION_PROMPT_EN = `You are an expert at extracting nutritional information and allergen data from food product documents.

Analyze this product document and extract the following information:
1. Product name
2. Allergens (gluten, egg, crustaceans, fish, peanut, soy, milk, tree nuts, celery, mustard)
3. Nutritional values per 100g or 100ml (energy in kJ and kcal, fat, saturated fat, carbohydrate, sugar, protein, salt, sodium)
4. Ingredients list (if available)
5. Serving size (if available)
6. Any additional relevant information

The document may be in Hungarian or English. Detect the language and return all extracted text in the SAME language as the source document.

For allergens, mark as true if present, false if not present or not mentioned.
For nutritional values, use null if the value is not found in the document.

Be thorough and extract all available information. Handle both structured tables and unstructured text formats.`;

/**
 * Extract product information using OpenAI GPT-4o with Vision
 */
export async function extractWithOpenAI(
  images: string[]
): Promise<ProductInfo> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const openai = new OpenAI({ apiKey });

  try {
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
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(result);
    return productInfoSchema.parse(parsed);
  } catch (error) {
    console.error("OpenAI extraction error:", error);
    throw new Error("Failed to extract data with OpenAI");
  }
}

/**
 * Extract product information using Google Gemini 2.0 Flash
 */
export async function extractWithGemini(
  images: string[]
): Promise<ProductInfo> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is not configured");
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

    const parsed = JSON.parse(text);
    return productInfoSchema.parse(parsed);
  } catch (error) {
    console.error("Gemini extraction error:", error);
    throw new Error("Failed to extract data with Gemini");
  }
}

/**
 * Extract product information using the specified AI provider
 */
export async function extractProductInfo(
  images: string[],
  provider: "openai" | "gemini" = "gemini"
): Promise<ProductInfo> {
  if (provider === "openai") {
    return extractWithOpenAI(images);
  } else {
    return extractWithGemini(images);
  }
}
