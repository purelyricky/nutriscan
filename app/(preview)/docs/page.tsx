"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, ChevronRight, Code2, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NextLink from "next/link";
import Image from "next/image";

export default function Documentation() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-3 bg-white/90 hover:bg-white"
          onClick={() => copyToClipboard(code, id)}
        >
          {copiedId === id ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-700">
        <code className={`language-${language} text-sm`}>{code}</code>
      </pre>
    </div>
  );

  const ExternalLinkButton = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  );

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <NextLink href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/nutriscanner.svg"
              alt="NutriScanner"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold text-gray-900">NutriScanner Developer Documentation</h1>
          </NextLink>
          <NextLink href="/">
            <Button variant="outline">Back to App</Button>
          </NextLink>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold text-gray-700">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "architecture", label: "Architecture" },
                      { id: "setup", label: "Developer Setup" },
                      { id: "api-routes", label: "API Routes" },
                      { id: "schemas", label: "Data Schemas" },
                      { id: "frontend", label: "Frontend Components" },
                      { id: "ai-integration", label: "AI Integration" },
                      { id: "deployment", label: "Deployment" },
                      { id: "troubleshooting", label: "Troubleshooting" },
                    ].map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors py-1"
                      >
                        <ChevronRight className="h-3 w-3" />
                        {item.label}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-12">
            {/* Overview */}
            <Section id="overview" title="🚀 Overview">
              <p className="text-gray-700 leading-relaxed">
                NutriScanner is a production-ready, AI-powered web application that extracts allergen information and
                nutritional values from food product PDF documents. Built with Next.js 15 and powered by advanced vision
                language models, it provides real-time streaming extraction with bilingual support (Hungarian/English).
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Code2 className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">Modern Stack</h3>
                    </div>
                    <p className="text-sm text-blue-800">
                      Next.js 15, React 19, TypeScript, Tailwind CSS, and Vercel AI SDK
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="h-5 w-5 text-green-600" />
                      <h3 className="font-semibold text-green-900">Dual AI Models</h3>
                    </div>
                    <p className="text-sm text-green-800">
                      OpenAI GPT-4o for accuracy, Google Gemini 2.5-Flash for speed
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Shield className="h-5 w-5 text-purple-600" />
                      <h3 className="font-semibold text-purple-900">Type-Safe</h3>
                    </div>
                    <p className="text-sm text-purple-800">
                      Zod schema validation with full TypeScript type inference
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mt-6">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Key Features</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Dual AI model architecture: OpenAI GPT-4o and Google Gemini 2.5-Flash</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Real-time streaming with live progress tracking (10-100%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Bilingual support (Hungarian & English) with auto-detection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>10 EU-regulated allergens with smart detection rules</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Confidence scoring system (High/Medium/Low)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Vision capabilities for both digital PDFs and scanned images</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Section>

            {/* Architecture */}
            <Section id="architecture" title="🏗️ Architecture">
              <p className="text-gray-700 mb-4">
                NutriScanner follows a modern serverless architecture with clear separation of concerns.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">System Architecture</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <pre className="text-xs text-gray-700 overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                     │
├─────────────────────────────────────────────────────────────┤
│  • PDF Upload (drag & drop / file picker)                  │
│  • Base64 Encoding (FileReader API)                        │
│  • Model Selection (OpenAI / Gemini)                       │
│  • Real-time Progress Display                              │
│  • Results Rendering                                       │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP POST (base64 PDF)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                       │
├─────────────────────────────────────────────────────────────┤
│  /api/extract/openai    │    /api/extract/gemini           │
│  • Receive base64 PDF   │    • Receive base64 PDF          │
│  • Convert to Buffer    │    • Convert to Buffer           │
│  • Validate input       │    • Validate input              │
└────────────┬────────────┴────────────┬─────────────────────┘
             │                         │
             ▼                         ▼
