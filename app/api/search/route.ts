// Search API Route
// F021-F033: Main Search with Multi-criteria Filtering
// Handles: Tourist Spots, Hotels, Restaurants, Resorts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  SearchType, 
  SpotSearchParams, 
  HotelSearchParams, 
  RestaurantSearchParams, 
  ResortSearchParams,
  SortOption,
  Region,
  SpotType,
  CuisineType,
  PriceRange,
  RestaurantStyle,
  ResortLocationType,
  ResortType
} from '@/types/search';

const prisma = new PrismaClient();

// ==================== UTILITY FUNCTIONS ====================

/**
 * Parse query parameters from URL
 */
function parseSearchParams(searchParams: URLSearchParams): {
  type: SearchType | undefined;
  page: number;
  limit: number;
  sort: SortOption;
  query: string | undefined;
  // Spot filters
  region?: Region;
  spotType?: SpotType;
  minRating?: number;
  maxTicketPrice?: number;
  // Hotel filters
  city?: string;
  starRating?: number[];
  priceMin?: number;
  priceMax?: number;
  amenities?: string[];
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  // Restaurant filters
  cuisineType?: string[];
  priceRange?: string[];
  style?: string[];
  openNow?: boolean;
  // Resort filters
  locationType?: string[];
  resortType?: string[];
  // Tour filters (F051-F055)
  destination?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  // Transport filters (F056-F060)
  transportType?: string[];
  departure?: string;
  arrival?: string;
  company?: string[];
  // Distance search (F042)
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
} {
  const type = searchParams.get('type') as SearchType | null;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const sort = (searchParams.get('sort') || 'rating_desc') as SortOption;
  const query = searchParams.get('query') || undefined;

  // Parse array parameters
  const parseArray = (param: string | null): string[] | undefined => {
    if (!param) return undefined;
    return param.split(',').filter(Boolean);
  };

  const parseNumberArray = (param: string | null): number[] | undefined => {
    if (!param) return undefined;
    return param.split(',').map(Number).filter(n => !isNaN(n));
  };

  return {
    type: type || undefined,
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    sort,
    query,
    // Spot filters
    region: searchParams.get('region') as Region | undefined,
    spotType: searchParams.get('spotType') as SpotType | undefined,
    minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
    maxTicketPrice: searchParams.get('maxTicketPrice') ? parseFloat(searchParams.get('maxTicketPrice')!) : undefined,
    // Hotel filters
    city: searchParams.get('city') || undefined,
    starRating: parseNumberArray(searchParams.get('starRating')),
    priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
    priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
    amenities: parseArray(searchParams.get('amenities')),
    checkIn: searchParams.get('checkIn') || undefined,
    checkOut: searchParams.get('checkOut') || undefined,
    guests: searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : undefined,
    // Restaurant filters
    cuisineType: parseArray(searchParams.get('cuisineType')),
    priceRange: parseArray(searchParams.get('priceRange')),
    style: parseArray(searchParams.get('style')),
    openNow: searchParams.get('openNow') === 'true',
    // Resort filters
    locationType: parseArray(searchParams.get('locationType')),
    resortType: parseArray(searchParams.get('resortType')),
    // Tour filters (F051-F055)
    destination: searchParams.get('destination') || undefined,
    duration: searchParams.get('duration') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    // Transport filters (F056-F060)
    transportType: parseArray(searchParams.get('transportType')),
    departure: searchParams.get('departure') || undefined,
    arrival: searchParams.get('arrival') || undefined,
    company: parseArray(searchParams.get('company')),
    // Distance search
    latitude: searchParams.get('latitude') ? parseFloat(searchParams.get('latitude')!) : undefined,
    longitude: searchParams.get('longitude') ? parseFloat(searchParams.get('longitude')!) : undefined,
    maxDistance: searchParams.get('maxDistance') ? parseFloat(searchParams.get('maxDistance')!) : undefined,
  };
}

/**
 * Calculate skip value for pagination
 */
function getSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Build orderBy clause based on sort option
 * F036: Sorting logic
 */
