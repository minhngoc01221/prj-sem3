// Search API Route
// F021-F069: Main Search with Multi-criteria Filtering
// Handles: Tourist Spots, Hotels, Restaurants, Resorts, Tours, Transports
// Uses MongoDB directly (same as admin)

import { NextRequest, NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import {
  SearchType,
  SortOption,
  Region,
  SpotType,
  CuisineType,
  PriceRange,
  RestaurantStyle,
  ResortLocationType,
  ResortType,
  TransportType,
  TouristSpot,
  Hotel,
  Restaurant,
  Resort,
  TourPackage,
  Vehicle,
} from '@/types/search';

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
    region: searchParams.get('region') as Region | undefined,
    spotType: searchParams.get('spotType') as SpotType | undefined,
    minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
    maxTicketPrice: searchParams.get('maxTicketPrice') ? parseFloat(searchParams.get('maxTicketPrice')!) : undefined,
    city: searchParams.get('city') || undefined,
    starRating: parseNumberArray(searchParams.get('starRating')),
    priceMin: searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined,
    priceMax: searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined,
    amenities: parseArray(searchParams.get('amenities')),
    checkIn: searchParams.get('checkIn') || undefined,
    checkOut: searchParams.get('checkOut') || undefined,
    guests: searchParams.get('guests') ? parseInt(searchParams.get('guests')!) : undefined,
    cuisineType: parseArray(searchParams.get('cuisineType')),
    priceRange: parseArray(searchParams.get('priceRange')),
    style: parseArray(searchParams.get('style')),
    openNow: searchParams.get('openNow') === 'true',
    locationType: parseArray(searchParams.get('locationType')),
    resortType: parseArray(searchParams.get('resortType')),
    destination: searchParams.get('destination') || undefined,
    duration: searchParams.get('duration') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    transportType: parseArray(searchParams.get('transportType')),
    departure: searchParams.get('departure') || undefined,
    arrival: searchParams.get('arrival') || undefined,
    company: parseArray(searchParams.get('company')),
    latitude: searchParams.get('latitude') ? parseFloat(searchParams.get('latitude')!) : undefined,
    longitude: searchParams.get('longitude') ? parseFloat(searchParams.get('longitude')!) : undefined,
    maxDistance: searchParams.get('maxDistance') ? parseFloat(searchParams.get('maxDistance')!) : undefined,
  };
}

function getSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Calculate distance using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ==================== SPOT SEARCH (F022) ====================

async function searchSpots(params: ReturnType<typeof parseSearchParams>) {
  await client.connect();
  const db = getDb();
  const collection = db.collection<TouristSpot>('spots');

  const { page, limit, sort, query, region, minRating, maxTicketPrice, latitude, longitude, maxDistance } = params;
  const hasGeoLocation = latitude && longitude;

  const mongoQuery: Record<string, unknown> = {};

  if (query) {
    mongoQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { location: { $regex: query, $options: 'i' } },
    ];
  }
  if (region) mongoQuery.region = region;
  if (params.spotType) mongoQuery.type = params.spotType;
  if (minRating) mongoQuery.rating = { $gte: minRating };
  if (maxTicketPrice) mongoQuery.ticketPrice = { $lte: maxTicketPrice };

  const sortOption: Record<string, 1 | -1> = {};
  if (sort === SortOption.RATING_DESC) sortOption.rating = -1;
  else if (sort === SortOption.RATING_ASC) sortOption.rating = 1;
  else if (sort === SortOption.NAME_ASC) sortOption.name = 1;
  else if (sort === SortOption.NAME_DESC) sortOption.name = -1;
  else sortOption.rating = -1;

  const total = await collection.countDocuments(mongoQuery);
  const spots = await collection
    .find(mongoQuery)
    .sort(sortOption)
    .skip(getSkip(page, limit))
    .limit(limit)
    .toArray();

  let results = spots.map((s: any) => ({
    ...s,
    id: s._id?.toString() || s.id,
    image: s.images?.[0],
  }));

  if (hasGeoLocation) {
    results = results
      .map((spot: any) => ({
        ...spot,
        distance: spot.latitude && spot.longitude
          ? calculateDistance(latitude!, longitude!, spot.latitude, spot.longitude)
          : null,
      }))
      .filter((spot: any) => spot.distance !== null && (!maxDistance || spot.distance <= maxDistance))
      .sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));
  }

  return { results, total };
}

