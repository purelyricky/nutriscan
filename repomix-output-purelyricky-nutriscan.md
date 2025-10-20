This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
app/
  api/
    extract/
      route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  icons/
    arrow-icon.tsx
    github-icon.tsx
    sparkles-icon.tsx
    x-icon.tsx
  ui/
    button.tsx
    card.tsx
    dropdown-menu.tsx
    label.tsx
    select.tsx
    skeleton.tsx
    toggle-group.tsx
    toggle.tsx
  spinner.tsx
lib/
  ai-extractors.ts
  pdf-utils.ts
  schemas.ts
  utils.ts
.eslintrc.json
.example.env
.gitignore
.prettierrc
components.json
DEVELOPER_DOCUMENTATION.md
next.config.mjs
package.json
postcss.config.mjs
README.md
tailwind.config.ts
tsconfig.json
USER_GUIDE.md
```

# Files

## File: app/api/extract/route.ts
````typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { pdfToImages } from "@/lib/pdf-utils";
import { extractProductInfo } from "@/lib/ai-extractors";

const requestSchema = z.object({
  file: z.string().describe("Base64-encoded PDF file"),
  provider: z
    .enum(["openai", "gemini"])
    .default("gemini")
    .describe("AI provider to use for extraction"),
});

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    const result = requestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.issues },
        { status: 400 }
      );
    }

    const { file, provider } = result.data;

    // Decode base64 PDF file
    const base64Data = file.replace(/^data:application\/pdf;base64,/, "");
    const pdfBuffer = Buffer.from(base64Data, "base64");

    // Convert PDF to images
    console.log("Converting PDF to images...");
    const { images, pageCount } = await pdfToImages(pdfBuffer);
    console.log(`Converted ${pageCount} pages to images`);

    // Extract product information using AI
    console.log(`Extracting product info using ${provider}...`);
    const productInfo = await extractProductInfo(images, provider);
    console.log("Extraction completed:", productInfo);

    return NextResponse.json({
      success: true,
      data: productInfo,
      pageCount,
    });
  } catch (error) {
    console.error("Extraction error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Extraction failed",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds timeout for API route
````

## File: app/globals.css
````css
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@keyframes spinner {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.25;
  }
}
````

## File: app/layout.tsx
````typescript
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import PlausibleProvider from "next-plausible";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NutriScan - AI-Powered Nutrition & Allergen Analyzer",
  description: "Extract nutritional values and allergen information from food product PDFs using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain="nutriscan.vercel.app" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="mt-20 flex w-full flex-col justify-between gap-4 px-4 pb-8 text-center text-sm text-gray-500 md:flex-row md:text-left">
          <p>
            Powered by{" "}
            <a
              href="https://ai.google.dev/gemini-api"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition hover:text-blue-500"
            >
              Google Gemini
            </a>{" "}
            &{" "}
            <a
              href="https://openai.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition hover:text-blue-500"
            >
              OpenAI GPT-4o
            </a>
          </p>
          <p>
            Built for accurate allergen & nutrition extraction
          </p>
        </footer>
      </body>
    </html>
  );
}
````

## File: app/page.tsx
````typescript
/* eslint-disable @next/next/no-img-element */
"use client";

import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Upload, X, FileText, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
import type { ProductInfo } from "@/lib/schemas";

const aiProviders = [
  { value: "gemini", label: "Google Gemini 2.0" },
  { value: "openai", label: "OpenAI GPT-4o" },
];

const allergenLabels: Record<string, { en: string; hu: string }> = {
  gluten: { en: "Gluten", hu: "Glutén" },
  egg: { en: "Egg", hu: "Tojás" },
  crustaceans: { en: "Crustaceans", hu: "Rákfélék" },
  fish: { en: "Fish", hu: "Hal" },
  peanut: { en: "Peanut", hu: "Földimogyoró" },
  soy: { en: "Soy", hu: "Szója" },
  milk: { en: "Milk", hu: "Tej" },
  treeNuts: { en: "Tree Nuts", hu: "Diófélék" },
  celery: { en: "Celery", hu: "Zeller" },
  mustard: { en: "Mustard", hu: "Mustár" },
};

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [provider, setProvider] = useState<"openai" | "gemini">("gemini");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    setFile(selectedFile);
    setStatus("idle");
    setProductInfo(null);
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    if (!file) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64File = await base64Promise;

      // Send to API
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: base64File,
          provider,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Extraction failed");
      }

      const result = await response.json();
      setProductInfo(result.data);
      setStatus("success");
    } catch (error) {
      console.error("Extraction error:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const clearFile = () => {
    setFile(null);
    setProductInfo(null);
    setStatus("idle");
    setErrorMessage("");
  };

  const lang = productInfo?.language || "en";

  return (
    <div className="mx-auto my-12 grid max-w-7xl grid-cols-1 gap-8 px-4 lg:grid-cols-2">
      {/* Upload Section */}
      <Card className="mx-auto w-full max-w-xl p-6">
        <h2 className="mb-1 text-center text-2xl font-bold">
          {lang === "hu" ? "NutriScan - Tápérték Elemző" : "NutriScan - Nutrition Analyzer"}
        </h2>
        <p className="mb-6 text-balance text-center text-sm text-gray-500">
          {lang === "hu"
            ? "Töltse fel az élelmiszer termék PDF dokumentumát az allergének és tápértékek automatikus kinyeréséhez."
            : "Upload a food product PDF document to automatically extract allergens and nutritional values."}
        </p>

        <div>
          {/* File Upload Area */}
          <div
            className={`${
              file ? "border-transparent" : "transition-colors hover:border-primary"
            } my-4 flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed`}
          >
            {file ? (
              <div className="relative flex w-full flex-col items-center justify-center p-4">
                <FileText className="mb-2 h-16 w-16 text-gray-400" />
                <p className="text-center text-sm font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={clearFile}
                >
                  <X className="mr-2 h-4 w-4" />
                  {lang === "hu" ? "Törlés" : "Clear"}
                </Button>
              </div>
            ) : (
              <Label
                htmlFor="pdf-upload"
                className="flex w-full grow cursor-pointer items-center justify-center"
              >
                <div className="flex flex-col items-center">
                  <Upload className="mb-2 h-8 w-8" />
                  <span className="font-medium">
                    {lang === "hu" ? "PDF Feltöltése" : "Upload PDF"}
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    {lang === "hu"
                      ? "Kattintson vagy húzza ide a fájlt"
                      : "Click or drag file here"}
                  </span>
                </div>
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </Label>
            )}
          </div>

          {/* AI Provider Selection */}
          <div className="divide-y">
            <div className="grid grid-cols-2 py-7">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {lang === "hu" ? "AI Szolgáltató" : "AI Provider"}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {lang === "hu"
                    ? "Válassza ki a használni kívánt AI modellt."
                    : "Select the AI model to use for extraction."}
                </p>
              </div>
              <ToggleGroup
                type="single"
                className="mx-auto flex flex-wrap justify-start gap-2"
                onValueChange={(value) => setProvider(value as "openai" | "gemini")}
                value={provider}
              >
                {aiProviders.map((prov) => (
                  <ToggleGroupItem
                    variant="outline"
                    key={prov.value}
                    value={prov.value}
                    className="rounded-full px-3 py-1 text-xs font-medium shadow-none data-[state=on]:bg-black data-[state=on]:text-white"
                  >
                    {prov.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 text-right">
            <Button
              onClick={handleSubmit}
              disabled={!file || status === "loading"}
              className="relative"
            >
              <span
                className={`${
                  status === "loading" ? "opacity-0" : "opacity-100"
                } whitespace-pre-wrap text-center font-semibold leading-none tracking-tight text-white`}
              >
                {lang === "hu" ? "Elemzés Indítása" : "Extract Data"}
              </span>

              {status === "loading" && (
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <Spinner className="size-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {status === "idle" ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl bg-gray-50 lg:h-auto">
          <FileText className="mb-4 h-16 w-16 text-gray-300" />
          <p className="text-center text-xl text-gray-500">
            {lang === "hu"
              ? "Az elemzési eredmények itt jelennek meg"
              : "Extraction results will appear here"}
          </p>
        </div>
      ) : status === "error" ? (
        <Card className="mx-auto w-full max-w-xl p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
            <h3 className="mb-2 text-xl font-semibold text-red-600">
              {lang === "hu" ? "Hiba történt" : "Error Occurred"}
            </h3>
            <p className="text-sm text-gray-600">{errorMessage}</p>
          </div>
        </Card>
      ) : (
        <Card className="mx-auto w-full max-w-xl p-6">
          <div className="space-y-6">
            {status === "loading" ? (
              <>
                <Skeleton className="h-10 w-3/4" />
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </>
            ) : productInfo ? (
              <>
                {/* Product Name */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {productInfo.productName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {lang === "hu" ? "Nyelv: Magyar" : "Language: English"}
                  </p>
                </div>

                {/* Allergens */}
                <div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
                    {lang === "hu" ? "Allergének" : "Allergens"}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(productInfo.allergens).map(([key, value]) => (
                      <div
                        key={key}
                        className={`flex items-center rounded-lg border px-3 py-2 ${
                          value
                            ? "border-red-300 bg-red-50"
                            : "border-green-300 bg-green-50"
                        }`}
                      >
                        {value ? (
                          <AlertCircle className="mr-2 h-4 w-4 text-red-600" />
                        ) : (
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            value ? "text-red-900" : "text-green-900"
                          }`}
                        >
                          {allergenLabels[key][lang]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nutritional Values */}
                <div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
                    {lang === "hu"
                      ? "Tápértékek (100g/100ml-re)"
                      : "Nutritional Values (per 100g/100ml)"}
                  </h4>
                  <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
                    {/* Energy */}
                    {(productInfo.nutritionalValues.energy.kj ||
                      productInfo.nutritionalValues.energy.kcal) && (
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="font-medium">
                          {lang === "hu" ? "Energia" : "Energy"}
                        </span>
                        <span>
                          {productInfo.nutritionalValues.energy.kj && (
                            <>{productInfo.nutritionalValues.energy.kj} kJ</>
                          )}
                          {productInfo.nutritionalValues.energy.kj &&
                            productInfo.nutritionalValues.energy.kcal &&
                            " / "}
                          {productInfo.nutritionalValues.energy.kcal && (
                            <>{productInfo.nutritionalValues.energy.kcal} kcal</>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Fat */}
                    {productInfo.nutritionalValues.fat !== null && (
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="font-medium">
                          {lang === "hu" ? "Zsír" : "Fat"}
                        </span>
                        <span>{productInfo.nutritionalValues.fat} g</span>
                      </div>
                    )}

                    {/* Saturated Fat */}
                    {productInfo.nutritionalValues.saturatedFat !== null && (
                      <div className="flex justify-between border-b border-gray-200 pb-2 pl-4">
                        <span className="text-sm">
                          {lang === "hu" ? "ebből telített" : "of which saturated"}
                        </span>
                        <span className="text-sm">
                          {productInfo.nutritionalValues.saturatedFat} g
                        </span>
                      </div>
                    )}

                    {/* Carbohydrate */}
                    {productInfo.nutritionalValues.carbohydrate !== null && (
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="font-medium">
                          {lang === "hu" ? "Szénhidrát" : "Carbohydrate"}
                        </span>
                        <span>{productInfo.nutritionalValues.carbohydrate} g</span>
                      </div>
                    )}

                    {/* Sugar */}
                    {productInfo.nutritionalValues.sugar !== null && (
                      <div className="flex justify-between border-b border-gray-200 pb-2 pl-4">
                        <span className="text-sm">
                          {lang === "hu" ? "ebből cukor" : "of which sugars"}
                        </span>
                        <span className="text-sm">
                          {productInfo.nutritionalValues.sugar} g
                        </span>
                      </div>
                    )}

                    {/* Protein */}
                    {productInfo.nutritionalValues.protein !== null && (
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="font-medium">
                          {lang === "hu" ? "Fehérje" : "Protein"}
                        </span>
                        <span>{productInfo.nutritionalValues.protein} g</span>
                      </div>
                    )}

                    {/* Salt */}
                    {productInfo.nutritionalValues.salt !== null && (
                      <div className="flex justify-between pb-2">
                        <span className="font-medium">
                          {lang === "hu" ? "Só" : "Salt"}
                        </span>
                        <span>{productInfo.nutritionalValues.salt} g</span>
                      </div>
                    )}

                    {/* Sodium */}
                    {productInfo.nutritionalValues.sodium !== null && (
                      <div className="flex justify-between pb-2">
                        <span className="font-medium">
                          {lang === "hu" ? "Nátrium" : "Sodium"}
                        </span>
                        <span>{productInfo.nutritionalValues.sodium} g</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ingredients */}
                {productInfo.ingredients && (
                  <div>
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">
                      {lang === "hu" ? "Összetevők" : "Ingredients"}
                    </h4>
                    <p className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
                      {productInfo.ingredients}
                    </p>
                  </div>
                )}

                {/* Serving Size */}
                {productInfo.servingSize && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">
                      {lang === "hu" ? "Adagméret" : "Serving Size"}
                    </h4>
                    <p className="text-sm text-gray-600">{productInfo.servingSize}</p>
                  </div>
                )}

                {/* Additional Info */}
                {productInfo.additionalInfo && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">
                      {lang === "hu" ? "További információk" : "Additional Information"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {productInfo.additionalInfo}
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </Card>
      )}
    </div>
  );
}
````

## File: components/icons/arrow-icon.tsx
````typescript
import { ComponentProps } from "react";

export default function ArrowIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        opacity={0.9}
        d="M6.6 12.317l3.85 2.21V12.87h4.95V9l-1.65 1.105v1.106h-3.3V9.553L6.6 12.317z"
        fill="#151515"
      />
    </svg>
  );
}
````

