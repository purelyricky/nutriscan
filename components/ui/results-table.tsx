"use client";

import { ExtractionResult } from "@/lib/schemas";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface ResultsTableProps {
  result: ExtractionResult;
}

export default function ResultsTable({ result }: ResultsTableProps) {
  const allergenLabels = {
    gluten: "Gluten (Glutén)",
    egg: "Egg (Tojás)",
    crustaceans: "Crustaceans (Rák)",
    fish: "Fish (Hal)",
    peanut: "Peanut (Földimogyoró)",
    soy: "Soy (Szója)",
    milk: "Milk (Tej)",
    treeNuts: "Tree Nuts (Diófélék)",
    celery: "Celery (Zeller)",
    mustard: "Mustard (Mustár)",
  };

  const nutritionalLabels = {
    energy: "Energy (Energia)",
    fat: "Fat (Zsír)",
    carbohydrate: "Carbohydrate (Szénhidrát)",
    sugar: "Sugar (Cukor)",
    protein: "Protein (Fehérje)",
    sodium: "Sodium (Nátrium)",
  };

  return (
    <div className="space-y-6">
      {/* Product Info */}
      {result.productName && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">{result.productName}</p>
            <p className="text-xs text-gray-500 mt-1">
              Detected Language: {result.detectedLanguage}
            </p>
            {result.confidence && (
              <p className="text-xs text-gray-500">
                Confidence: {result.confidence}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Allergens Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Allergens</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Legend/Key - placed between title and table */}
          <div className="flex items-center gap-6 mb-4 pb-3 border-b border-gray-200 bg-gray-50 px-3 py-2 rounded-md">
            <span className="text-xs font-medium text-gray-700">Key:</span>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-100">
                <Check className="w-2.5 h-2.5 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">Present (Jelen van)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-100">
                <X className="w-2.5 h-2.5 text-red-600" />
              </div>
              <span className="text-xs text-gray-600">Absent (Nincs jelen)</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                    Allergen
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(result.allergens).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {allergenLabels[key as keyof typeof allergenLabels]}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {value ? (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100">
                          <X className="w-4 h-4 text-red-600" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Nutritional Values Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nutritional Values</CardTitle>
        </CardHeader>
        <CardContent>
          {!result.nutritionalValues || Object.keys(result.nutritionalValues).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 bg-red-50 border-2 border-red-200 rounded-lg">
              <X className="w-12 h-12 text-red-500 mb-3" />
              <p className="text-center text-red-700 font-medium text-base mb-1">
                No nutritional values were detected from the document (A dokumentumból nem sikerült tápértékeket azonosítani)
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                      Nutrient
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result.nutritionalValues).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {nutritionalLabels[key as keyof typeof nutritionalLabels]}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {value || "Not found"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
