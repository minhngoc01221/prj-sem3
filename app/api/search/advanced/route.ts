// Advanced Search API
// F041-F046: Combined criteria search, distance-based, date-specific
// Uses MongoDB directly

import { NextRequest, NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import {
  AdvancedSearchParams,
  SortOption,
  SearchType,
} from '@/types/search';
import type { TouristSpot, Hotel, Restaurant, Resort } from '@/types/search';

/**
 * Calculate distance using Haversine formula
 * F042: Distance-based search from a given coordinate
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * F041: Combined multi-criteria search
 * Searches across multiple entity types with combined filters
 */
export async function POST(request: NextRequest) {
  try {
    await client.connect();
    const db = getDb();

    const body: AdvancedSearchParams = await request.json();

    const {
      spot,
      hotel,
      restaurant,
      resort,
      originLocation,
      maxDistance,
      minRating,
      amenities,
      dateRange,
      groupSize,
      page = 1,
      limit = 12,
      sort = SortOption.RATING_DESC,
    } = body;

    const results: Record<string, unknown>[] = [];
    let totalCount = 0;

    // Search Tourist Spots
    if (spot || (!hotel && !restaurant && !resort)) {
      const spotQuery: Record<string, unknown> = {};

      if (spot?.query) {
        spotQuery.$or = [
          { name: { $regex: spot.query, $options: 'i' } },
          { description: { $regex: spot.query, $options: 'i' } },
          { location: { $regex: spot.query, $options: 'i' } },
        ];
      }
      if (spot?.region) spotQuery.region = spot.region;
      if (spot?.type) spotQuery.type = spot.type;
      if (minRating) spotQuery.rating = { $gte: minRating };
      if (spot?.maxTicketPrice) spotQuery.ticketPrice = { $lte: spot.maxTicketPrice };

      const spotsCollection = db.collection<TouristSpot>('spots');
      let spotResults = await spotsCollection.find(spotQuery).toArray();

      // F042: Calculate distance from origin
      if (originLocation) {
        spotResults = spotResults
          .map((s: any) => ({
            ...s,
            distance: s.latitude && s.longitude
              ? calculateDistance(originLocation.latitude, originLocation.longitude, s.latitude, s.longitude)
              : null,
          }))
          .filter((s: any) => s.distance !== null && (!maxDistance || s.distance <= maxDistance))
          .sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));
      }

      const typedSpots = spotResults.map(s => ({
        ...s,
        id: s._id?.toString() || s.id,
        image: s.images?.[0],
        searchType: SearchType.SPOT,
      }));
      results.push(...typedSpots);
      totalCount += spotResults.length;
    }

    // Search Hotels
    if (hotel || (!spot && !restaurant && !resort)) {
      const hotelQuery: Record<string, unknown> = { isActive: true };

      if (hotel?.query) {
        hotelQuery.$or = [
          { name: { $regex: hotel.query, $options: 'i' } },
          { description: { $regex: hotel.query, $options: 'i' } },
        ];
      }
      if (hotel?.city) hotelQuery.city = { $regex: hotel.city, $options: 'i' };
      if (hotel?.starRating?.length) hotelQuery.starRating = { $in: hotel.starRating };
      if (hotel?.priceRange) {
        hotelQuery.priceMin = {};
        if (hotel.priceRange.min) (hotelQuery.priceMin as Record<string, number>).$gte = hotel.priceRange.min;
        if (hotel.priceRange.max) (hotelQuery.priceMin as Record<string, number>).$lte = hotel.priceRange.max;
      }
      if (minRating) hotelQuery.rating = { $gte: minRating };
      if (amenities && amenities.length > 0) hotelQuery.amenities = { $all: amenities };

      const hotelsCollection = db.collection<Hotel>('hotels');
      const hotelResults = await hotelsCollection.find(hotelQuery).toArray();

      const typedHotels = hotelResults.map(h => ({
        ...h,
        id: h._id?.toString() || h.id,
        image: h.images?.[0],
        searchType: SearchType.HOTEL,
      }));
      results.push(...typedHotels);
      totalCount += hotelResults.length;
    }

    // Search Restaurants
    if (restaurant || (!spot && !hotel && !resort)) {
      const restaurantQuery: Record<string, unknown> = { isActive: true };

      if (restaurant?.query) {
        restaurantQuery.$or = [
          { name: { $regex: restaurant.query, $options: 'i' } },
          { address: { $regex: restaurant.query, $options: 'i' } },
        ];
      }
      if (restaurant?.city) restaurantQuery.city = { $regex: restaurant.city, $options: 'i' };
      if (restaurant?.cuisineType?.length) restaurantQuery.cuisineType = { $in: restaurant.cuisineType };
      if (restaurant?.priceRange?.length) restaurantQuery.priceRange = { $in: restaurant.priceRange };
      if (restaurant?.style?.length) restaurantQuery.style = { $in: restaurant.style };
      if (minRating) restaurantQuery.rating = { $gte: minRating };

      const restaurantsCollection = db.collection<Restaurant>('restaurants');
      const restaurantResults = await restaurantsCollection.find(restaurantQuery).toArray();

      const typedRestaurants = restaurantResults.map(r => ({
        ...r,
        id: r._id?.toString() || r.id,
        image: r.images?.[0],
        searchType: SearchType.RESTAURANT,
      }));
      results.push(...typedRestaurants);
      totalCount += restaurantResults.length;
    }

    // Search Resorts
    if (resort || (!spot && !hotel && !restaurant)) {
      const resortQuery: Record<string, unknown> = { isActive: true };

      if (resort?.query) {
        resortQuery.$or = [
          { name: { $regex: resort.query, $options: 'i' } },
          { description: { $regex: resort.query, $options: 'i' } },
        ];
      }
      if (resort?.locationType?.length) resortQuery.location = { $in: resort.locationType };
      if (resort?.starRating?.length) resortQuery.starRating = { $in: resort.starRating };
      if (resort?.priceRange) {
        resortQuery.priceMin = {};
        if (resort.priceRange.min) (resortQuery.priceMin as Record<string, number>).$gte = resort.priceRange.min;
        if (resort.priceRange.max) (resortQuery.priceMin as Record<string, number>).$lte = resort.priceRange.max;
      }
      if (resort?.resortType?.length) resortQuery.resortType = { $in: resort.resortType };
      if (minRating) resortQuery.rating = { $gte: minRating };
      if (amenities && amenities.length > 0) resortQuery.amenities = { $all: amenities };

      const resortsCollection = db.collection<Resort>('resorts');
      const resortResults = await resortsCollection.find(resortQuery).toArray();

      const typedResorts = resortResults.map(r => ({
        ...r,
        id: r._id?.toString() || r.id,
        image: r.images?.[0],
        searchType: SearchType.RESORT,
      }));
      results.push(...typedResorts);
      totalCount += resortResults.length;
    }

    // F036: Apply sorting
    switch (sort) {
      case SortOption.RATING_DESC:
        results.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
        break;
      case SortOption.RATING_ASC:
        results.sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0));
        break;
      case SortOption.PRICE_ASC:
        results.sort((a, b) => Number(a.priceMin || a.price || 0) - Number(b.priceMin || b.price || 0));
        break;
      case SortOption.PRICE_DESC:
        results.sort((a, b) => Number(b.priceMin || b.price || 0) - Number(a.priceMin || a.price || 0));
        break;
      case SortOption.NAME_ASC:
        results.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
        break;
      case SortOption.NAME_DESC:
        results.sort((a, b) => String(b.name || '').localeCompare(String(a.name || '')));
        break;
      case SortOption.DISTANCE:
        if (originLocation) {
          results.sort((a, b) => Number(a.distance || 0) - Number(b.distance || 0));
        }
        break;
    }

    // F037: Apply pagination
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: paginatedResults,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        originLocation,
        maxDistance,
        minRating,
        amenities,
        dateRange,
        groupSize,
      },
    });
  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