function getOrderBy(sort: SortOption, hasGeoLocation: boolean = false) {
  const sortMapping: Record<string, any> = {
    [SortOption.PRICE_ASC]: { priceMin: 'asc' },
    [SortOption.PRICE_DESC]: { priceMin: 'desc' },
    [SortOption.RATING_DESC]: { rating: 'desc' },
    [SortOption.RATING_ASC]: { rating: 'asc' },
    [SortOption.NAME_ASC]: { name: 'asc' },
    [SortOption.NAME_DESC]: { name: 'desc' },
    // F042: Distance sorting requires raw query, handled separately
  };

  if (sort === SortOption.DISTANCE && hasGeoLocation) {
    return undefined; // Will use raw query for distance
  }

  return sortMapping[sort] || { rating: 'desc' };
}

/**
 * F027: Check room availability
 * Compares total rooms in inventory vs booked rooms for a date range
 */
async function checkRoomAvailability(
  hotelId: string, 
  checkIn: Date, 
  checkOut: Date, 
  requiredRooms: number
): Promise<boolean> {
  // Get total available rooms from all room types
  const rooms = await prisma.room.findMany({
    where: { hotelId },
    select: { available: true }
  });

  const totalAvailable = rooms.reduce((sum, room) => sum + room.available, 0);

  // Count booked rooms in the date range
  // Note: In a real system, you'd have a Booking model with checkIn/checkOut
  // For now, we assume rooms are reserved if they exist and are marked available
  
  return totalAvailable >= requiredRooms;
}

