import { extractionResultSchema } from "@/lib/schemas";
import { EXTRACTION_SYSTEM_PROMPT } from "@/lib/system-prompt";
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { files } = await req.json();

    console.log("Gemini API: Received request", {
      filesCount: files?.length,
      firstFileSize: files?.[0]?.data?.length
    });

    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    let firstFile = files[0].data;

    // Ensure data is in proper data URL format
    if (!firstFile.startsWith('data:')) {
      firstFile = `data:application/pdf;base64,${firstFile}`;
    }

    console.log("Gemini API: First file data format:", firstFile.substring(0, 50));

    // Convert data URL to Buffer (Gemini works with Buffer)
    const base64Data = firstFile.split(',')[1];
    const fileBuffer = Buffer.from(base64Data, 'base64');

    console.log("Gemini API: Buffer created, size:", fileBuffer.length);

    const result = streamObject({
      model: google("gemini-2.0-flash-exp"),
      messages: [
        {
          role: "system",
          content: EXTRACTION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract allergen information and nutritional values from this food product PDF. The document may be in Hungarian or English, and may be structured or unstructured. IMPORTANT: You must return a complete response with all required allergen fields set to true or false, and confidence level is REQUIRED.${files[0].name ? `\n\nDocument filename: ${files[0].name}` : ''}`,
            },
            {
              type: "file",
              data: fileBuffer,
              mediaType: "application/pdf",
            },
          ],
        },
      ],
      schema: extractionResultSchema,
      onFinish: ({ object, error }) => {
        console.log("Gemini API: Stream finished, validating result");

        if (error) {
          console.error("Gemini API: Stream error:", error);
          return;
        }

        if (!object) {
          console.error("Gemini API: No object returned from AI model");
          return;
        }

        const res = extractionResultSchema.safeParse(object);
        if (res.error) {
          console.error("Gemini API: Validation error:", res.error);
          console.error("Gemini API: Received object:", JSON.stringify(object, null, 2));
        } else {
          console.log("Gemini API: Validation successful");
        }
      },
    });

    console.log("Gemini API: Starting stream response");
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Gemini API: Error in POST handler:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