// ==================== HOTEL SEARCH (F023-F027) ====================

async function searchHotels(params: ReturnType<typeof parseSearchParams>) {
  await client.connect();
  const db = getDb();
  const collection = db.collection<Hotel>('hotels');

  const { page, limit, sort, query, city, starRating, priceMin, priceMax, amenities } = params;

  const mongoQuery: Record<string, unknown> = { isActive: true };

  if (query) {
    mongoQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { address: { $regex: query, $options: 'i' } },
    ];
  }
  if (city) mongoQuery.city = { $regex: city, $options: 'i' };
  if (starRating && starRating.length > 0) mongoQuery.starRating = { $in: starRating };
  if (priceMin || priceMax) {
    mongoQuery.priceMin = {};
    if (priceMin) (mongoQuery.priceMin as Record<string, number>).$gte = priceMin;
    if (priceMax) (mongoQuery.priceMin as Record<string, number>).$lte = priceMax;
  }
  if (amenities && amenities.length > 0) {
    mongoQuery.amenities = { $all: amenities };
  }

  const sortOption: Record<string, 1 | -1> = {};
  if (sort === SortOption.PRICE_ASC) sortOption.priceMin = 1;
  else if (sort === SortOption.PRICE_DESC) sortOption.priceMin = -1;
  else if (sort === SortOption.RATING_DESC) sortOption.rating = -1;
  else if (sort === SortOption.NAME_ASC) sortOption.name = 1;
  else sortOption.rating = -1;

  const total = await collection.countDocuments(mongoQuery);
  const hotels = await collection
    .find(mongoQuery)
    .sort(sortOption)
    .skip(getSkip(page, limit))
    .limit(limit)
    .toArray();

  return {
    results: hotels.map(h => ({ ...h, id: h._id?.toString() || h.id, image: h.images?.[0] })),
    total,
  };
}

// ==================== RESTAURANT SEARCH (F028-F030) ====================

async function searchRestaurants(params: ReturnType<typeof parseSearchParams>) {
  await client.connect();
  const db = getDb();
  const collection = db.collection<Restaurant>('restaurants');

  const { page, limit, sort, query, city, cuisineType, priceRange, style } = params;

  const mongoQuery: Record<string, unknown> = { isActive: true };

  if (query) {
    mongoQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { address: { $regex: query, $options: 'i' } },
    ];
  }
  if (city) mongoQuery.city = { $regex: city, $options: 'i' };
  if (cuisineType && cuisineType.length > 0) mongoQuery.cuisineType = { $in: cuisineType };
  if (priceRange && priceRange.length > 0) mongoQuery.priceRange = { $in: priceRange };
  if (style && style.length > 0) mongoQuery.style = { $in: style };

  const sortOption: Record<string, 1 | -1> = {};
  if (sort === SortOption.RATING_DESC) sortOption.rating = -1;
  else if (sort === SortOption.NAME_ASC) sortOption.name = 1;
  else sortOption.rating = -1;

  const total = await collection.countDocuments(mongoQuery);
  const restaurants = await collection
    .find(mongoQuery)
    .sort(sortOption)
    .skip(getSkip(page, limit))
    .limit(limit)
    .toArray();

  return {
    results: restaurants.map(r => ({ ...r, id: r._id?.toString() || r.id, image: r.images?.[0] })),
    total,
  };
}

// ==================== RESORT SEARCH (F031-F033) ====================

