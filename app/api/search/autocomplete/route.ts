// Autocomplete API
// F040: Search suggestions when user types
// Uses MongoDB directly (same as admin)

import { NextRequest, NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { SearchType, AutocompleteSuggestion } from '@/types/search';
import type { TouristSpot, Hotel, Restaurant, Resort, TourPackage, Vehicle } from '@/types/search';

/**
 * Remove Vietnamese diacritics for normalized search
 */
function removeDiacritics(str: string): string {
  const diacriticsMap: Record<string, string> = {
    'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'đ': 'd',
  };
  return str.split('').map(char => diacriticsMap[char] || char).join('');
}

/**
 * Normalize location names for transport search
 */
function normalizeLocation(location: string): string {
  const locationMap: Record<string, string> = {
    'tp hcm': 'TP. Hồ Chí Minh',
    'ho chi minh': 'TP. Hồ Chí Minh',
    'hcm': 'TP. Hồ Chí Minh',
    'hn': 'Hà Nội',
    'ha noi': 'Hà Nội',
    'đn': 'Đà Nẵng',
    'da nang': 'Đà Nẵng',
    'nha trang': 'Nha Trang',
    'phu quoc': 'Phú Quốc',
    'vung tau': 'Vũng Tàu',
    'da lat': 'Đà Lạt',
  };
  const lower = location.toLowerCase().trim();
  return locationMap[lower] || location;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [], categories: [] });
    }

    await client.connect();
    const db = getDb();

    const suggestions: AutocompleteSuggestion[] = [];

    // Search spots
    const spotsCollection = db.collection<TouristSpot>('spots');
    const spots = await spotsCollection
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { location: { $regex: query, $options: 'i' } },
        ],
      })
      .limit(limit)
      .toArray();

    spots.forEach((spot: any) => {
      suggestions.push({
        id: spot._id?.toString() || spot.id,
        type: SearchType.SPOT,
        name: spot.name,
        subtext: `${spot.location} - ${spot.region}`,
        image: spot.images?.[0],
      });
    });

    // Search hotels
    const hotelsCollection = db.collection<Hotel>('hotels');
    const hotels = await hotelsCollection
      .find({
        isActive: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { city: { $regex: query, $options: 'i' } },
          { address: { $regex: query, $options: 'i' } },
        ],
      })
      .limit(limit)
      .toArray();

    hotels.forEach((hotel: any) => {
      suggestions.push({
        id: hotel._id?.toString() || hotel.id,
        type: SearchType.HOTEL,
        name: hotel.name,
        subtext: `${hotel.city} - ${hotel.starRating}★`,
        image: hotel.images?.[0],
      });
    });

    // Search restaurants
    const restaurantsCollection = db.collection<Restaurant>('restaurants');
    const restaurants = await restaurantsCollection
      .find({
        isActive: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { city: { $regex: query, $options: 'i' } },
          { cuisineType: { $regex: query, $options: 'i' } },
        ],
      })
      .limit(limit)
      .toArray();

    restaurants.forEach((restaurant: any) => {
      suggestions.push({
        id: restaurant._id?.toString() || restaurant.id,
        type: SearchType.RESTAURANT,
        name: restaurant.name,
        subtext: `${restaurant.cuisineType} - ${restaurant.city}`,
        image: restaurant.images?.[0],
      });
    });

    // Search resorts
    const resortsCollection = db.collection<Resort>('resorts');
    const resorts = await resortsCollection
      .find({
        isActive: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { address: { $regex: query, $options: 'i' } },
        ],
      })
      .limit(limit)
      .toArray();

    resorts.forEach((resort: any) => {
      suggestions.push({
        id: resort._id?.toString() || resort.id,
        type: SearchType.RESORT,
        name: resort.name,
        subtext: `${resort.address} - ${resort.starRating}★`,
        image: resort.images?.[0],
      });
    });

    // Search tours
    const toursCollection = db.collection<TourPackage>('tours');
    const tours = await toursCollection
      .find({
        isActive: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { destinations: { $in: [query] } },
        ],
      })
      .limit(limit)
      .toArray();

    tours.forEach((tour: any) => {
      suggestions.push({
        id: tour._id?.toString() || tour.id,
        type: SearchType.TOUR,
        name: tour.name,
        subtext: `${tour.destinations?.join(', ')} - ${tour.duration} ngày`,
        image: tour.images?.[0],
      });
    });

    // Search transports/vehicles
    const transportsCollection = db.collection<Vehicle>('vehicles');
    const transports = await transportsCollection
      .find({
        isActive: true,
        $or: [
          { departure: { $regex: query, $options: 'i' } },
          { arrival: { $regex: query, $options: 'i' } },
          { route: { $regex: query, $options: 'i' } },
          { provider: { $regex: query, $options: 'i' } },
        ],
      })
      .limit(limit)
      .toArray();

    transports.forEach((transport: any) => {
      suggestions.push({
        id: transport._id?.toString() || transport.id,
        type: SearchType.TRANSPORT,
        name: `${transport.departure} → ${transport.arrival}`,
        subtext: `${transport.type} - ${transport.provider} - ${transport.price?.toLocaleString()}đ`,
        image: undefined,
      });
    });

    // Build category counts
    const categories = [
      { type: SearchType.SPOT, count: spots.length },
      { type: SearchType.HOTEL, count: hotels.length },
      { type: SearchType.RESTAURANT, count: restaurants.length },
      { type: SearchType.RESORT, count: resorts.length },
      { type: SearchType.TOUR, count: tours.length },
      { type: SearchType.TRANSPORT, count: transports.length },
    ];

    // Sort by relevance (exact match first)
    const sortedSuggestions = suggestions.sort((a, b) => {
      const aExact = a.name.toLowerCase() === query.toLowerCase() ? 0 : 1;
      const bExact = b.name.toLowerCase() === query.toLowerCase() ? 0 : 1;
      return aExact - bExact;
    });

    return NextResponse.json({
      suggestions: sortedSuggestions.slice(0, limit * 6),
      categories,
    });
  } catch (error) {
    console.error('Autocomplete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
