import { extractionResultSchema } from "@/lib/schemas";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { files, model } = await req.json();

    console.log("API: Received request", {
      filesCount: files?.length,
      model,
      firstFileSize: files?.[0]?.data?.length
    });

    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    const firstFile = files[0].data;

    // Select the AI model based on user preference
    const selectedModel = model === "openai"
      ? openai("gpt-4o")
      : google("gemini-1.5-pro-latest");

    console.log("API: Using model:", model === "openai" ? "OpenAI GPT-4" : "Google Gemini");

    const systemPrompt = `You are an expert nutritional information extraction assistant. Your job is to analyze food product description PDFs and extract allergen information and nutritional values.

CRITICAL: You MUST ALWAYS return a valid response object, even if the PDF doesn't contain nutritional information. Never return undefined or null.

IMPORTANT INSTRUCTIONS:
1. The document may be in Hungarian, English, or both languages - handle both gracefully
2. The document may be a scanned image or a regular PDF - extract text accordingly
3. The data may be unstructured, in tables, or in lists - parse all formats
4. For allergens, mark as true ONLY if explicitly mentioned as present/contains, otherwise mark as false
5. For nutritional values, extract the exact values WITH their units (g, mg, kJ, kcal, etc.)
6. If a nutritional value is not found, omit that field (don't include it)
7. Detect the primary language used in the document
8. Extract the product name if clearly stated
9. ALWAYS provide all required allergen fields (all must be true or false, never undefined)

ALLERGENS TO DETECT (all fields required):
- gluten: Gluten (Glutén) - REQUIRED boolean
- egg: Egg (Tojás) - REQUIRED boolean
- crustaceans: Crustaceans (Rák) - REQUIRED boolean
- fish: Fish (Hal) - REQUIRED boolean
- peanut: Peanut (Földimogyoró) - REQUIRED boolean
- soy: Soy (Szója) - REQUIRED boolean
- milk: Milk (Tej) - REQUIRED boolean
- treeNuts: Tree nuts (Diófélék) - REQUIRED boolean
- celery: Celery (Zeller) - REQUIRED boolean
- mustard: Mustard (Mustár) - REQUIRED boolean

NUTRITIONAL VALUES TO EXTRACT (optional, only include if found):
- energy: Energy (Energia) - in kJ and/or kcal
- fat: Fat (Zsír) - in grams
- carbohydrate: Carbohydrate (Szénhidrát) - in grams
- sugar: Sugar (Cukor) - in grams
- protein: Protein (Fehérje) - in grams
- sodium: Sodium (Nátrium) - in mg or g

Be thorough and accurate. When in doubt, mark allergens as false rather than making assumptions.
If the document is not a food product label or doesn't contain relevant information, still return the response with all allergens set to false and detectedLanguage set appropriately.`;

    const result = streamObject({
      model: selectedModel,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract allergen information and nutritional values from this food product PDF. The document may be in Hungarian or English, and may be structured or unstructured. IMPORTANT: You must return a complete response with all required allergen fields set to true or false.",
            },
            {
              type: "file",
              data: firstFile,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
      schema: extractionResultSchema,
      onFinish: ({ object, error }) => {
        console.log("API: Stream finished, validating result");

        if (error) {
          console.error("API: Stream error:", error);
          return;
        }

        if (!object) {
          console.error("API: No object returned from AI model");
          return;
        }

        const res = extractionResultSchema.safeParse(object);
        if (res.error) {
          console.error("API: Validation error:", res.error);
          console.error("API: Received object:", JSON.stringify(object, null, 2));
        } else {
          console.log("API: Validation successful");
        }
      },
    });

    console.log("API: Starting stream response");
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("API: Error in POST handler:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