async function searchResorts(params: ReturnType<typeof parseSearchParams>) {
  await client.connect();
  const db = getDb();
  const collection = db.collection<Resort>('resorts');

  const { page, limit, sort, query, locationType, starRating, priceMin, priceMax, resortType, amenities } = params;

  const mongoQuery: Record<string, unknown> = { isActive: true };

  if (query) {
    mongoQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { address: { $regex: query, $options: 'i' } },
    ];
  }
  if (locationType && locationType.length > 0) mongoQuery.location = { $in: locationType };
  if (starRating && starRating.length > 0) mongoQuery.starRating = { $in: starRating };
  if (priceMin || priceMax) {
    mongoQuery.priceMin = {};
    if (priceMin) (mongoQuery.priceMin as Record<string, number>).$gte = priceMin;
    if (priceMax) (mongoQuery.priceMin as Record<string, number>).$lte = priceMax;
  }
  if (resortType && resortType.length > 0) mongoQuery.resortType = { $in: resortType };
  if (amenities && amenities.length > 0) {
    mongoQuery.amenities = { $all: amenities };
  }

  const sortOption: Record<string, 1 | -1> = {};
  if (sort === SortOption.PRICE_ASC) sortOption.priceMin = 1;
  else if (sort === SortOption.PRICE_DESC) sortOption.priceMin = -1;
  else if (sort === SortOption.RATING_DESC) sortOption.rating = -1;
  else sortOption.rating = -1;

  const total = await collection.countDocuments(mongoQuery);
  const resorts = await collection
    .find(mongoQuery)
    .sort(sortOption)
    .skip(getSkip(page, limit))
    .limit(limit)
    .toArray();

  return {
    results: resorts.map(r => ({ ...r, id: r._id?.toString() || r.id, image: r.images?.[0] })),
    total,
  };
}

// ==================== TOUR SEARCH (F051-F055) ====================

async function searchTours(params: ReturnType<typeof parseSearchParams>) {
  await client.connect();
  const db = getDb();
  const collection = db.collection<TourPackage>('tours');

  const { page, limit, sort, query, priceMin, priceMax, destination, startDate, endDate, duration } = params;

  const mongoQuery: Record<string, unknown> = { isActive: true };

  if (query) {
    mongoQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
    ];
  }
  if (priceMin || priceMax) {
    mongoQuery.price = {};
    if (priceMin) (mongoQuery.price as Record<string, number>).$gte = priceMin;
    if (priceMax) (mongoQuery.price as Record<string, number>).$lte = priceMax;
  }
  if (duration) {
    mongoQuery.duration = duration;
  }
  if (destination) {
    mongoQuery.destinations = destination;
  }
  if (startDate) {
    mongoQuery.startDates = { $elemMatch: { $gte: startDate } };
  }

  const sortOption: Record<string, 1 | -1> = {};
  if (sort === SortOption.PRICE_ASC) sortOption.price = 1;
  else if (sort === SortOption.PRICE_DESC) sortOption.price = -1;
  else if (sort === SortOption.RATING_DESC) sortOption.rating = -1;
  else sortOption.rating = -1;

  const total = await collection.countDocuments(mongoQuery);
  const tours = await collection
    .find(mongoQuery)
    .sort(sortOption)
    .skip(getSkip(page, limit))
    .limit(limit)
    .toArray();

  return {
    results: tours.map(t => ({
      ...t,
      id: t._id?.toString() || t.id,
      image: t.images?.[0],
      discountedPrice: t.price,
    })),
    total,
  };
}

// ==================== TRANSPORT SEARCH (F056-F060) ====================