## File: components/icons/github-icon.tsx
````typescript
import { ComponentProps } from "react";

export default function GithubIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      width={11}
      height={12}
      viewBox="0 0 11 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.5.5C2.462.5 0 3.024 0 6.14c0 2.49 1.576 4.605 3.761 5.35.275.052.376-.122.376-.272 0-.133-.005-.488-.008-.959-1.53.341-1.853-.756-1.853-.756-.25-.652-.61-.825-.61-.825-.5-.349.038-.342.038-.342.552.04.842.58.842.58.49.862 1.288.613 1.6.47.051-.365.193-.613.35-.754-1.22-.143-2.505-.627-2.505-2.788 0-.615.214-1.119.566-1.513-.057-.142-.245-.716.054-1.492 0 0 .462-.152 1.512.578.449-.125.912-.19 1.377-.19a5.16 5.16 0 011.377.19c1.05-.73 1.511-.578 1.511-.578.3.776.111 1.35.055 1.492.352.394.565.898.565 1.513 0 2.167-1.286 2.644-2.51 2.783.197.174.372.518.372 1.045 0 .753-.007 1.362-.007 1.546 0 .151.1.327.379.272a5.521 5.521 0 002.722-2.055A5.731 5.731 0 0011 6.139C11 3.024 8.537.5 5.5.5z"
        fill="currentColor"
      />
    </svg>
  );
}
````

