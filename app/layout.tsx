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
