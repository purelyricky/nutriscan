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
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
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

    // Create preview URL
    const fileUrl = URL.createObjectURL(selectedFile);
    setPdfPreview(fileUrl);
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
    setPdfPreview(null);
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
