"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NextLink from "next/link";

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
            <img src="/nutriscanner.svg" alt="NutriScanner" className="h-8 w-8" />
            <h1 className="text-xl font-bold text-gray-900">NutriScanner Documentation</h1>
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
                      { id: "frontend-setup", label: "Frontend Setup" },
                      { id: "backend-deployment", label: "Backend Deployment" },
                      { id: "environment-variables", label: "Environment Variables" },
                      { id: "testing", label: "Testing" },
                      { id: "architecture", label: "Architecture" },
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
                NutriScanner is an AI-powered application that extracts nutritional information and allergen data
                from food product PDF labels. It uses vision-language models to analyze documents in multiple
                languages (Hungarian, English, or both).
              </p>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-blue-900 mb-3">Key Features</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Three AI model options: OpenAI GPT-4o, Google Gemini 1.5 Pro, and Qwen 2.5-VL (self-hosted)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Multi-language support (Hungarian & English)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Real-time streaming extraction with progress tracking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">✓</span>
                      <span>Cost-effective self-hosted option via Modal (experimental)</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Section>

            {/* Frontend Setup */}
            <Section id="frontend-setup" title="💻 Frontend Setup">
              <p className="text-gray-700">
                Follow these steps to set up and run the NutriScanner frontend on your local machine.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">1. Clone the Repository</h3>
                  <CodeBlock
                    id="clone"
                    language="bash"
                    code="git clone https://github.com/yourusername/nutri-scan.git\ncd nutri-scan"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Install Dependencies</h3>
                  <p className="text-gray-700 mb-3">
                    NutriScanner uses Next.js 15 with React 19. Install all required packages:
                  </p>
                  <CodeBlock
                    id="install"
                    language="bash"
                    code="npm install"
                  />
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 font-medium mb-2">Key Dependencies:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Next.js 15.1.0 - React framework</li>
                      <li>• Vercel AI SDK 4.0.16 - AI model integration</li>
                      <li>• Tailwind CSS 3.4.16 - Styling</li>
                      <li>• Zod 3.24.1 - Schema validation</li>
                      <li>• Framer Motion 11.14.1 - Animations</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">3. Configure Environment Variables</h3>
                  <p className="text-gray-700 mb-3">
                    Create a <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env</code> file in the root directory:
                  </p>
                  <CodeBlock
                    id="env"
                    language="bash"
                    code={`# OpenAI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini Configuration (Required)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here

# Qwen Modal Deployment (Optional - Self-hosted experimental)
QWEN_BASE_URL=your_modal_endpoint_url_here
QWEN_API_KEY=`}
                  />
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-700">
                      <strong>Get your OpenAI API key:</strong>{" "}
                      <ExternalLinkButton href="https://platform.openai.com/api-keys">
                        platform.openai.com/api-keys
                      </ExternalLinkButton>
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Get your Google Gemini API key:</strong>{" "}
                      <ExternalLinkButton href="https://aistudio.google.com/app/apikey">
                        aistudio.google.com/app/apikey
                      </ExternalLinkButton>
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>For Qwen setup:</strong> See the Backend Deployment section below (optional, experimental)
                    </p>
                  </div>
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
                    in your browser to see the application.
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

            {/* Backend Deployment */}
            <Section id="backend-deployment" title="🚀 Backend Deployment (Qwen on Modal)">
              <p className="text-gray-700 mb-4">
                Deploy the Qwen2.5-VL-3B-Instruct vision-language model on{" "}
                <ExternalLinkButton href="https://modal.com">Modal.com</ExternalLinkButton> for cost-effective,
                self-hosted AI inference.
              </p>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-green-900 mb-3">Why Modal + A10G GPU?</h3>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">💰</span>
                      <span>Cost: ~$1.10/hr on A10G GPU (only when in use) - scales to $0 when idle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">🚀</span>
                      <span>24GB VRAM - Perfect for vision models with PDFs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">⚡</span>
                      <span>2x faster than T4 for vision tasks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">📄</span>
                      <span>Auto PDF→Image conversion at 200 DPI for quality OCR</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">🌐</span>
                      <span>OpenAI-compatible API endpoints</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Prerequisites</h3>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex items-center justify-center">
                        1
                      </span>
                      <div>
                        <p className="text-gray-700">
                          <strong>Modal Account:</strong> Sign up at{" "}
                          <ExternalLinkButton href="https://modal.com">modal.com</ExternalLinkButton> (free tier available)
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex items-center justify-center">
                        2
                      </span>
                      <div>
                        <p className="text-gray-700">
                          <strong>HuggingFace Token:</strong> Get from{" "}
                          <ExternalLinkButton href="https://huggingface.co/settings/tokens">
                            huggingface.co/settings/tokens
                          </ExternalLinkButton>
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold flex items-center justify-center">
                        3
                      </span>
                      <div>
                        <p className="text-gray-700">
                          <strong>Python 3.11+:</strong> Required for Modal CLI
                        </p>
                      </div>
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 1: Install Modal CLI</h3>
                  <CodeBlock
                    id="modal-install"
                    language="bash"
                    code="pip install modal"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 2: Authenticate Modal</h3>
                  <CodeBlock
                    id="modal-auth"
                    language="bash"
                    code="modal token new"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    This will open a browser window for authentication. Follow the prompts to link your Modal account.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 3: Set HuggingFace Secret</h3>
                  <CodeBlock
                    id="modal-secret"
                    language="bash"
                    code="modal secret create huggingface-secret HF_TOKEN=your_huggingface_token_here"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    This securely stores your HuggingFace token for downloading the Qwen model.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 4: Deploy to Modal</h3>
                  <CodeBlock
                    id="modal-deploy"
                    language="bash"
                    code="cd back_end\nmodal deploy deploy_qwen.py"
                  />
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800 mb-2">
                      <strong>⏱️ Deployment time:</strong> First deployment may take 5-10 minutes as Modal builds the
                      container image, installs poppler-utils for PDF processing, and downloads the model (~6GB).
                    </p>
                    <p className="text-sm text-yellow-800">
                      <strong>💡 Why A10G?</strong> A10G has 24GB VRAM vs T4's 16GB. This extra memory handles large PDFs better and is ~2x faster for vision models. Worth the extra $0.51/hr for smooth performance!
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 5: Get Your Endpoint URL</h3>
                  <p className="text-gray-700 mb-3">
                    After successful deployment, Modal will output URLs like:
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-mono text-gray-700">
                      ✓ Created web function chat_completions =&gt;{" "}
                      <span className="text-blue-600">
                        https://yourname--nutriscan-qwen-inference-chat-completions.modal.run
                      </span>
                    </p>
                  </div>
                  <p className="text-gray-700 mt-3">
                    Copy the <code className="bg-gray-100 px-2 py-1 rounded text-sm">web_app</code> base URL and add
                    it to your <code className="bg-gray-100 px-2 py-1 rounded text-sm">.env</code> file:
                  </p>
                  <CodeBlock
                    id="modal-url"
                    language="bash"
                    code="QWEN_BASE_URL=https://yourname--nutriscan-qwen-inference-qwenvlinference-web-app.modal.run"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 6: Test Your Deployment</h3>
                  <p className="text-gray-700 mb-3">Test the health endpoint:</p>
                  <CodeBlock
                    id="test-health"
                    language="bash"
                    code="curl https://yourname--nutriscan-qwen-inference-health.modal.run"
                  />
                  <p className="text-gray-700 mt-4 mb-3">Test the chat completion endpoint:</p>
                  <CodeBlock
                    id="test-chat"
                    language="bash"
                    code={`curl -X POST https://yourname--nutriscan-qwen-inference-chat-completions.modal.run \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "qwen2.5-vl-3b-instruct",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ],
    "max_tokens": 100,
    "temperature": 0.7
  }'`}
                  />
                </div>
              </div>
            </Section>

            {/* Environment Variables */}
            <Section id="environment-variables" title="⚙️ Environment Variables">
              <p className="text-gray-700 mb-4">
                Complete reference for all environment variables used in NutriScanner.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                        Variable
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                        Description
                      </th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                        Required
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">OPENAI_API_KEY</code>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                        OpenAI API key for GPT-4o model access
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Required
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">GOOGLE_GENERATIVE_AI_API_KEY</code>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                        Google API key for Gemini 1.5 Pro model access
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Required
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">QWEN_BASE_URL</code>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                        Modal endpoint URL for self-hosted Qwen 2.5-VL model (experimental)
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Optional
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">QWEN_API_KEY</code>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                        API key for Qwen endpoint (usually not needed for Modal)
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Optional
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-sm text-gray-600 mt-3">
                  Note: OpenAI and Gemini are required for production use. Qwen is optional and experimental for self-hosted deployments.
                </p>
              </div>
            </Section>

            {/* Testing */}
            <Section id="testing" title="🧪 Testing">
              <p className="text-gray-700 mb-4">How to test NutriScanner with sample PDFs.</p>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm font-semibold flex items-center justify-center">
                    1
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Prepare a Test PDF</h3>
                    <p className="text-gray-700 text-sm">
                      Use any food product label PDF (preferably in Hungarian or English) that contains nutritional
                      information and allergen data.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm font-semibold flex items-center justify-center">
                    2
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Select AI Model</h3>
                    <p className="text-gray-700 text-sm">Choose between OpenAI GPT-4o (recommended), Google Gemini 1.5 Pro, or Qwen 2.5-VL (self-hosted experimental).</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm font-semibold flex items-center justify-center">
                    3
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Upload and Extract</h3>
                    <p className="text-gray-700 text-sm">
                      Upload your PDF and click "Extract Information". Watch the real-time progress as the AI analyzes
                      the document.
                    </p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm font-semibold flex items-center justify-center">
                    4
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Review Results</h3>
                    <p className="text-gray-700 text-sm">
                      Check the extracted allergen information and nutritional values. The app will show detected
                      language and product name if available.
                    </p>
                  </div>
                </li>
              </ol>
            </Section>

            {/* Architecture */}
            <Section id="architecture" title="🏗️ Architecture">
              <p className="text-gray-700 mb-4">Understanding how NutriScanner works under the hood.</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Technology Stack</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Frontend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Next.js 15 (App Router)</li>
                          <li>• React 19</li>
                          <li>• TypeScript</li>
                          <li>• Tailwind CSS</li>
                          <li>• Framer Motion</li>
                          <li>• Vercel AI SDK</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Backend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li>• Modal (serverless GPU)</li>
                          <li>• Qwen2.5-VL-3B (vision-language)</li>
                          <li>• PyTorch</li>
                          <li>• Transformers</li>
                          <li>• FastAPI</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Flow</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <ol className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">
                          1
                        </span>
                        <span>User uploads PDF via web interface</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">
                          2
                        </span>
                        <span>PDF is base64-encoded in the browser</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">
                          3
                        </span>
                        <span>Request sent to /api/extract with model selection</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">
                          4
                        </span>
                        <span>API route forwards to selected AI model (OpenAI, Gemini, or Qwen)</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">
                          5
                        </span>
                        <span>Vision-language model analyzes PDF and extracts structured data</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">
                          6
                        </span>
                        <span>Results validated against Zod schema</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-semibold flex items-center justify-center">
                          7
                        </span>
                        <span>Streaming response displayed in real-time to user</span>
                      </li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Qwen Integration</h3>
                  <p className="text-gray-700 mb-3">
                    The Qwen model is integrated using an OpenAI-compatible API pattern:
                  </p>
                  <CodeBlock
                    id="qwen-integration"
                    language="typescript"
                    code={`// In /app/api/extract/route.ts
import { createOpenAI } from "@ai-sdk/openai";

const qwenProvider = createOpenAI({
  apiKey: process.env.QWEN_API_KEY || "not-needed",
  baseURL: process.env.QWEN_BASE_URL,
});

const model = qwenProvider("qwen2.5-vl-3b-instruct");`}
                  />
                  <p className="text-sm text-gray-600 mt-3">
                    This pattern makes it seamless to switch between providers - the Vercel AI SDK treats all models
                    uniformly.
                  </p>
                </div>
              </div>
            </Section>

            {/* Troubleshooting */}
            <Section id="troubleshooting" title="🔧 Troubleshooting">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Modal deployment fails</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p>
                      <strong>Issue:</strong> Error during <code className="bg-gray-100 px-2 py-1 rounded">modal deploy</code>
                    </p>
                    <p>
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Verify HuggingFace token is set correctly</li>
                      <li>Check internet connection for model download</li>
                      <li>Ensure Modal account has sufficient credits</li>
                      <li>Run <code className="bg-gray-100 px-2 py-1 rounded">modal token new</code> to re-authenticate</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Qwen model not responding</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p>
                      <strong>Issue:</strong> Requests to Qwen model timeout or fail
                    </p>
                    <p>
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Check QWEN_BASE_URL is correct in .env</li>
                      <li>Test health endpoint to verify deployment is active</li>
                      <li>Cold start may take 15-20 seconds - be patient on first request</li>
                      <li>
                        View logs: <code className="bg-gray-100 px-2 py-1 rounded">modal app logs nutriscan-qwen-inference</code>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">PDF extraction returns empty results</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p>
                      <strong>Issue:</strong> AI model returns no data or incomplete data
                    </p>
                    <p>
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Ensure PDF contains actual nutritional information</li>
                      <li>Try different AI model (switch between OpenAI and Qwen)</li>
                      <li>Check PDF quality - scanned images should be clear</li>
                      <li>PDF must be under 5MB</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">High Modal costs</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-2">
                    <p>
                      <strong>Issue:</strong> Modal billing higher than expected
                    </p>
                    <p>
                      <strong>Solutions:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        Verify <code className="bg-gray-100 px-2 py-1 rounded">container_idle_timeout</code> is set (default 300s)
                      </li>
                      <li>Check for stuck containers in Modal dashboard</li>
                      <li>Consider reducing timeout if idle time is too long</li>
                      <li>Monitor usage in Modal dashboard regularly</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </Section>

            {/* Footer */}
            <div className="pt-12 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Built with ❤️ using Next.js, Vercel AI SDK, and Modal. For issues or questions, visit the{" "}
                <ExternalLinkButton href="https://github.com/yourusername/nutri-scan">
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
