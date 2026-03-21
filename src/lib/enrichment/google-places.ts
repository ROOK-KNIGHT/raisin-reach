/**
 * Google Places API Integration
 * 
 * Provides functions to search for businesses and get detailed place information
 * using the Google Places API.
 */

interface GooglePlaceSearchResult {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  business_status?: string;
}

interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: Array<{
    author_name: string;
    rating: number;
    text: string;
    time: number;
  }>;
  opening_hours?: {
    weekday_text: string[];
    open_now: boolean;
  };
  types: string[];
  business_status?: string;
  url?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

/**
 * Search for places using Google Places Text Search API
 */
export async function searchGooglePlaces(
  query: string,
  location?: string
): Promise<GooglePlaceSearchResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_PLACES_API_KEY is not configured");
  }

  try {
    const searchQuery = location ? `${query} in ${location}` : query;
    const url = new URL("https://maps.googleapis.com/maps/api/place/textsearch/json");
    url.searchParams.append("query", searchQuery);
    url.searchParams.append("key", apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || "Unknown error"}`);
    }

    return data.results || [];
  } catch (error) {
    console.error("Error searching Google Places:", error);
    throw error;
  }
}

/**
 * Get detailed information about a specific place
 */
export async function getGooglePlaceDetails(
  placeId: string
): Promise<GooglePlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_PLACES_API_KEY is not configured");
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.append("place_id", placeId);
    url.searchParams.append("fields", "place_id,name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,reviews,opening_hours,types,business_status,url,geometry");
    url.searchParams.append("key", apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Google Places API error: ${data.status} - ${data.error_message || "Unknown error"}`);
    }

    return data.result || null;
  } catch (error) {
    console.error("Error fetching Google Place details:", error);
    throw error;
  }
}

/**
 * Find a business by name and location, then get its details
 */
export async function findAndEnrichGooglePlace(
  businessName: string,
  location?: string
): Promise<GooglePlaceDetails | null> {
  try {
    // First, search for the business
    const searchResults = await searchGooglePlaces(businessName, location);

    if (searchResults.length === 0) {
      console.log(`No Google Places results found for: ${businessName}`);
      return null;
    }

    // Get details for the first (most relevant) result
    const placeId = searchResults[0].place_id;
    const details = await getGooglePlaceDetails(placeId);

    return details;
  } catch (error) {
    console.error("Error in findAndEnrichGooglePlace:", error);
    return null;
  }
}

/**
 * Extract structured data from Google Place details for prospect enrichment
 */
export function extractGooglePlaceData(details: GooglePlaceDetails) {
  return {
    googlePlaceId: details.place_id,
    companyName: details.name,
    address: details.formatted_address,
    contactPhone: details.formatted_phone_number || details.international_phone_number,
    website: details.website,
    rating: details.rating,
    reviewCount: details.user_ratings_total,
    businessStatus: details.business_status,
    googleMapsUrl: details.url,
    categories: details.types,
    openingHours: details.opening_hours?.weekday_text,
    isOpenNow: details.opening_hours?.open_now,
    reviews: details.reviews?.slice(0, 5).map(review => ({
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      date: new Date(review.time * 1000).toISOString(),
    })),
    location: {
      lat: details.geometry.location.lat,
      lng: details.geometry.location.lng,
    },
  };
}
