import { z } from "zod";

// Allergen schema
export const allergenSchema = z.object({
  gluten: z.boolean().describe("Contains gluten"),
  egg: z.boolean().describe("Contains egg"),
  crustaceans: z.boolean().describe("Contains crustaceans"),
  fish: z.boolean().describe("Contains fish"),
  peanut: z.boolean().describe("Contains peanut"),
  soy: z.boolean().describe("Contains soy"),
  milk: z.boolean().describe("Contains milk"),
  treeNuts: z.boolean().describe("Contains tree nuts"),
  celery: z.boolean().describe("Contains celery"),
  mustard: z.boolean().describe("Contains mustard"),
});

// Nutritional values schema (per 100g/100ml)
export const nutritionSchema = z.object({
  energy: z
    .object({
      kj: z.number().nullable().describe("Energy in kilojoules (kJ)"),
      kcal: z.number().nullable().describe("Energy in kilocalories (kcal)"),
    })
    .describe("Energy content"),
  fat: z.number().nullable().describe("Fat content in grams"),
  saturatedFat: z
    .number()
    .nullable()
    .describe("Saturated fat content in grams"),
  carbohydrate: z.number().nullable().describe("Carbohydrate content in grams"),
  sugar: z.number().nullable().describe("Sugar content in grams"),
  protein: z.number().nullable().describe("Protein content in grams"),
  salt: z.number().nullable().describe("Salt content in grams"),
  sodium: z.number().nullable().describe("Sodium content in grams"),
});

// Product information schema
export const productInfoSchema = z.object({
  productName: z.string().describe("Name of the product"),
  language: z
    .enum(["en", "hu"])
    .describe("Detected language of the document (en for English, hu for Hungarian)"),
  allergens: allergenSchema.describe("Allergen information"),
  nutritionalValues: nutritionSchema.describe(
    "Nutritional values per 100g or 100ml"
  ),
  ingredients: z.string().nullable().describe("List of ingredients if available"),
  servingSize: z.string().nullable().describe("Serving size if available"),
  additionalInfo: z
    .string()
    .nullable()
    .describe("Any additional relevant information"),
});

export type ProductInfo = z.infer<typeof productInfoSchema>;
export type Allergen = z.infer<typeof allergenSchema>;
export type Nutrition = z.infer<typeof nutritionSchema>;
