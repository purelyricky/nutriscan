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
          {/* Legend/Key */}
          <div className="flex items-center gap-6 mb-4 pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-xs text-gray-600">Present (Jelen van)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100">
                <X className="w-3 h-3 text-red-600" />
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
        </CardContent>
      </Card>
    </div>
  );
}