┌─────────────────────┐     ┌─────────────────────┐
│   OpenAI GPT-4o     │     │  Google Gemini      │
│   (Vision Model)    │     │  2.5-Flash          │
│   • OCR Processing  │     │  (Vision Model)     │
│   • Smart Extract   │     │  • Fast Processing  │
│   • Most Accurate   │     │  • Cost-Effective   │
└─────────┬───────────┘     └──────────┬──────────┘
          │                            │
          └────────────┬───────────────┘
                       │ Structured JSON
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   SCHEMA VALIDATION (Zod)                   │
├─────────────────────────────────────────────────────────────┤
│  • Validate allergens (10 required boolean fields)         │
│  • Validate nutritional values (optional with units)       │
│  • Validate confidence (high/medium/low)                   │
│  • Validate language detection                             │
└────────────────────┬────────────────────────────────────────┘
                     │ Streaming Response
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT DISPLAY                         │
├─────────────────────────────────────────────────────────────┤
│  • Product Information Card                                │
│  • Allergens Table (with visual indicators)                │
│  • Nutritional Values Table (bilingual labels)             │
│  • Confidence Badge & Language Detection                   │
└─────────────────────────────────────────────────────────────┘`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Flow</h3>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">1</span>
                      <span>User uploads PDF (max 5MB) and selects AI model (OpenAI or Gemini)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">2</span>
                      <span>Browser encodes PDF to base64 data URL using FileReader API</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">3</span>
                      <span>POST request sent to <code className="bg-gray-100 px-1 rounded">/api/extract/{`{model}`}</code> with encoded file</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">4</span>
                      <span>API route converts base64 to Buffer and prepares vision model request</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">5</span>
                      <span>Vision model processes PDF, extracts allergens, nutritional values, and metadata</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">6</span>
                      <span>Results validated against Zod schema for type safety</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">7</span>
                      <span>Streaming response sent to client with real-time progress updates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">8</span>
                      <span>Client displays results in bilingual tables with visual indicators</span>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Technology Stack</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Frontend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Next.js 15.1.0 (App Router)</li>
                          <li>• React 19.0.0</li>
                          <li>• TypeScript 5.7.2</li>
                          <li>• Tailwind CSS 3.4.16</li>
                          <li>• shadcn/ui (Radix UI)</li>
                          <li>• Framer Motion 11.14.1</li>
                          <li>• Lucide React 0.468.0</li>
                          <li>• Sonner 1.7.1 (Toasts)</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Backend & AI</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Vercel AI SDK 5.0.0</li>
                          <li>• @ai-sdk/openai 2.0.53</li>
                          <li>• @ai-sdk/google 2.0.23</li>
                          <li>• @ai-sdk/react 2.0.79</li>
                          <li>• Zod 3.24.1 (Validation)</li>
                          <li>• Next.js API Routes</li>
                          <li>• Serverless Functions</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </Section>

            {/* Developer Setup */}
            <Section id="setup" title="💻 Developer Setup">
              <p className="text-gray-700 mb-4">
                Follow these steps to set up NutriScanner for local development.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Prerequisites</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <strong>Node.js 18+</strong> - Required for Next.js 15
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <strong>npm 10+</strong> - Or yarn/pnpm equivalent
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <strong>OpenAI API Key</strong> - Get from{" "}
                      <ExternalLinkButton href="https://platform.openai.com/api-keys">
                        platform.openai.com
                      </ExternalLinkButton>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <strong>Google Gemini API Key</strong> - Get from{" "}
                      <ExternalLinkButton href="https://aistudio.google.com/app/apikey">
                        aistudio.google.com
                      </ExternalLinkButton>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Clone Repository</h3>
                  <CodeBlock
                    id="clone"
                    language="bash"
                    code="git clone https://github.com/purelyricky/nutriscan.git\ncd nutriscan"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Install Dependencies</h3>
                  <CodeBlock
                    id="install"
                    language="bash"
                    code="npm install"
                  />
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 font-medium mb-2">Key Dependencies Installed:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• next@15.1.0 - React framework with App Router</li>
                      <li>• ai@5.0.0 - Vercel AI SDK for streaming</li>
                      <li>• @ai-sdk/openai@2.0.53 - OpenAI integration</li>
                      <li>• @ai-sdk/google@2.0.23 - Google Gemini integration</li>
                      <li>• zod@3.24.1 - Schema validation</li>
                      <li>• tailwindcss@3.4.16 - Styling framework</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Configure Environment Variables</h3>
                  <p className="text-gray-700 mb-3">
                    Create a <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env.local</code> file in the root directory:
                  </p>
                  <CodeBlock
                    id="env"
                    language="bash"
                    code={`# OpenAI Configuration (Required)
