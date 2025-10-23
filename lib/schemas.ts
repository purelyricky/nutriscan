import { z } from "zod";

// Allergen schema
export const allergenSchema = z.object({
  gluten: z.boolean().describe("Contains gluten (Glutén)"),
  egg: z.boolean().describe("Contains egg (Tojás)"),
  crustaceans: z.boolean().describe("Contains crustaceans (Rák)"),
  fish: z.boolean().describe("Contains fish (Hal)"),
  peanut: z.boolean().describe("Contains peanut (Földimogyoró)"),
  soy: z.boolean().describe("Contains soy (Szója)"),
  milk: z.boolean().describe("Contains milk (Tej)"),
  treeNuts: z.boolean().describe("Contains tree nuts (Diófélék)"),
  celery: z.boolean().describe("Contains celery (Zeller)"),
  mustard: z.boolean().describe("Contains mustard (Mustár)"),
});

// Nutritional value schema
export const nutritionalValueSchema = z.object({
  energy: z.string().optional().describe("Energy value (Energia) - include unit (kJ/kcal)"),
  fat: z.string().optional().describe("Fat content (Zsír) - include unit (g)"),
  carbohydrate: z.string().optional().describe("Carbohydrate content (Szénhidrát) - include unit (g)"),
  sugar: z.string().optional().describe("Sugar content (Cukor) - include unit (g)"),
  protein: z.string().optional().describe("Protein content (Fehérje) - include unit (g)"),
  sodium: z.string().optional().describe("Sodium content (Nátrium) - include unit (mg/g)"),
});

// Complete extraction result schema
export const extractionResultSchema = z.object({
  allergens: allergenSchema.describe("Allergen information extracted from the document"),
  nutritionalValues: nutritionalValueSchema.describe("Nutritional values extracted from the document"),
  detectedLanguage: z.enum(["hungarian", "english", "both", "unknown"]).describe("The language detected in the document"),
  productName: z.string().optional().describe("Product name if found in the document"),
  confidence: z.enum(["high", "medium", "low"]).optional().describe("Confidence level of the extraction"),
});

export type Allergen = z.infer<typeof allergenSchema>;
export type NutritionalValue = z.infer<typeof nutritionalValueSchema>;
export type ExtractionResult = z.infer<typeof extractionResultSchema>;
