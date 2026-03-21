/**
 * Data Aggregation Pipeline
 * 
 * Orchestrates enrichment from multiple sources and aggregates the results
 */

import { findAndEnrichGooglePlace, extractGooglePlaceData } from "./google-places";
import { findAndEnrichYelpBusiness, extractYelpData } from "./yelp";
import { scrapeWebsite, extractWebsiteData, analyzeWebsiteContent } from "./website-scraper";

export interface EnrichmentSources {
  google?: boolean;
  yelp?: boolean;
  website?: boolean;
}

export interface AggregatedEnrichmentData {
  sources: {
    google?: any;
    yelp?: any;
    website?: any;
  };
  merged: {
    companyName?: string;
    website?: string;
    contactPhone?: string;
    contactEmail?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    rating?: number;
    reviewCount?: number;
    categories?: string[];
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      youtube?: string;
    };
    businessHours?: string[];
    isOpenNow?: boolean;
    photos?: string[];
  };
  metadata: {
    sourcesAttempted: string[];
    sourcesSucceeded: string[];
    sourcesFailed: string[];
    enrichedAt: string;
  };
}

/**
 * Enrich a prospect from multiple sources
 */
export async function enrichProspect(
  companyName: string,
  location?: string,
  websiteUrl?: string,
  sources: EnrichmentSources = { google: true, yelp: true, website: true }
): Promise<AggregatedEnrichmentData> {
  const sourcesAttempted: string[] = [];
  const sourcesSucceeded: string[] = [];
  const sourcesFailed: string[] = [];
  const rawData: AggregatedEnrichmentData["sources"] = {};

  // Google Places enrichment
  if (sources.google) {
    sourcesAttempted.push("google");
    try {
      const googleData = await findAndEnrichGooglePlace(companyName, location);
      if (googleData) {
        rawData.google = extractGooglePlaceData(googleData);
        sourcesSucceeded.push("google");
      } else {
        sourcesFailed.push("google");
      }
    } catch (error) {
      console.error("Google Places enrichment failed:", error);
      sourcesFailed.push("google");
    }
  }

  // Yelp enrichment
  if (sources.yelp) {
    sourcesAttempted.push("yelp");
    try {
      const yelpData = await findAndEnrichYelpBusiness(companyName, location);
      if (yelpData) {
        rawData.yelp = extractYelpData(yelpData.details, yelpData.reviews);
        sourcesSucceeded.push("yelp");
      } else {
        sourcesFailed.push("yelp");
      }
    } catch (error) {
      console.error("Yelp enrichment failed:", error);
      sourcesFailed.push("yelp");
    }
  }

  // Website scraping
  if (sources.website && websiteUrl) {
    sourcesAttempted.push("website");
    try {
      const scrapedData = await scrapeWebsite(websiteUrl);
      if (scrapedData) {
        rawData.website = {
          ...extractWebsiteData(scrapedData, websiteUrl),
          analysis: analyzeWebsiteContent(scrapedData),
        };
        sourcesSucceeded.push("website");
      } else {
        sourcesFailed.push("website");
      }
    } catch (error) {
      console.error("Website scraping failed:", error);
      sourcesFailed.push("website");
    }
  }

  // Merge data from all sources
  const merged = mergeEnrichmentData(rawData);

  return {
    sources: rawData,
    merged,
    metadata: {
      sourcesAttempted,
      sourcesSucceeded,
      sourcesFailed,
      enrichedAt: new Date().toISOString(),
    },
  };
}

/**
 * Merge data from multiple sources, prioritizing more reliable sources
 */
function mergeEnrichmentData(sources: AggregatedEnrichmentData["sources"]) {
  const merged: AggregatedEnrichmentData["merged"] = {};

  // Company name - prefer Google, then Yelp, then website
  merged.companyName =
    sources.google?.companyName ||
    sources.yelp?.companyName ||
    sources.website?.websiteTitle;

  // Website - prefer website scraper (most accurate), then Google, then Yelp
  merged.website =
    sources.website?.website ||
    sources.google?.website ||
    sources.yelp?.website;

  // Contact phone - prefer Google (most formatted), then Yelp, then website
  merged.contactPhone =
    sources.google?.contactPhone ||
    sources.yelp?.contactPhone ||
    sources.website?.contactPhones?.[0];

  // Contact email - only from website scraping
  merged.contactEmail = sources.website?.contactEmails?.[0];

  // Address - prefer Google (most complete), then Yelp
  merged.address = sources.google?.address || sources.yelp?.address;
  merged.city = sources.google?.address?.split(",")[1]?.trim() || sources.yelp?.city;
  merged.state = sources.yelp?.state;
  merged.zipCode = sources.yelp?.zipCode;

  // Rating - average if multiple sources, otherwise use what's available
  const ratings = [sources.google?.rating, sources.yelp?.rating].filter(Boolean) as number[];
  if (ratings.length > 0) {
    merged.rating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
  }

  // Review count - sum from all sources
  merged.reviewCount =
    (sources.google?.reviewCount || 0) + (sources.yelp?.reviewCount || 0);

  // Categories - combine from all sources
  const categories = [
    ...(sources.google?.categories || []),
    ...(sources.yelp?.categories || []),
  ];
  merged.categories = Array.from(new Set(categories));

  // Social links - prefer website scraper, fallback to others
  merged.socialLinks = {
    facebook: sources.website?.facebookUrl,
    twitter: sources.website?.twitterUrl,
    linkedin: sources.website?.linkedinUrl,
    instagram: sources.website?.instagramUrl,
    youtube: sources.website?.youtubeUrl,
  };

  // Business hours - prefer Google
  merged.businessHours = sources.google?.openingHours;
  merged.isOpenNow = sources.google?.isOpenNow ?? sources.yelp?.isOpenNow;

  // Photos - combine from all sources
  const photos = [
    ...(sources.google?.reviews?.flatMap((r: any) => r.photos || []) || []),
    ...(sources.yelp?.photos || []),
    ...(sources.website?.websiteImages || []),
  ];
  merged.photos = Array.from(new Set(photos)).slice(0, 10);

  return merged;
}

/**
 * Calculate a data completeness score (0-100)
 */
export function calculateCompletenessScore(merged: AggregatedEnrichmentData["merged"]): number {
  let score = 0;
  const weights = {
    companyName: 10,
    website: 10,
    contactPhone: 15,
    contactEmail: 15,
    address: 10,
    rating: 10,
    categories: 10,
    socialLinks: 10,
    businessHours: 5,
    photos: 5,
  };

  if (merged.companyName) score += weights.companyName;
  if (merged.website) score += weights.website;
  if (merged.contactPhone) score += weights.contactPhone;
  if (merged.contactEmail) score += weights.contactEmail;
  if (merged.address) score += weights.address;
  if (merged.rating) score += weights.rating;
  if (merged.categories && merged.categories.length > 0) score += weights.categories;
  
  const socialCount = Object.values(merged.socialLinks || {}).filter(Boolean).length;
  if (socialCount > 0) score += weights.socialLinks * (socialCount / 5);
  
  if (merged.businessHours) score += weights.businessHours;
  if (merged.photos && merged.photos.length > 0) score += weights.photos;

  return Math.round(score);
}