## File: components/icons/sparkles-icon.tsx
````typescript
import { ComponentProps } from "react";

export default function SparklesIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-6"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zm9-3a.75.75 0 01.728.568l.258 1.036a2.63 2.63 0 001.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258a2.63 2.63 0 00-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395a1.5 1.5 0 00-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395a1.5 1.5 0 00.948-.948l.395-1.183A.75.75 0 0116.5 15z"
        clipRule="evenodd"
      />
    </svg>
  );
}
````

## File: components/icons/x-icon.tsx
````typescript
import { ComponentProps } from "react";

export default function XIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      width={10}
      height={10}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.717 10L4.302 6.405 1.279 10H0l3.734-4.44L0 0h3.283L5.56 3.389 8.411 0H9.69L6.129 4.235 10 10H6.717zM8.14 8.986H7.28L1.83 1.014h.861l2.182 3.192.378.554L8.14 8.986z"
        fill="currentColor"
      />
    </svg>
  );
}
````

## File: components/ui/button.tsx
````typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
````

## File: components/ui/card.tsx
````typescript
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
````

## File: components/ui/dropdown-menu.tsx
````typescript
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRightIcon className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <DotFilledIcon className="h-4 w-4 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
````

## File: components/ui/label.tsx
````typescript
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
````

## File: components/ui/select.tsx
````typescript
"use client"

