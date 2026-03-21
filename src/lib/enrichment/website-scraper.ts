/**
 * Website Scraper
 * 
 * Scrapes basic information from business websites using cheerio
 */

import * as cheerio from "cheerio";

interface ScrapedWebsiteData {
  title: string | null;
  description: string | null;
  emails: string[];
  phones: string[];
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
  };
  headings: string[];
  bodyText: string;
  images: string[];
  links: string[];
}

/**
 * Scrape a website and extract useful information
 */
export async function scrapeWebsite(url: string): Promise<ScrapedWebsiteData | null> {
  try {
    // Ensure URL has protocol
    const fullUrl = url.startsWith("http") ? url : `https://${url}`;

    const response = await fetch(fullUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RaisinReach/1.0; +https://raisinreach.com)",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract title
    const title = $("title").text().trim() || $('meta[property="og:title"]').attr("content") || null;

    // Extract description
    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      null;

    // Extract emails (basic regex pattern)
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const bodyText = $("body").text();
    const emails = Array.from(new Set(bodyText.match(emailRegex) || []));

    // Extract phone numbers (US format)
    const phoneRegex = /(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = Array.from(new Set(bodyText.match(phoneRegex) || []));

    // Extract social media links
    const socialLinks: ScrapedWebsiteData["socialLinks"] = {};
    $("a[href]").each((_, element) => {
      const href = $(element).attr("href");
      if (href) {
        if (href.includes("facebook.com")) {
          socialLinks.facebook = href;
        } else if (href.includes("twitter.com") || href.includes("x.com")) {
          socialLinks.twitter = href;
        } else if (href.includes("linkedin.com")) {
          socialLinks.linkedin = href;
        } else if (href.includes("instagram.com")) {
          socialLinks.instagram = href;
        } else if (href.includes("youtube.com")) {
          socialLinks.youtube = href;
        }
      }
    });

    // Extract headings
    const headings: string[] = [];
    $("h1, h2, h3").each((_, element) => {
      const text = $(element).text().trim();
      if (text && text.length < 200) {
        headings.push(text);
      }
    });

    // Extract main body text (limited to first 5000 chars)
    const mainText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 5000);

    // Extract images
    const images: string[] = [];
    $("img[src]").each((_, element) => {
      const src = $(element).attr("src");
      if (src) {
        // Convert relative URLs to absolute
        const absoluteSrc = src.startsWith("http") ? src : new URL(src, fullUrl).href;
        images.push(absoluteSrc);
      }
    });

    // Extract internal links
    const links: string[] = [];
    $("a[href]").each((_, element) => {
      const href = $(element).attr("href");
      if (href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
        try {
          const absoluteHref = href.startsWith("http") ? href : new URL(href, fullUrl).href;
          links.push(absoluteHref);
        } catch (e) {
          // Invalid URL, skip
        }
      }
    });

    return {
      title,
      description,
      emails: emails.slice(0, 5), // Limit to 5 emails
      phones: phones.slice(0, 5), // Limit to 5 phones
      socialLinks,
      headings: headings.slice(0, 10), // Limit to 10 headings
      bodyText: mainText,
      images: images.slice(0, 10), // Limit to 10 images
      links: Array.from(new Set(links)).slice(0, 20), // Limit to 20 unique links
    };
  } catch (error) {
    console.error(`Error scraping website ${url}:`, error);
    return null;
  }
}

/**
 * Extract structured data from scraped website for prospect enrichment
 */
export function extractWebsiteData(scraped: ScrapedWebsiteData, originalUrl: string) {
  return {
    website: originalUrl,
    websiteTitle: scraped.title,
    websiteDescription: scraped.description,
    contactEmails: scraped.emails,
    contactPhones: scraped.phones,
    facebookUrl: scraped.socialLinks.facebook,
    twitterUrl: scraped.socialLinks.twitter,
    linkedinUrl: scraped.socialLinks.linkedin,
    instagramUrl: scraped.socialLinks.instagram,
    youtubeUrl: scraped.socialLinks.youtube,
    websiteHeadings: scraped.headings,
    websiteContent: scraped.bodyText,
    websiteImages: scraped.images,
  };
}

/**
 * Analyze website content to extract business insights
 */
export function analyzeWebsiteContent(scraped: ScrapedWebsiteData): {
  hasContactInfo: boolean;
  hasSocialMedia: boolean;
  contentQuality: "high" | "medium" | "low";
  keywords: string[];
} {
  const hasContactInfo = scraped.emails.length > 0 || scraped.phones.length > 0;
  const hasSocialMedia = Object.keys(scraped.socialLinks).length > 0;

  // Simple content quality assessment
  let contentQuality: "high" | "medium" | "low" = "low";
  if (scraped.bodyText.length > 2000 && scraped.headings.length > 3) {
    contentQuality = "high";
  } else if (scraped.bodyText.length > 500 && scraped.headings.length > 1) {
    contentQuality = "medium";
  }

  // Extract potential keywords from headings
  const keywords = scraped.headings
    .flatMap(h => h.toLowerCase().split(/\s+/))
    .filter(word => word.length > 4)
    .slice(0, 20);

  return {
    hasContactInfo,
    hasSocialMedia,
    contentQuality,
    keywords: Array.from(new Set(keywords)),
  };
}
