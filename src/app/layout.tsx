import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import SessionProvider from "@/components/providers/SessionProvider";
import ToastProvider from "@/components/providers/ToastProvider";

// Fonts
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-satoshi", // Using Inter as fallback for Satoshi
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export { metadata, viewport } from "./seo-metadata";

// SEO Component
const SEOStructuredData = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "name": "RaisinReach",
        "image": "https://raisinreach.com/logo.png",
        "url": "https://raisinreach.com",
        "telephone": "",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "",
          "addressLocality": "",
          "postalCode": "",
          "addressCountry": "US"
        },
        "priceRange": "$$$",
        "description": "Elite cold-calling consultancy. We don't dial; we connect.",
        "founder": {
          "@type": "Person",
          "name": "Reach"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <SEOStructuredData />
      </head>
      <body
        className={clsx(
          inter.variable,
          spaceGrotesk.variable,
          "antialiased bg-brand-bone text-brand-charcoal font-sans"
        )}
      >
        <SessionProvider>
          <ToastProvider />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