import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <CaretSortIcon className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUpIcon />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDownIcon />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
````

## File: components/ui/skeleton.tsx
````typescript
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

export { Skeleton }
````

## File: components/ui/toggle-group.tsx
````typescript
"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { toggleVariants } from "@/components/ui/toggle"

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
````

## File: components/ui/toggle.tsx
````typescript
"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-3",
        sm: "h-8 px-2",
        lg: "h-10 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
````

## File: components/spinner.tsx
````typescript
import { ComponentPropsWithoutRef } from "react";

export default function Spinner({
  className,
  ...rest
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span className={`relative block opacity-[.65] ${className}`} {...rest}>
      {Array.from(Array(8).keys()).map((i) => (
        <span
          key={i}
          className="absolute left-[calc(50%-12.5%/2)] top-0 h-[100%] w-[12.5%] animate-[spinner_800ms_linear_infinite] before:block before:h-[30%] before:w-[100%] before:rounded-full before:bg-current"
          style={{
            transform: `rotate(${45 * i}deg)`,
            animationDelay: `calc(-${8 - i} / 8 * 800ms)`,
          }}
        />
      ))}
    </span>
  );
}
````

## File: lib/ai-extractors.ts
````typescript
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
````

## File: lib/pdf-utils.ts
````typescript
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { TextItem } from "pdfjs-dist/types/src/display/api";

