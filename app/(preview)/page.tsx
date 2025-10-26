"use client";

import { useState, useEffect } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { extractionResultSchema, ExtractionResult } from "@/lib/schemas";
import { toast } from "sonner";
import { FileText, Loader2, Book, RefreshCw, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ResultsTable from "@/components/ui/results-table";
import NextLink from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function NutriScanner() {
  const [files, setFiles] = useState<File[]>([]);
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState<"openai" | "gemini">("openai");

  // Create separate hooks for each model since useObject's api param is static
  const openaiHook = useObject({
    api: "/api/extract/openai",
    schema: extractionResultSchema,
    initialValue: undefined,
    onError: (error) => {
      console.error("Extraction error:", error);
      toast.error("Failed to extract information. The PDF may not contain nutritional data or may be unreadable.");
      setFiles([]);
    },
    onFinish: ({ object, error }) => {
      console.log("Extraction finished:", { object, error });

      if (error) {
        console.error("Extraction error in onFinish:", error);
        toast.error("Failed to process the PDF. Please try a different file or AI model.");
        setFiles([]);
        return;
      }

      if (object) {
        setExtractionResult(object);
        toast.success("Extraction completed successfully!");
      } else {
        toast.error("No data could be extracted from this PDF. Please ensure it contains nutritional information.");
        setFiles([]);
      }
    },
  });

  const geminiHook = useObject({
    api: "/api/extract/gemini",
    schema: extractionResultSchema,
    initialValue: undefined,
    onError: (error) => {
      console.error("Extraction error:", error);
      toast.error("Failed to extract information. The PDF may not contain nutritional data or may be unreadable.");
      setFiles([]);
    },
    onFinish: ({ object, error }) => {
      console.log("Extraction finished:", { object, error });

      if (error) {
        console.error("Extraction error in onFinish:", error);
        toast.error("Failed to process the PDF. Please try a different file or AI model.");
        setFiles([]);
        return;
      }

      if (object) {
        setExtractionResult(object);
        toast.success("Extraction completed successfully!");
      } else {
        toast.error("No data could be extracted from this PDF. Please ensure it contains nutritional information.");
        setFiles([]);
      }
    },
  });

  // Select the appropriate hook based on the selected model
  const currentHook = selectedModel === "openai" ? openaiHook : geminiHook;

  const { submit, object: partialResult, isLoading, error: extractionError } = currentHook as {
    submit: (params: { files: { name: string; type: string; data: string }[] }) => void;
    object: Partial<ExtractionResult> | undefined;
    isLoading: boolean;
    error: Error | undefined;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && isDragging) {
      toast.error(
        "Safari does not support drag & drop. Please use the file picker.",
      );
      return;
    }

    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" && file.size <= 5 * 1024 * 1024,
    );

    if (validFiles.length !== selectedFiles.length) {
      toast.error("Only PDF files under 5MB are allowed.");
    }

    setFiles(validFiles);
  };

  const encodeFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitWithFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Starting extraction with model:", selectedModel);
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      })),
    );
    console.log("Files encoded, submitting to API for", selectedModel);

    // Submit to the appropriate endpoint based on selected model
    submit({ files: encodedFiles });
  };

  const resetScanner = () => {
    setFiles([]);
    setExtractionResult(null);
  };

  // Calculate progress based on partial result fields populated
  const calculateProgress = () => {
    if (!isLoading) return 0;
    if (!partialResult) return 10; // Initial processing

    let completed = 0;
    const total = 3; // allergens, nutritionalValues, detectedLanguage

    if (partialResult.allergens && Object.keys(partialResult.allergens).length > 0) {
      completed += 1;
    }
    if (partialResult.nutritionalValues && Object.keys(partialResult.nutritionalValues).length > 0) {
      completed += 1;
    }
    if (partialResult.detectedLanguage) {
      completed += 1;
    }

    // Map to percentage (10% start + 90% for actual data)
    return 10 + Math.round((completed / total) * 90);
  };

  const progress = calculateProgress();

  // Debug logging
  useEffect(() => {
    console.log("State changed:", {
      isLoading,
      hasPartialResult: !!partialResult,
      hasExtractionResult: !!extractionResult,
      progress,
    });
    if (partialResult) {
      console.log("Partial result:", partialResult);
    }
  }, [isLoading, partialResult, extractionResult, progress]);

  if (extractionResult) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Image
                src="/nutriscanner.svg"
                alt="NutriScanner"
                width={48}
                height={48}
                className="w-12 h-12"
              />
              <h1 className="text-3xl font-bold text-gray-900">NutriScanner Results</h1>
            </div>
            <Button onClick={resetScanner} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Scan Another
            </Button>
          </div>
          <ResultsTable result={extractionResult} />
          <div className="mt-6 flex justify-center gap-4">
            <NextLink
              href="https://github.com/purelyricky/nutriscan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 bg-white text-gray-700"
            >
              <Github className="h-4 w-4" />
              See Source Code
            </NextLink>
            <NextLink
              href="/docs"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 bg-white text-gray-700"
            >
              <Book className="h-4 w-4" />
              Read Documentation
            </NextLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] w-full flex justify-center bg-background"
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragExit={() => setIsDragging(false)}
      onDragEnd={() => setIsDragging(false)}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileChange({
          target: { files: e.dataTransfer.files },
        } as React.ChangeEvent<HTMLInputElement>);
      }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            className="fixed pointer-events-none bg-gray-100/90 h-dvh w-dvw z-10 justify-center items-center flex flex-col gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-gray-900">Drop PDF here</div>
          </motion.div>
        )}
      </AnimatePresence>
      <Card className="w-full max-w-2xl h-full border-0 sm:border sm:h-fit mt-12">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex items-center justify-center">
            <Image
              src="/nutriscanner.svg"
              alt="NutriScanner"
              width={80}
              height={80}
              className="w-20 h-20"
            />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-gray-900">
              NutriScanner
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Extract allergens and nutritional data from product PDFs
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitWithFiles} className="space-y-4">
            {/* Model Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                AI Model
              </label>
              <div className="flex gap-2">
                {/* OpenAI GPT-4o */}
                <Button
                  type="button"
                  variant={selectedModel === "openai" ? "default" : "outline"}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-9 px-2 ${selectedModel === "openai" ? "bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-gray-50"}`}
                  onClick={() => setSelectedModel("openai")}
                >
                  <Image
                    src="/openai.svg"
                    alt="OpenAI"
                    width={14}
                    height={14}
                    className={selectedModel === "openai" ? "brightness-0 invert" : ""}
                  />
                  <span className="text-xs font-medium">OpenAI</span>
                </Button>

                {/* Google Gemini */}
                <Button
                  type="button"
                  variant={selectedModel === "gemini" ? "default" : "outline"}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-9 px-2 ${selectedModel === "gemini" ? "bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-gray-50"}`}
                  onClick={() => setSelectedModel("gemini")}
                >
                  <Image
                    src="/google.svg"
                    alt="Google Gemini"
                    width={14}
                    height={14}
                    className={selectedModel === "gemini" ? "brightness-0 invert" : ""}
                  />
                  <span className="text-xs font-medium">Gemini</span>
                </Button>
              </div>
              <p className="text-[10px] text-gray-500 text-center">
                {selectedModel === "openai" && "Recommended • Most accurate"}
                {selectedModel === "gemini" && "Production-ready • Fast"}
              </p>
            </div>

            {/* File Upload */}
            <div
              className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors hover:border-gray-400 bg-gray-50"
            >
              <input
                type="file"
                onChange={handleFileChange}
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileText className="h-12 w-12 mb-3 text-gray-400" />
              <p className="text-sm text-gray-600 text-center">
                {files.length > 0 ? (
                  <span className="font-medium text-gray-900">
                    {files[0].name}
                  </span>
                ) : (
                  <span>Drop PDF or click to browse</span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Max 5MB
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={files.length === 0 || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing PDF...</span>
                </span>
              ) : (
                "Extract Information"
              )}
            </Button>
          </form>
        </CardContent>
        {isLoading && (
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="w-full space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-gray-600">
                  {partialResult ? "Processing data..." : "Analyzing PDF..."}
                </span>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
      <motion.div
        className="fixed bottom-12 flex gap-3 text-xs"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <NextLink
          href="https://github.com/purelyricky/nutriscan"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-row gap-2 items-center border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-100 bg-white text-gray-700"
        >
          <Github className="h-4 w-4" />
          Source Code
        </NextLink>
        <NextLink
          href="/docs"
          className="flex flex-row gap-2 items-center border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-100 bg-white text-gray-700"
        >
          <Book className="h-4 w-4" />
          Documentation
        </NextLink>
      </motion.div>
    </div>
  );
}
