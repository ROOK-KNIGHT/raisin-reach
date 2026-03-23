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
 * Search for places using Google Places Text Search API (New)
 */
export async function searchGooglePlaces(
  query: string,
  location?: string
): Promise<GooglePlaceSearchResult[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn("GOOGLE_PLACES_API_KEY is not configured - skipping Google Places enrichment");
    return [];
  }

  try {
    const searchQuery = location ? `${query} in ${location}` : query;
    
    // Use the new Places API (New) - Text Search endpoint
    const url = "https://places.googleapis.com/v1/places:searchText";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types,places.businessStatus",
      },
      body: JSON.stringify({
        textQuery: searchQuery,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Google Places API error: ${response.status}`, data);
      return [];
    }

    // Transform new API response to match old format
    const places = data.places || [];
    return places.map((place: any) => ({
      place_id: place.id,
      name: place.displayName?.text || "",
      formatted_address: place.formattedAddress || "",
      geometry: {
        location: {
          lat: place.location?.latitude || 0,
          lng: place.location?.longitude || 0,
        },
      },
      rating: place.rating,
      user_ratings_total: place.userRatingCount,
      types: place.types || [],
      business_status: place.businessStatus,
    }));
  } catch (error) {
    console.error("Error searching Google Places:", error);
    return [];
  }
}

/**
 * Get detailed information about a specific place using new Places API
 */
export async function getGooglePlaceDetails(
  placeId: string
): Promise<GooglePlaceDetails | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn("GOOGLE_PLACES_API_KEY is not configured - skipping Google Places details");
    return null;
  }

  try {
    // Use the new Places API (New) - Get Place endpoint
    const url = `https://places.googleapis.com/v1/${placeId}`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "id,displayName,formattedAddress,nationalPhoneNumber,internationalPhoneNumber,websiteUri,rating,userRatingCount,reviews,regularOpeningHours,types,businessStatus,googleMapsUri,location",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Google Places API error: ${response.status}`, data);
      return null;
    }

    // Transform new API response to match old format
    return {
      place_id: data.id,
      name: data.displayName?.text || "",
      formatted_address: data.formattedAddress || "",
      formatted_phone_number: data.nationalPhoneNumber,
      international_phone_number: data.internationalPhoneNumber,
      website: data.websiteUri,
      rating: data.rating,
      user_ratings_total: data.userRatingCount,
      reviews: data.reviews?.map((review: any) => ({
        author_name: review.authorAttribution?.displayName || "Anonymous",
        rating: review.rating || 0,
        text: review.text?.text || "",
        time: new Date(review.publishTime).getTime() / 1000,
      })),
      opening_hours: data.regularOpeningHours ? {
        weekday_text: data.regularOpeningHours.weekdayDescriptions || [],
        open_now: data.regularOpeningHours.openNow || false,
      } : undefined,
      types: data.types || [],
      business_status: data.businessStatus,
      url: data.googleMapsUri,
      geometry: {
        location: {
          lat: data.location?.latitude || 0,
          lng: data.location?.longitude || 0,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching Google Place details:", error);
    return null;
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