/**
 * Convert PDF buffer to base64-encoded images (one per page)
 * This works for both text-based PDFs and scanned/image-based PDFs
 */
export async function pdfToImages(
  pdfBuffer: Buffer
): Promise<{ images: string[]; pageCount: number }> {
  const images: string[] = [];

  try {
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
    });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    // Convert each page to an image
    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality

      // Create canvas
      const canvas =
        typeof document !== "undefined"
          ? document.createElement("canvas")
          : (await import("canvas")).createCanvas(
              viewport.width,
              viewport.height
            );

      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Could not get canvas context");
      }

      // Render PDF page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Convert canvas to base64 image
      const imageData = canvas.toDataURL("image/png");
      images.push(imageData);
    }

    return { images, pageCount };
  } catch (error) {
    console.error("Error converting PDF to images:", error);
    throw new Error("Failed to process PDF file");
  }
}

/**
 * Extract text from PDF (useful for text-based PDFs)
 */
export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
    });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => {
          if ("str" in item) {
            return (item as TextItem).str;
          }
          return "";
        })
        .join(" ");
      fullText += pageText + "\n\n";
    }

    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
}
````

## File: lib/schemas.ts
````typescript
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
````

## File: lib/utils.ts
````typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
````

## File: .eslintrc.json
````json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "prefer-const": "off"
  }
}
````

## File: .example.env
````
# OpenAI Configuration
OPENAI_API_KEY=

# Google Gemini Configuration
GOOGLE_API_KEY=

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production URL (for deployment)
# NEXT_PUBLIC_APP_URL=https://nutriscan.vercel.app
````

## File: .gitignore
````
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
````

## File: .prettierrc
````
{"plugins": ["prettier-plugin-tailwindcss"]}
````

## File: components.json
````json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
````

