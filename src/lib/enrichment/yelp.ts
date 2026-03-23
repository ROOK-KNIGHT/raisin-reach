/**
 * Yelp Fusion API Integration
 * 
 * Provides functions to search for businesses and get detailed business information
 * using the Yelp Fusion API.
 */

interface YelpBusinessSearchResult {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_closed: boolean;
  url: string;
  review_count: number;
  categories: Array<{
    alias: string;
    title: string;
  }>;
  rating: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  transactions: string[];
  price?: string;
  location: {
    address1: string;
    address2: string | null;
    address3: string | null;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address: string[];
  };
  phone: string;
  display_phone: string;
  distance?: number;
}

interface YelpBusinessDetails {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_claimed: boolean;
  is_closed: boolean;
  url: string;
  phone: string;
  display_phone: string;
  review_count: number;
  categories: Array<{
    alias: string;
    title: string;
  }>;
  rating: number;
  location: {
    address1: string;
    address2: string | null;
    address3: string | null;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address: string[];
    cross_streets?: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  photos: string[];
  price?: string;
  hours?: Array<{
    open: Array<{
      is_overnight: boolean;
      start: string;
      end: string;
      day: number;
    }>;
    hours_type: string;
    is_open_now: boolean;
  }>;
  transactions: string[];
  messaging?: {
    url: string;
    use_case_text: string;
  };
}

interface YelpReview {
  id: string;
  rating: number;
  user: {
    id: string;
    profile_url: string;
    image_url: string | null;
    name: string;
  };
  text: string;
  time_created: string;
  url: string;
}

/**
 * Search for businesses using Yelp Fusion API
 */
export async function searchYelpBusinesses(
  term: string,
  location?: string,
  limit: number = 10
): Promise<YelpBusinessSearchResult[]> {
  const apiKey = process.env.YELP_API_KEY;

  if (!apiKey) {
    console.warn("YELP_API_KEY is not configured - skipping Yelp enrichment");
    return [];
  }

  try {
    const url = new URL("https://api.yelp.com/v3/businesses/search");
    url.searchParams.append("term", term);
    if (location) {
      url.searchParams.append("location", location);
    }
    url.searchParams.append("limit", limit.toString());

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error(`Yelp API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.businesses || [];
  } catch (error) {
    console.error("Error searching Yelp businesses:", error);
    return [];
  }
}

/**
 * Get detailed information about a specific business
 */
export async function getYelpBusinessDetails(
  businessId: string
): Promise<YelpBusinessDetails | null> {
  const apiKey = process.env.YELP_API_KEY;

  if (!apiKey) {
    console.warn("YELP_API_KEY is not configured - skipping Yelp details");
    return null;
  }

  try {
    const url = `https://api.yelp.com/v3/businesses/${businessId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error(`Yelp API error: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching Yelp business details:", error);
    return null;
  }
}

/**
 * Get reviews for a specific business
 */
export async function getYelpBusinessReviews(
  businessId: string,
  limit: number = 3
): Promise<YelpReview[]> {
  const apiKey = process.env.YELP_API_KEY;

  if (!apiKey) {
    console.warn("YELP_API_KEY is not configured - skipping Yelp reviews");
    return [];
  }

  try {
    const url = new URL(`https://api.yelp.com/v3/businesses/${businessId}/reviews`);
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("sort_by", "yelp_sort");

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      console.error(`Yelp API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data.reviews || [];
  } catch (error) {
    console.error("Error fetching Yelp reviews:", error);
    return [];
  }
}

/**
 * Find a business by name and location, then get its details and reviews
 */
export async function findAndEnrichYelpBusiness(
  businessName: string,
  location?: string
): Promise<{ details: YelpBusinessDetails; reviews: YelpReview[] } | null> {
  try {
    // First, search for the business
    const searchResults = await searchYelpBusinesses(businessName, location, 1);

    if (searchResults.length === 0) {
      console.log(`No Yelp results found for: ${businessName}`);
      return null;
    }

    // Get details and reviews for the first (most relevant) result
    const businessId = searchResults[0].id;
    const [details, reviews] = await Promise.all([
      getYelpBusinessDetails(businessId),
      getYelpBusinessReviews(businessId, 5),
    ]);

    if (!details) {
      return null;
    }

    return { details, reviews };
  } catch (error) {
    console.error("Error in findAndEnrichYelpBusiness:", error);
    return null;
  }
}

/**
 * Extract structured data from Yelp business details for prospect enrichment
 */
export function extractYelpData(
  details: YelpBusinessDetails,
  reviews: YelpReview[]
) {
  return {
    yelpId: details.id,
    yelpUrl: details.url,
    companyName: details.name,
    isClaimed: details.is_claimed,
    isClosed: details.is_closed,
    address: details.location.display_address.join(", "),
    city: details.location.city,
    state: details.location.state,
    zipCode: details.location.zip_code,
    contactPhone: details.display_phone,
    rating: details.rating,
    reviewCount: details.review_count,
    priceRange: details.price,
    categories: details.categories.map(cat => cat.title),
    photos: details.photos,
    isOpenNow: details.hours?.[0]?.is_open_now,
    transactions: details.transactions,
    location: {
      lat: details.coordinates.latitude,
      lng: details.coordinates.longitude,
    },
    reviews: reviews.map(review => ({
      author: review.user.name,
      rating: review.rating,
      text: review.text,
      date: review.time_created,
      url: review.url,
    })),
  };
}