async function searchTransports(params: ReturnType<typeof parseSearchParams>) {
  await client.connect();
  const db = getDb();
  const collection = db.collection<Vehicle>('vehicles');

  const { page, limit, sort, query, transportType, departure, arrival, priceMin, priceMax, company } = params;

  const mongoQuery: Record<string, unknown> = { isActive: true };

  if (query) {
    mongoQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { route: { $regex: query, $options: 'i' } },
      { provider: { $regex: query, $options: 'i' } },
    ];
  }
  if (transportType && transportType.length > 0) {
    mongoQuery.type = { $in: transportType };
  }
  if (departure) {
    mongoQuery.departure = { $regex: departure, $options: 'i' };
  }
  if (arrival) {
    mongoQuery.arrival = { $regex: arrival, $options: 'i' };
  }
  if (priceMin || priceMax) {
    mongoQuery.price = {};
    if (priceMin) (mongoQuery.price as Record<string, number>).$gte = priceMin;
    if (priceMax) (mongoQuery.price as Record<string, number>).$lte = priceMax;
  }
  if (company && company.length > 0) {
    mongoQuery.provider = { $in: company };
  }

  const sortOption: Record<string, 1 | -1> = {};
  if (sort === SortOption.PRICE_ASC) sortOption.price = 1;
  else if (sort === SortOption.PRICE_DESC) sortOption.price = -1;
  else if (sort === SortOption.RATING_DESC) sortOption.rating = -1;
  else sortOption.price = 1;

  const total = await collection.countDocuments(mongoQuery);
  const transports = await collection
    .find(mongoQuery)
    .sort(sortOption)
    .skip(getSkip(page, limit))
    .limit(limit)
    .toArray();

  return {
    results: transports.map(t => ({
      ...t,
      id: t._id?.toString() || t.id,
    })),
    total,
  };
}

// ==================== RANKING ALGORITHM (F064) ====================

function calculateRelevanceScore(item: Record<string, unknown>, query: string): number {
  if (!query) return 0;
  const normalizedQuery = query.toLowerCase();
  let score = 0;
  if (String(item.name).toLowerCase() === normalizedQuery) score += 100;
  else if (String(item.name).toLowerCase().includes(normalizedQuery)) score += 50;
  if (String(item.description || '').toLowerCase().includes(normalizedQuery)) score += 20;
  if (String(item.location || item.address || '').toLowerCase().includes(normalizedQuery)) score += 30;
  return score;
}

function rankCombinedResults(results: any[], sortOption: SortOption, query?: string) {
  const scoredResults = results.map(item => {
    const relevanceScore = calculateRelevanceScore(item, query || '');
    const hasDiscount = Boolean(item.discount);
    const finalScore = Number(item.rating || 0) * 10 + relevanceScore + (hasDiscount ? 20 : 0);
    return { ...item, relevanceScore, finalScore };
  });

  switch (sortOption) {
    case SortOption.RATING_DESC:
      return scoredResults.sort((a: any, b: any) => Number(b.rating || 0) - Number(a.rating || 0));
    case SortOption.RATING_ASC:
      return scoredResults.sort((a: any, b: any) => Number(a.rating || 0) - Number(b.rating || 0));
    case SortOption.PRICE_ASC:
      return scoredResults.sort((a: any, b: any) => Number(a.price || a.priceMin || 0) - Number(b.price || b.priceMin || 0));
    case SortOption.PRICE_DESC:
      return scoredResults.sort((a: any, b: any) => Number(b.price || b.priceMin || 0) - Number(a.price || a.priceMin || 0));
    case SortOption.NAME_ASC:
      return scoredResults.sort((a: any, b: any) => String(a.name || '').localeCompare(String(b.name || '')));
    case SortOption.NAME_DESC:
      return scoredResults.sort((a: any, b: any) => String(b.name || '').localeCompare(String(a.name || '')));
    default:
      return scoredResults.sort((a: any, b: any) => b.finalScore - a.finalScore);
  }
}

// ==================== COMBO SEARCH (F067, F069) ====================

interface ComboSearchBody {
  totalBudget: number;
  tourParams?: { destination?: string; duration?: string; startDate?: string };
  hotelParams?: { city?: string; checkIn?: string; checkOut?: string; guests?: number };
}

