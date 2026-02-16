import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "RaisinReach | Cold Calling Mastery & Guaranteed Appointments",
  description: "Stop dialing for dollars. We engineer high-value human connections. 20 years of sales mastery delivering guaranteed B2B appointments.",
  keywords: [
    "B2B Appointment Setting",
    "Cold Calling Mastery",
    "Sales Pipeline Engineering",
    "Guaranteed Appointments",
    "High-Ticket Sales",
    "Lead Generation",
  ],
  openGraph: {
    title: "RaisinReach | Cold Calling Mastery",
    description: "20 Years. Zero Scripts. Your Calendar, Fortified.",
    type: "website",
    locale: "en_US",
    siteName: "RaisinReach",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#3E1F47",
};

export default function Sitemap() {
  const baseUrl = "https://raisinreach.com";
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/knowledge`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9, // High priority for AEO
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}

export function Robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: "https://raisinreach.com/sitemap.xml",
  };
}