OPENAI_API_KEY=sk-proj-your_openai_key_here

# Google Gemini Configuration (Required)
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyD_your_google_key_here`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">4. Run Development Server</h3>
                  <CodeBlock
                    id="dev"
                    language="bash"
                    code="npm run dev"
                  />
                  <p className="text-gray-700 mt-3">
                    Open{" "}
                    <a href="http://localhost:3000" className="text-blue-600 hover:underline font-medium">
                      http://localhost:3000
                    </a>{" "}
                    to see the application running.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">5. Build for Production</h3>
                  <CodeBlock
                    id="build"
                    language="bash"
                    code="npm run build\nnpm start"
                  />
                </div>
              </div>
            </Section>

            {/* API Routes */}
            <Section id="api-routes" title="🛣️ API Routes">
              <p className="text-gray-700 mb-4">
                NutriScanner implements two parallel API routes for different AI models.
              </p>

              <div className="space-y-6">
                <Card className="border-blue-200">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Image src="/openai.svg" alt="OpenAI" width={20} height={20} />
                      POST /api/extract/openai
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-700 mb-4">
                      <strong>Model:</strong> GPT-4o (OpenAI's vision-language model)
                      <br />
                      <strong>Use Case:</strong> Highest accuracy, recommended for critical data
                      <br />
                      <strong>Max Duration:</strong> 60 seconds
                    </p>

                    <h4 className="font-semibold text-gray-800 mb-2">Request Example:</h4>
                    <CodeBlock
                      id="openai-request"
                      language="typescript"
                      code={`// Client-side request
const response = await fetch('/api/extract/openai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    files: [{
      name: "product-label.pdf",
      type: "application/pdf",
      data: "data:application/pdf;base64,JVBERi0xLjQK..."
    }]
  })
});`}
                    />

                    <h4 className="font-semibold text-gray-800 mb-2 mt-4">Implementation:</h4>
                    <CodeBlock
                      id="openai-impl"
                      language="typescript"
                      code={`// app/api/extract/openai/route.ts
import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { extractionResultSchema } from "@/lib/schemas";
import { EXTRACTION_SYSTEM_PROMPT } from "@/lib/system-prompt";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files } = await req.json();
  const base64Data = files[0].data.split(',')[1];
  const fileBuffer = Buffer.from(base64Data, 'base64');

  const result = streamObject({
    model: openai("gpt-4o"),
    messages: [
      { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract allergen and nutritional info..." },
          { type: "file", data: fileBuffer, mimeType: "application/pdf" }
        ]
      }
    ],
    schema: extractionResultSchema,
  });

  return result.toTextStreamResponse();
}`}
                    />
                  </CardContent>
                </Card>

                <Card className="border-green-200">
                  <CardHeader className="bg-green-50">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Image src="/google.svg" alt="Google" width={20} height={20} />
                      POST /api/extract/gemini
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-sm text-gray-700 mb-4">
                      <strong>Model:</strong> Gemini 2.5-Flash (Google's vision model)
                      <br />
                      <strong>Use Case:</strong> Fast extraction, production-ready, cost-effective
                      <br />
                      <strong>Max Duration:</strong> 60 seconds
                    </p>

                    <h4 className="font-semibold text-gray-800 mb-2">Implementation:</h4>
                    <CodeBlock
                      id="gemini-impl"
                      language="typescript"
                      code={`// app/api/extract/gemini/route.ts