async function searchCombo(body: ComboSearchBody) {
  await client.connect();
  const db = getDb();
  const toursCollection = db.collection<TourPackage>('tours');
  const hotelsCollection = db.collection<Hotel>('hotels');

  const { totalBudget, tourParams, hotelParams } = body;
  const maxTourPrice = totalBudget * 0.6;
  const maxHotelPrice = totalBudget * 0.4;

  const tourQuery: Record<string, unknown> = { isActive: true, price: { $lte: maxTourPrice } };
  if (tourParams?.destination) tourQuery.destinations = tourParams.destination;
  if (tourParams?.duration) tourQuery.duration = tourParams.duration;

  const hotelQuery: Record<string, unknown> = { isActive: true, priceMin: { $lte: maxHotelPrice } };
  if (hotelParams?.city) hotelQuery.city = { $regex: hotelParams.city, $options: 'i' };

  const [tours, hotels] = await Promise.all([
    toursCollection.find(tourQuery).sort({ rating: -1 }).limit(50).toArray(),
    hotelsCollection.find(hotelQuery).sort({ rating: -1 }).limit(50).toArray(),
  ]);

  const combinations = [];
  for (const tour of tours) {
    const remainingBudget = totalBudget - tour.price;
    for (const hotel of hotels) {
      if (hotel.priceRange && Number(hotel.priceRange) <= remainingBudget) {
        combinations.push({
          tour: { ...tour, id: tour._id?.toString() || tour.id },
          hotel: { ...hotel, id: hotel._id?.toString() || hotel.id },
          totalPrice: tour.price + Number(hotel.priceRange),
          savings: totalBudget - (tour.price + Number(hotel.priceRange)),
        });
      }
    }
  }

  return combinations.filter(c => c.totalPrice <= totalBudget).sort((a, b) => b.savings - a.savings).slice(0, 20);
}

// ==================== MAIN HANDLERS ====================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = parseSearchParams(searchParams);
    const { type, page, limit } = params;

    let searchResults;
    let results: Record<string, unknown>[] = [];
    let total = 0;

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
        const [spots, hotels, restaurants, resorts, tours, transports] = await Promise.all([
          searchSpots({ ...params, page: 1, limit: 50 }),
          searchHotels({ ...params, page: 1, limit: 50 }),
          searchRestaurants({ ...params, page: 1, limit: 50 }),
          searchResorts({ ...params, page: 1, limit: 50 }),
          searchTours({ ...params, page: 1, limit: 50 }),
          searchTransports({ ...params, page: 1, limit: 50 }),
        ]);

        results = [
          ...spots.results.map((r: Record<string, unknown>) => ({ ...r, searchType: SearchType.SPOT })),
          ...hotels.results.map((r: Record<string, unknown>) => ({ ...r, searchType: SearchType.HOTEL })),
          ...restaurants.results.map((r: Record<string, unknown>) => ({ ...r, searchType: SearchType.RESTAURANT })),
          ...resorts.results.map((r: Record<string, unknown>) => ({ ...r, searchType: SearchType.RESORT })),
          ...tours.results.map((r: Record<string, unknown>) => ({ ...r, searchType: SearchType.TOUR })),
          ...transports.results.map((r: Record<string, unknown>) => ({ ...r, searchType: SearchType.TRANSPORT })),
        ];
        total = spots.total + hotels.total + restaurants.total + resorts.total + tours.total + transports.total;

        results = rankCombinedResults(results, params.sort, params.query);

        if (params.priceMin || params.priceMax) {
          results = results.filter(item => {
            const price = Number(item.price || item.priceMin || 0);
            return (!params.priceMin || price >= params.priceMin) && (!params.priceMax || price <= params.priceMax);
          });
          total = results.length;
        }

        results = results.slice(getSkip(page, limit), getSkip(page, limit) + limit);
        break;
    }

    const totalPages = Math.ceil(total / limit);
    return NextResponse.json({
      data: results,
      pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: ComboSearchBody = await request.json();
    if (!body.totalBudget || body.totalBudget <= 0) {
      return NextResponse.json({ error: 'Invalid budget' }, { status: 400 });
    }

    const results = await searchCombo(body);
    return NextResponse.json({
      data: results,
      summary: {
        totalCombinations: results.length,
        averagePrice: results.length > 0 ? results.reduce((sum, r) => sum + r.totalPrice, 0) / results.length : 0,
        bestValue: results[0] || null,
      },
    });
  } catch (error) {
    console.error('Combo search error:', error);
    return NextResponse.json({ error: 'Combo search failed' }, { status: 500 });
  }
}