## File: DEVELOPER_DOCUMENTATION.md
````markdown
# Developer Documentation - NutriScan

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Components](#core-components)
3. [PDF Processing Pipeline](#pdf-processing-pipeline)
4. [AI Integration](#ai-integration)
5. [Data Schemas](#data-schemas)
6. [API Endpoints](#api-endpoints)
7. [Frontend Components](#frontend-components)
8. [Testing Strategy](#testing-strategy)
9. [Best Practices](#best-practices)
10. [Deployment Guide](#deployment-guide)

---

## Architecture Overview

### Technology Stack

```
Frontend (Client-Side)
├── Next.js 14 (App Router)
├── React 18 + TypeScript
├── Tailwind CSS
└── Shadcn/ui Components

Backend (API Routes)
├── Next.js API Routes (Node.js)
├── PDF.js (pdfjs-dist)
├── OpenAI SDK
├── Google Generative AI SDK
└── Zod (Schema Validation)

AI Providers
├── OpenAI GPT-4o
└── Google Gemini 2.0 Flash
```

### Request Flow

```
User → Upload PDF
  ↓
Frontend (page.tsx)
  ↓ base64-encoded PDF
API Route (/api/extract)
  ↓
PDF to Images (pdf-utils.ts)
  ↓ array of base64 images
AI Extractor (ai-extractors.ts)
  ↓ structured JSON
Schema Validation (schemas.ts)
  ↓ validated ProductInfo
Frontend Display
```

---

## Core Components

### 1. PDF Processing (`lib/pdf-utils.ts`)

#### `pdfToImages(pdfBuffer: Buffer)`

Converts PDF pages to base64-encoded PNG images.

**Why this approach?**
- Works uniformly for text-based and scanned PDFs
- High-quality image output (2x scale)
- Compatible with both OpenAI and Gemini vision APIs

**Implementation Details:**
```typescript
// PDF.js configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// For each page:
// 1. Load PDF document
// 2. Get page viewport (scale 2.0 for quality)
// 3. Render to canvas
// 4. Convert canvas to base64 PNG
```

**Performance:**
- ~1-3 seconds per page
- Memory usage: ~10-20MB per page

#### `extractTextFromPDF(pdfBuffer: Buffer)`

Extracts raw text from text-based PDFs (currently unused but available for optimization).

---

### 2. AI Extractors (`lib/ai-extractors.ts`)

#### `extractWithOpenAI(images: string[])`

**OpenAI GPT-4o Integration:**

```typescript
// Features used:
// - Vision capabilities (image understanding)
// - Structured outputs (JSON Schema)
// - High detail mode for images

const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: EXTRACTION_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: "..." },
        { type: "image_url", image_url: { url: imageData, detail: "high" } }
      ]
    }
  ],
  response_format: {
    type: "json_schema",
    json_schema: {
      name: "product_info",
      strict: true,
      schema: zodToJsonSchema(productInfoSchema)
    }
  },
  temperature: 0.1  // Low for consistency
});
```

**Advantages:**
- Strict schema adherence (guaranteed valid JSON)
- High accuracy for complex layouts
- Excellent language understanding

**Limitations:**
- Higher cost (~$0.005-0.01 per document)
- Slower response time (~10-15 seconds)

#### `extractWithGemini(images: string[])`

**Google Gemini 2.0 Flash Integration:**

```typescript
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.1,
    responseMimeType: "application/json",
    responseSchema: zodToJsonSchema(productInfoSchema)
  }
});

const result = await model.generateContent([
  EXTRACTION_PROMPT,
  "Instructions...",
  ...imageParts  // Base64 images
]);
```

**Advantages:**
- Very cost-effective (~$0.0001-0.0005 per document)
- Fast response time (~5-10 seconds)
- Native document understanding

**Limitations:**
- Less strict schema adherence (may require validation)
- Occasional hallucinations with complex tables

---

### 3. Data Schemas (`lib/schemas.ts`)

#### Schema Design Philosophy

We use **Zod** for runtime validation and type inference:

```typescript
// Design pattern:
// 1. Define Zod schema
export const allergenSchema = z.object({...});

// 2. Infer TypeScript type
export type Allergen = z.infer<typeof allergenSchema>;

// 3. Validate at runtime
const validated = allergenSchema.parse(data);
```

#### Allergen Schema

```typescript
export const allergenSchema = z.object({
  gluten: z.boolean(),
  egg: z.boolean(),
  crustaceans: z.boolean(),
  fish: z.boolean(),
  peanut: z.boolean(),
  soy: z.boolean(),
  milk: z.boolean(),
  treeNuts: z.boolean(),
  celery: z.boolean(),
  mustard: z.boolean(),
});
```

**Design Decision:** Boolean instead of nullable
- Missing allergen info = `false` (safer default)
- Explicit presence = `true`
- Simpler UI logic

#### Nutrition Schema

```typescript
export const nutritionSchema = z.object({
  energy: z.object({
    kj: z.number().nullable(),
    kcal: z.number().nullable()
  }),
  fat: z.number().nullable(),
  saturatedFat: z.number().nullable(),
  carbohydrate: z.number().nullable(),
  sugar: z.number().nullable(),
  protein: z.number().nullable(),
  salt: z.number().nullable(),
  sodium: z.number().nullable(),
});
```

**Design Decision:** Nullable numbers
- `null` = value not found in document
- Allows distinguishing "not found" from "zero"
- Frontend can conditionally render

---

## PDF Processing Pipeline

### Step-by-Step Breakdown

#### 1. Frontend File Upload (`app/page.tsx`)

```typescript
const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];

  // Validation
  if (file.type !== "application/pdf") {
    alert("Please upload a PDF file");
    return;
  }

  // Store file locally (no upload yet)
  setFile(file);
};
```

#### 2. Convert to Base64

```typescript
const handleSubmit = async () => {
  const reader = new FileReader();
  const base64File = await new Promise<string>((resolve) => {
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

  // Send to API
  await fetch("/api/extract", {
    method: "POST",
    body: JSON.stringify({ file: base64File, provider })
  });
};
```

#### 3. API Processing (`app/api/extract/route.ts`)

```typescript
export async function POST(req: NextRequest) {
  // 1. Parse and validate request
  const { file, provider } = requestSchema.parse(await req.json());

  // 2. Decode base64 to Buffer
  const base64Data = file.replace(/^data:application\/pdf;base64,/, "");
  const pdfBuffer = Buffer.from(base64Data, "base64");

  // 3. Convert PDF to images
  const { images, pageCount } = await pdfToImages(pdfBuffer);

  // 4. Extract with AI
  const productInfo = await extractProductInfo(images, provider);

  // 5. Return structured data
  return NextResponse.json({ success: true, data: productInfo });
}
```

#### 4. PDF to Images (`lib/pdf-utils.ts`)

```typescript
export async function pdfToImages(pdfBuffer: Buffer) {
  const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
  const images: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });

    // Render to canvas
    const canvas = createCanvas(viewport.width, viewport.height);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;

    // Convert to base64
    images.push(canvas.toDataURL("image/png"));
  }

  return { images, pageCount: pdf.numPages };
}
```

---

## AI Integration

### Prompt Engineering

#### English Prompt (`EXTRACTION_PROMPT_EN`)

```typescript
const EXTRACTION_PROMPT_EN = `You are an expert at extracting nutritional information and allergen data from food product documents.

Analyze this product document and extract:
1. Product name
2. Allergens (mark true if present, false otherwise)
3. Nutritional values per 100g/100ml (use null if not found)
4. Ingredients list (if available)
5. Serving size (if available)

The document may be in Hungarian or English. Detect the language and return extracted text in the SAME language.

Be thorough and handle both structured tables and unstructured text formats.`;
```

**Key Techniques:**
- Clear role definition ("You are an expert...")
- Explicit instructions for edge cases (null vs false)
- Language detection requirement
- Format flexibility instruction

#### Hungarian Prompt (`EXTRACTION_PROMPT_HU`)

Identical content, translated to Hungarian for potential future optimization.

### Structured Output Configuration

#### OpenAI (Strict Schema)

```typescript
response_format: {
  type: "json_schema",
  json_schema: {
    name: "product_info",
    strict: true,  // Enforces exact schema match
    schema: zodToJsonSchema(productInfoSchema)
  }
}
```

**Benefits:**
- Guaranteed valid JSON
- No parsing errors
- Type-safe extraction

#### Gemini (Schema Guidance)

```typescript
generationConfig: {
  responseMimeType: "application/json",
  responseSchema: zodToJsonSchema(productInfoSchema)
}
```

**Benefits:**
- Still provides JSON
- More flexible (can handle edge cases)
- Slightly less strict but faster

---

## API Endpoints

### POST `/api/extract`

#### Request

```typescript
interface ExtractRequest {
  file: string;  // Base64-encoded PDF (with data URI prefix)
  provider: "openai" | "gemini";  // AI provider selection
}
```

**Example:**
```json
{
  "file": "data:application/pdf;base64,JVBERi0xLjQK...",
  "provider": "gemini"
}
```

#### Response (Success)

```typescript
interface ExtractResponse {
  success: true;
  data: ProductInfo;
  pageCount: number;
}
```

**Example:**
```json
{
  "success": true,
  "data": {
    "productName": "Édes Anna Paprika",
    "language": "hu",
    "allergens": {
      "gluten": false,
      "egg": false,
      "milk": false,
      ...
    },
    "nutritionalValues": {
      "energy": { "kj": 1250, "kcal": 300 },
      "fat": 15.0,
      ...
    },
    "ingredients": "Paprika, só, fűszerek",
    "servingSize": "100g",
    "additionalInfo": null
  },
  "pageCount": 2
}
```

#### Response (Error)

```typescript
interface ExtractErrorResponse {
  error: string;
  message?: string;
}
```

**Example:**
```json
{
  "error": "Extraction failed",
  "message": "OPENAI_API_KEY is not configured"
}
```

#### Error Codes

- `400`: Invalid request (bad file format, missing parameters)
- `500`: Server error (PDF processing failure, AI API error)

---

## Frontend Components

### Main Page (`app/page.tsx`)

#### Component Structure

```typescript
export default function Page() {
  // State management
  const [file, setFile] = useState<File | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">();
  const [provider, setProvider] = useState<"openai" | "gemini">("gemini");

  // Handlers
  const handleFileUpload = async (event) => { ... };
  const handleSubmit = async () => { ... };
  const clearFile = () => { ... };

  // Render
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {/* Upload Section */}
      <Card>...</Card>

      {/* Results Section */}
      {status === "idle" && <EmptyState />}
      {status === "loading" && <LoadingSkeleton />}
      {status === "success" && <ResultsDisplay data={productInfo} />}
      {status === "error" && <ErrorDisplay message={errorMessage} />}
    </div>
  );
}
```

#### Multi-Language Support

```typescript
// Dynamic language selection based on extracted data
const lang = productInfo?.language || "en";

// Usage in UI
<h4>{lang === "hu" ? "Allergének" : "Allergens"}</h4>

// Label translations
const allergenLabels: Record<string, { en: string; hu: string }> = {
  gluten: { en: "Gluten", hu: "Glutén" },
  ...
};
```

---

## Testing Strategy

### Unit Tests (Recommended)

```typescript
// Test PDF processing
describe("pdfToImages", () => {
  it("should convert PDF to images", async () => {
    const buffer = fs.readFileSync("test.pdf");
    const result = await pdfToImages(buffer);
    expect(result.images).toHaveLength(2);
    expect(result.pageCount).toBe(2);
  });
});

// Test schema validation
describe("productInfoSchema", () => {
  it("should validate correct data", () => {
    const data = { productName: "Test", language: "en", ... };
    expect(() => productInfoSchema.parse(data)).not.toThrow();
  });

  it("should reject invalid data", () => {
    const data = { productName: 123, ... };  // Wrong type
    expect(() => productInfoSchema.parse(data)).toThrow();
  });
});
```

### Integration Tests

```typescript
// Test full extraction flow
describe("/api/extract", () => {
  it("should extract data from PDF", async () => {
    const pdfBase64 = fs.readFileSync("test.pdf", "base64");
    const response = await fetch("/api/extract", {
      method: "POST",
      body: JSON.stringify({
        file: `data:application/pdf;base64,${pdfBase64}`,
        provider: "gemini"
      })
    });

    const result = await response.json();
    expect(result.success).toBe(true);
    expect(result.data.productName).toBeDefined();
  });
});
```

### Manual Testing Checklist

- [ ] Upload text-based PDF
- [ ] Upload scanned/image-based PDF
- [ ] Upload Hungarian document
- [ ] Upload English document
- [ ] Upload multi-page document
- [ ] Test with OpenAI provider
- [ ] Test with Gemini provider
- [ ] Test error handling (invalid file, missing API key)
- [ ] Test UI responsiveness (mobile, tablet, desktop)
- [ ] Test language switching

---

## Best Practices

### 1. Error Handling

```typescript
// Always wrap AI calls in try-catch
try {
  const result = await extractWithGemini(images);
  return result;
} catch (error) {
  console.error("Extraction error:", error);
  // Provide user-friendly error message
  throw new Error("Failed to extract data. Please try again or use a different provider.");
}
```

### 2. API Key Management

```typescript
// Never expose API keys in frontend
// Always check keys exist before using

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not configured");
}
```

### 3. Performance Optimization

```typescript
// Consider implementing caching for frequently analyzed documents
// Example using a simple in-memory cache:

const cache = new Map<string, ProductInfo>();

export async function extractProductInfo(images: string[], provider: string) {
  const cacheKey = `${provider}-${hashImages(images)}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const result = await (provider === "openai" ? extractWithOpenAI : extractWithGemini)(images);
  cache.set(cacheKey, result);
  return result;
}
```

### 4. Rate Limiting

```typescript
// Implement rate limiting for production
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10  // Limit each IP to 10 requests per windowMs
});

// Apply to API route
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb"  // Limit PDF size
    }
  }
};
```

---

## Deployment Guide

### Environment Variables

```bash
# Production .env
OPENAI_API_KEY=sk-proj-...
GOOGLE_API_KEY=AIza...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables
vercel env add OPENAI_API_KEY
vercel env add GOOGLE_API_KEY

# Deploy to production
vercel --prod
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t nutri-scan .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=your_key \
  -e GOOGLE_API_KEY=your_key \
  nutri-scan
```

### Monitoring & Logging

```typescript
// Add structured logging
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info"
});

// Usage in API
logger.info({ provider, pageCount }, "Starting extraction");
logger.error({ error }, "Extraction failed");
```

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [PDF.js Documentation](https://mozilla.github.io/pdf.js/)
- [Zod Documentation](https://zod.dev/)

---

**Last Updated:** 2025-10-20
**Version:** 1.0.0
````

## File: next.config.mjs
````
/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
````

## File: package.json
````json
{
  "name": "nutri-scan",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-icons": "^1.3.0",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "canvas": "^3.2.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "lucide-react": "^0.451.0",
    "next": "14.2.15",
    "next-plausible": "^3.12.4",
    "openai": "^4.77.0",
    "pdf-parse": "^1.1.1",
    "pdfjs-dist": "^4.8.69",
    "react": "^18",
    "react-dom": "^18",
    "sharp": "^0.33.5",
    "tailwind-merge": "^2.5.3",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.23.8",
    "zod-to-json-schema": "^3.23.3"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/pdf-parse": "^1.1.4",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.15",
    "postcss": "^8",
    "prettier": "^3.3.3",
    "prettier-plugin-tailwindcss": "^0.6.8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
````

## File: postcss.config.mjs
````
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
````

## File: README.md
````markdown
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

## Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- API keys for OpenAI and/or Google Gemini

### 1. Clone the Repository

```bash
git clone https://github.com/purelyricky/nutri-scan.git
cd nutri-scan
```

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
````

## File: tailwind.config.ts
````typescript
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
````

## File: tsconfig.json
````json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
````

## File: USER_GUIDE.md
````markdown
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
````