import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { extractionResultSchema } from "@/lib/schemas";
import { EXTRACTION_SYSTEM_PROMPT } from "@/lib/system-prompt";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { files } = await req.json();
  const base64Data = files[0].data.split(',')[1];
  const fileBuffer = Buffer.from(base64Data, 'base64');

  const result = streamObject({
    model: google("gemini-2.5-flash"),  // Only difference!
    messages: [
      { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract allergen and nutritional info..." },
          { type: "file", data: fileBuffer, mediaType: "application/pdf" }
        ]
      }
    ],
    schema: extractionResultSchema,
  });

  return result.toTextStreamResponse();
}`}
                    />
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚡ Key Points</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Both routes follow identical patterns for consistency</li>
                    <li>• Only difference is the model provider (openai vs google)</li>
                    <li>• Both use the same schema and system prompt</li>
                    <li>• Streaming responses enable real-time progress updates</li>
                    <li>• Maximum execution time: 60 seconds</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Data Schemas */}
            <Section id="schemas" title="📋 Data Schemas">
              <p className="text-gray-700 mb-4">
                NutriScanner uses Zod for runtime validation and TypeScript type inference. All schemas are defined in{" "}
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">lib/schemas.ts</code>.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Allergen Schema</h3>
                  <CodeBlock
                    id="allergen-schema"
                    language="typescript"
                    code={`export const allergenSchema = z.object({
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

export type Allergen = z.infer<typeof allergenSchema>;`}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    All 10 fields are <strong>required</strong> and must be boolean values. Descriptions include Hungarian translations.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Nutritional Value Schema</h3>
                  <CodeBlock
                    id="nutrition-schema"
                    language="typescript"
                    code={`export const nutritionalValueSchema = z.object({
  energy: z.string().optional().describe("Energy value (Energia) - include unit (kJ/kcal)"),
  fat: z.string().optional().describe("Fat content (Zsír) - include unit (g)"),
  carbohydrate: z.string().optional().describe("Carbohydrate content (Szénhidrát) - include unit (g)"),
  sugar: z.string().optional().describe("Sugar content (Cukor) - include unit (g)"),
  protein: z.string().optional().describe("Protein content (Fehérje) - include unit (g)"),
  sodium: z.string().optional().describe("Sodium content (Nátrium) - include unit (mg/g)"),
});

export type NutritionalValue = z.infer<typeof nutritionalValueSchema>;`}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    All fields are <strong>optional</strong> and include units as strings (e.g., "12g", "500kJ/120kcal").
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Extraction Result Schema</h3>
                  <CodeBlock
                    id="result-schema"
                    language="typescript"
                    code={`export const extractionResultSchema = z.object({
  allergens: allergenSchema.describe("Allergen information extracted from the document"),
  nutritionalValues: nutritionalValueSchema.describe("Nutritional values extracted from the document"),
  detectedLanguage: z.enum(["hungarian", "english", "both", "unknown"])
    .describe("The language detected in the document"),
  productName: z.string().optional()
    .describe("Product name extracted from the document content or filename"),
  confidence: z.enum(["high", "medium", "low"])
    .describe("REQUIRED: Confidence level of the extraction based on document quality and clarity"),
});

export type ExtractionResult = z.infer<typeof extractionResultSchema>;`}
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Combines allergens, nutritional values, language detection, product name, and confidence scoring.
                  </p>
                </div>
              </div>
            </Section>

            {/* Frontend Components */}
            <Section id="frontend" title="⚛️ Frontend Components">
              <p className="text-gray-700 mb-4">
                The frontend uses React 19 with Next.js 15 App Router and streaming hooks from Vercel AI SDK.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Main Page Component</h3>
                  <CodeBlock
                    id="main-page"
                    language="typescript"
                    code={`// app/(preview)/page.tsx
"use client";

import { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { extractionResultSchema } from "@/lib/schemas";

export default function NutriScanner() {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedModel, setSelectedModel] = useState<"openai" | "gemini">("openai");
  const [extractionResult, setExtractionResult] = useState<ExtractionResult | null>(null);

  // Create hooks for each model
  const openaiHook = useObject({
    api: "/api/extract/openai",
    schema: extractionResultSchema,
    onFinish: ({ object }) => setExtractionResult(object),
  });

  const geminiHook = useObject({
    api: "/api/extract/gemini",
    schema: extractionResultSchema,
    onFinish: ({ object }) => setExtractionResult(object),
  });

  // Select active hook based on model
  const currentHook = selectedModel === "openai" ? openaiHook : geminiHook;
  const { submit, object: partialResult, isLoading } = currentHook;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const encodedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: await encodeFileAsBase64(file),
      }))
    );
    submit({ files: encodedFiles });
  };

  // ... render UI
}`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Results Display Component</h3>
                  <CodeBlock
                    id="results-table"
                    language="typescript"
                    code={`// components/ui/results-table.tsx