/**
 * F042: Calculate distance using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ==================== SPOT SEARCH (F022) ====================

async function searchSpots(params: ReturnType<typeof parseSearchParams>) {
  const { page, limit, sort, query, region, spotType, minRating, maxTicketPrice, latitude, longitude, maxDistance } = params;

  // F042: Distance-based search
  const hasGeoLocation = latitude && longitude;

  // Build where clause
  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { location: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (region) where.region = region;
  if (spotType) where.type = spotType;
  if (minRating) where.rating = { gte: minRating };
  if (maxTicketPrice) where.ticketPrice = { lte: maxTicketPrice };

  // Execute query
  const [spots, total] = await Promise.all([
    prisma.touristSpot.findMany({
      where,
      orderBy: getOrderBy(sort, hasGeoLocation),
      skip: getSkip(page, limit),
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        region: true,
        type: true,
        images: true,
        bestTime: true,
        ticketPrice: true,
        rating: true,
        latitude: true,
        longitude: true,
      }
    }),
    prisma.touristSpot.count({ where }),
  ]);

  // F042: Calculate distance and filter
  let results = spots;
  if (hasGeoLocation) {
    results = spots
      .map(spot => ({
        ...spot,
        distance: spot.latitude && spot.longitude 
          ? calculateDistance(latitude!, longitude!, spot.latitude, spot.longitude)
          : null
      }))
      .filter(spot => spot.distance !== null && (!maxDistance || spot.distance <= maxDistance))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }

  return { results, total };
}

// ==================== HOTEL SEARCH (F023-F027) ====================

async function searchHotels(params: ReturnType<typeof parseSearchParams>) {
  const { page, limit, sort, query, city, starRating, priceMin, priceMax, amenities, checkIn, checkOut, guests } = params;

  // Build where clause
  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { address: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (starRating && starRating.length > 0) where.starRating = { in: starRating };
  if (priceMin || priceMax) {
    where.priceMin = {};
    if (priceMin) where.priceMin.gte = priceMin;
    if (priceMax) where.priceMax.lte = priceMax;
  }
  if (amenities && amenities.length > 0) {
    where.amenities = { hasEvery: amenities };
  }

  // F027: Check room availability if dates provided
  let availableHotelIds: string[] | null = null;
  if (checkIn && checkOut && guests) {
    const hotels = await prisma.hotel.findMany({
      where,
      include: {
        rooms: {
          where: { maxGuests: { gte: guests } }
        }
      }
    });

    availableHotelIds = [];
    for (const hotel of hotels) {
      const totalAvailable = hotel.rooms.reduce((sum, room) => sum + room.available, 0);
      if (totalAvailable > 0) {
        availableHotelIds.push(hotel.id);
      }
    }

    if (availableHotelIds.length === 0) {
      return { results: [], total: 0 };
    }
  }

  if (availableHotelIds) {
    where.id = { in: availableHotelIds };
  }

  // Execute query
  const [hotels, total] = await Promise.all([
    prisma.hotel.findMany({
      where,
      orderBy: getOrderBy(sort),
      skip: getSkip(page, limit),
      take: limit,
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        starRating: true,
        priceMin: true,
        priceMax: true,
        amenities: true,
        images: true,
        rating: true,
        latitude: true,
        longitude: true,
      }
    }),
    prisma.hotel.count({ where }),
  ]);

  return { results: hotels, total };
}

// ==================== RESTAURANT SEARCH (F028-F030) ====================

async function searchRestaurants(params: ReturnType<typeof parseSearchParams>) {
  const { page, limit, sort, query, city, cuisineType, priceRange, style, openNow } = params;

  // Build where clause
  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { address: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (city) where.city = { contains: city, mode: 'insensitive' };
  if (cuisineType && cuisineType.length > 0) where.cuisineType = { in: cuisineType };
  if (priceRange && priceRange.length > 0) where.priceRange = { in: priceRange };
  if (style && style.length > 0) where.style = { in: style };

  // F028: Check if currently open
  if (openNow) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:mm format
    // Note: In production, you'd compare with openTime/closeTime
    // For now, we return all restaurants
  }

  // Execute query
  const [restaurants, total] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      orderBy: getOrderBy(sort),
      skip: getSkip(page, limit),
      take: limit,
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        cuisineType: true,
        priceRange: true,
        style: true,
        openTime: true,
        closeTime: true,
        images: true,
        rating: true,
        latitude: true,
        longitude: true,
      }
    }),
    prisma.restaurant.count({ where }),
  ]);

  return { results: restaurants, total };
}

// ==================== RESORT SEARCH (F031-F033) ====================

async function searchResorts(params: ReturnType<typeof parseSearchParams>) {
  const { page, limit, sort, query, locationType, starRating, priceMin, priceMax, resortType, amenities } = params;

  // Build where clause
  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { address: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (locationType && locationType.length > 0) where.locationType = { in: locationType };
  if (starRating && starRating.length > 0) where.starRating = { in: starRating };
  if (priceMin || priceMax) {
    where.priceMin = {};
    if (priceMin) where.priceMin.gte = priceMin;
    if (priceMax) where.priceMax.lte = priceMax;
  }
  if (resortType && resortType.length > 0) where.resortType = { in: resortType };
  if (amenities && amenities.length > 0) {
    where.amenities = { hasEvery: amenities };
  }

  // Execute query
  const [resorts, total] = await Promise.all([
    prisma.resort.findMany({
      where,
      orderBy: getOrderBy(sort),
      skip: getSkip(page, limit),
      take: limit,
      select: {
        id: true,
        name: true,
        address: true,
        locationType: true,
        starRating: true,
        priceMin: true,
        priceMax: true,
        resortType: true,
        amenities: true,
        images: true,
        rating: true,
        latitude: true,
        longitude: true,
      }
    }),
    prisma.resort.count({ where }),
  ]);

  return { results: resorts, total };
}

// ==================== TOUR SEARCH (F051-F055) ====================

async function searchTours(params: ReturnType<typeof parseSearchParams>) {
  const { page, limit, sort, query, priceMin, priceMax, destination, startDate, endDate } = params;

  // Build where clause
  const where: any = {};

  if (query) {
    where.OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ];
  }

  // F052: Filter by price range
  if (priceMin || priceMax) {
    where.price = {};
    if (priceMin) where.price.gte = priceMin;
    if (priceMax) where.price.lte = priceMax;
  }

  // F053: Filter by duration (number of days)
  if (params.duration) {
    where.duration = params.duration;
  }

  // F054: Filter by start date
  if (startDate) {
    where.startDate = { gte: new Date(startDate) };
  }

  // F055: Filter by destinations
  if (destination) {
    where.destinations = { has: destination };
  }

  // Execute query
  const [tours, total] = await Promise.all([
    prisma.tourPackage.findMany({
      where,
      orderBy: getOrderBy(sort),
      skip: getSkip(page, limit),
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        duration: true,
        itinerary: true,
        includes: true,
        price: true,
        discount: true,
        startDate: true,
        endDate: true,
        destinations: true,
        images: true,
        rating: true,
      }
    }),
    prisma.tourPackage.count({ where }),
  ]);

  // Calculate discounted price for display
  const results = tours.map(tour => ({
    ...tour,
    discountedPrice: tour.discount ? tour.price * (1 - tour.discount / 100) : tour.price,
  }));

  return { results, total };
}

// ==================== TRANSPORT SEARCH (F056-F060) ====================

async function searchTransports(params: ReturnType<typeof parseSearchParams>) {
  const { page, limit, sort, query, transportType, departure, arrival, priceMin, priceMax, company } = params;

  // Build where clause
  const where: any = {};

  if (query) {
    where.OR = [
      { route: { contains: query, mode: 'insensitive' } },
      { company: { contains: query, mode: 'insensitive' } },
      { type: { contains: query, mode: 'insensitive' } },
    ];
  }

  // F057: Filter by transport type (máy bay, xe khách, tàu hỏa, thuê xe, limousine)
  if (transportType && transportType.length > 0) {
    where.type = { in: transportType };
  }

  // F056: Filter by departure location
  if (departure) {
    where.departure = { contains: departure, mode: 'insensitive' };
  }

  // F056: Filter by arrival location
  if (arrival) {
    where.arrival = { contains: arrival, mode: 'insensitive' };
  }

  // F058: Filter by price range
  if (priceMin || priceMax) {
    where.price = {};
    if (priceMin) where.price.gte = priceMin;
    if (priceMax) where.price.lte = priceMax;
  }

  // F059: Filter by company/carrier
  if (company && company.length > 0) {
    where.company = { in: company };
  }

  // Execute query
  const [transports, total] = await Promise.all([
    prisma.transport.findMany({
      where,
      orderBy: getOrderBy(sort),
      skip: getSkip(page, limit),
      take: limit,
      select: {
        id: true,
        type: true,
        route: true,
        company: true,
        departure: true,
        arrival: true,
        schedule: true,
        price: true,
        duration: true,
        contact: true,
      }
    }),
    prisma.transport.count({ where }),
  ]);

  return { results: transports, total };
}

// ==================== MAIN HANDLER ====================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = parseSearchParams(searchParams);

    const { type, page, limit } = params;

    let searchResults;
    let results: any[] = [];
    let total = 0;

    // Route to appropriate search function
    switch (type) {
      case SearchType.SPOT:
        searchResults = await searchSpots(params);
        results = searchResults.results;
        total = searchResults.total;
        break;

      case SearchType.HOTEL:
        searchResults = await searchHotels(params);
        results = searchResults.results;
        total = searchResults.total;
        break;

      case SearchType.RESTAURANT:
        searchResults = await searchRestaurants(params);
        results = searchResults.results;
        total = searchResults.total;
        break;

      case SearchType.RESORT:
        searchResults = await searchResorts(params);
        results = searchResults.results;
        total = searchResults.total;
        break;

      case SearchType.TOUR:
        searchResults = await searchTours(params);
        results = searchResults.results;
        total = searchResults.total;
        break;

      case SearchType.TRANSPORT:
        searchResults = await searchTransports(params);
        results = searchResults.results;
        total = searchResults.total;
        break;

      default:
        // F021: Multi-purpose search - search all types
        const [spots, hotels, restaurants, resorts, tours, transports] = await Promise.all([
          searchSpots(params),
          searchHotels(params),
          searchRestaurants(params),
          searchResorts(params),
          searchTours(params),
          searchTransports(params),
        ]);

        // Merge results
        results = [
          ...spots.results.map(r => ({ ...r, searchType: SearchType.SPOT })),
          ...hotels.results.map(r => ({ ...r, searchType: SearchType.HOTEL })),
          ...restaurants.results.map(r => ({ ...r, searchType: SearchType.RESTAURANT })),
          ...resorts.results.map(r => ({ ...r, searchType: SearchType.RESORT })),
          ...tours.results.map(r => ({ ...r, searchType: SearchType.TOUR })),
          ...transports.results.map(r => ({ ...r, searchType: SearchType.TRANSPORT })),
        ];
        total = spots.total + hotels.total + restaurants.total + resorts.total + tours.total + transports.total;

        // Sort combined results
        if (params.sort === SortOption.RATING_DESC) {
          results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (params.sort === SortOption.PRICE_ASC) {
          results.sort((a, b) => (a.priceMin || a.price || 0) - (b.priceMin || b.price || 0));
        }
        break;
    }

    // F037: Pagination response
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: results,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