import { ExtractionResult } from "@/lib/schemas";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ResultsTable({ result }: { result: ExtractionResult }) {
  const allergenLabels = {
    gluten: "Gluten (Glutén)",
    egg: "Egg (Tojás)",
    // ... other allergens
  };

  return (
    <div className="space-y-6">
      {/* Product Information */}
      <Card>
        <CardContent>
          <p><strong>Product:</strong> {result.productName || "Unknown"}</p>
          <p><strong>Language:</strong> {result.detectedLanguage}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
        </CardContent>
      </Card>

      {/* Allergens Table */}
      <Card>
        <CardHeader>
          <CardTitle>Allergen Information</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            {Object.entries(result.allergens).map(([key, value]) => (
              <tr key={key}>
                <td>{allergenLabels[key]}</td>
                <td>
                  {value ? (
                    <CheckCircle2 className="text-green-600" />
                  ) : (
                    <XCircle className="text-red-600" />
                  )}
                </td>
              </tr>
            ))}
          </table>
        </CardContent>
      </Card>

      {/* Nutritional Values Table */}
      <Card>
        <CardHeader>
          <CardTitle>Nutritional Values</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(result.nutritionalValues).length > 0 ? (
            <table className="w-full">
              {Object.entries(result.nutritionalValues).map(([key, value]) => (
                value && <tr key={key}><td>{key}</td><td>{value}</td></tr>
              ))}
            </table>
          ) : (
            <p className="text-gray-500">No nutritional data found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Real-time Progress Calculation</h3>
                  <CodeBlock
                    id="progress"
                    language="typescript"
                    code={`const calculateProgress = () => {
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
};`}
                  />
                </div>
              </div>
            </Section>

            {/* AI Integration */}
            <Section id="ai-integration" title="🤖 AI Integration">
              <p className="text-gray-700 mb-4">
                NutriScanner uses the Vercel AI SDK for seamless integration with multiple AI providers.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">System Prompt Strategy</h3>
                  <p className="text-gray-700 mb-3">
                    The <code className="bg-gray-100 px-2 py-1 rounded text-sm">EXTRACTION_SYSTEM_PROMPT</code> in{" "}
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">lib/system-prompt.ts</code> is a comprehensive
                    190-line instruction set that guides the AI model on:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Allergen Detection Rules:</strong> TRUE only for explicit "contains" statements, FALSE for "may contain traces"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Nutritional Value Locations:</strong> Where to find nutrition facts in Hungarian/English documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Bilingual Terminology:</strong> Both Hungarian and English terms for all fields</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Confidence Assessment:</strong> Criteria for High/Medium/Low confidence levels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Example Outputs:</strong> 4 detailed examples with expected JSON structure</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Streaming with streamObject</h3>
                  <CodeBlock
                    id="stream-object"
                    language="typescript"
                    code={`import { streamObject } from "ai";

const result = streamObject({
  model: openai("gpt-4o"), // or google("gemini-2.5-flash")
  messages: [
    { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: "Extract information..." },
        { type: "file", data: pdfBuffer, mimeType: "application/pdf" }
      ]
    }
  ],
  schema: extractionResultSchema,
  onFinish: ({ object, error }) => {
    if (error) {
      console.error("Extraction error:", error);
      return;
    }
    // Validate and use the extracted data
    const validation = extractionResultSchema.safeParse(object);
    if (validation.success) {
      console.log("Valid extraction:", validation.data);
    }
  }
});

return result.toTextStreamResponse();`}
                  />
                </div>

                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <h4 className="font-semibold text-indigo-900 mb-2">🎯 Best Practices</h4>
                  <ul className="text-sm text-indigo-800 space-y-1">
                    <li>• Use <code className="bg-indigo-100 px-1 rounded">streamObject()</code> for structured extraction with real-time updates</li>
                    <li>• Always validate responses with Zod schemas before rendering</li>
                    <li>• Include comprehensive system prompts with examples</li>
                    <li>• Handle both success and error cases in <code className="bg-indigo-100 px-1 rounded">onFinish</code> callback</li>
                    <li>• Set appropriate <code className="bg-indigo-100 px-1 rounded">maxDuration</code> for API routes (60s recommended)</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Deployment */}
            <Section id="deployment" title="🚀 Deployment">
              <p className="text-gray-700 mb-4">
                NutriScanner is optimized for deployment on Vercel but works on any Next.js-compatible platform.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Vercel Deployment (Recommended)</h3>
                  <ol className="space-y-3 text-sm text-gray-700">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold flex items-center justify-center">1</span>
                      <span>Push your repository to GitHub</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold flex items-center justify-center">2</span>
                      <span>Import project at <ExternalLinkButton href="https://vercel.com/new">vercel.com/new</ExternalLinkButton></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold flex items-center justify-center">3</span>
                      <span>Add environment variables in project settings: <code className="bg-gray-100 px-1 rounded">OPENAI_API_KEY</code> and <code className="bg-gray-100 px-1 rounded">GOOGLE_GENERATIVE_AI_API_KEY</code></span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-semibold flex items-center justify-center">4</span>
                      <span>Click "Deploy" - Vercel will automatically build and deploy</span>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Environment Variables for Production</h3>
                  <CodeBlock
                    id="prod-env"
                    language="bash"
                    code={`OPENAI_API_KEY=sk-proj-your_production_key
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyD_your_production_key`}
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Alternative Platforms</h3>
                  <p className="text-gray-700 mb-3">NutriScanner works on:</p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• <strong>Netlify</strong> - Configure build command: <code className="bg-gray-100 px-1 rounded">npm run build</code></li>
                    <li>• <strong>AWS Amplify</strong> - Connect GitHub repo and configure environment variables</li>
                    <li>• <strong>DigitalOcean App Platform</strong> - Deploy from GitHub with Node.js 18+</li>
                    <li>• <strong>Self-hosted</strong> - Run <code className="bg-gray-100 px-1 rounded">npm run build && npm start</code> on any Node.js server</li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Troubleshooting */}
            <Section id="troubleshooting" title="🔧 Troubleshooting">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">TypeScript errors during build</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p><strong>Issue:</strong> Build fails with type errors</p>
                    <p><strong>Solutions:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Check <code className="bg-gray-100 px-1 rounded">next.config.mjs</code> has <code className="bg-gray-100 px-1 rounded">ignoreBuildErrors: true</code></li>
                      <li>Run <code className="bg-gray-100 px-1 rounded">npm run build</code> locally first to catch issues</li>
                      <li>Ensure all imports match exact file paths (case-sensitive)</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Streaming not working</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p><strong>Issue:</strong> No real-time progress updates</p>
                    <p><strong>Solutions:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Verify using <code className="bg-gray-100 px-1 rounded">experimental_useObject</code> hook</li>
                      <li>Check API route returns <code className="bg-gray-100 px-1 rounded">result.toTextStreamResponse()</code></li>
                      <li>Ensure schema is passed to <code className="bg-gray-100 px-1 rounded">streamObject()</code></li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Schema validation failing</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p><strong>Issue:</strong> AI returns data that doesn't match schema</p>
                    <p><strong>Solutions:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Check system prompt includes all required fields</li>
                      <li>Verify schema descriptions are clear</li>
                      <li>Log validation errors: <code className="bg-gray-100 px-1 rounded">schema.safeParse(object)</code></li>
                      <li>Ensure confidence field is marked as required in prompt</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">PDF extraction quality issues</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p><strong>Issue:</strong> Poor extraction results or missing data</p>
                    <p><strong>Solutions:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Try switching models (OpenAI vs Gemini)</li>
                      <li>Check PDF quality - scanned images should be clear</li>
                      <li>Verify PDF size is under 5MB</li>
                      <li>Review system prompt for clarity</li>
                      <li>Check confidence level - low confidence suggests poor quality document</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* Footer */}
            <div className="pt-12 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Built with Next.js 15, Vercel AI SDK, and modern web technologies. For issues or questions, visit the{" "}
                <ExternalLinkButton href="https://github.com/purelyricky/nutriscan">
                  GitHub repository
                </ExternalLinkButton>
                .
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
