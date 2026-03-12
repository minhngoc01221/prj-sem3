// Advanced Search API
// F041-F046: Combined criteria search, distance-based, date-specific

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  AdvancedSearchParams,
  SortOption,
  SearchType
} from '@/types/search';

const prisma = new PrismaClient();

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

/**
 * F041: Combined multi-criteria search
 * Searches across multiple entity types with combined filters
 */
export async function POST(request: NextRequest) {
  try {
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

    const results: any[] = [];
    let totalCount = 0;

    // F043: Filter by rating
    const ratingFilter = minRating ? { gte: minRating } : undefined;

    // F044: Filter by amenities
    const amenitiesFilter = amenities && amenities.length > 0 
      ? { hasEvery: amenities } 
      : undefined;

    // Search Tourist Spots
    if (spot || (!hotel && !restaurant && !resort)) {
      const spotWhere: any = {};
      
      if (spot?.query) {
        spotWhere.OR = [
          { name: { contains: spot.query, mode: 'insensitive' } },
          { description: { contains: spot.query, mode: 'insensitive' } },
          { location: { contains: spot.query, mode: 'insensitive' } },
        ];
      }
      if (spot?.region) spotWhere.region = spot.region;
      if (spot?.type) spotWhere.type = spot.type;
      if (ratingFilter) spotWhere.rating = ratingFilter;
      if (spot?.maxTicketPrice) spotWhere.ticketPrice = { lte: spot.maxTicketPrice };

      let spotResults = await prisma.touristSpot.findMany({
        where: spotWhere,
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
          region: true,
          type: true,
          images: true,
          ticketPrice: true,
          rating: true,
          latitude: true,
          longitude: true,
        }
      });

      // F042: Calculate distance from origin
      if (originLocation) {
        spotResults = spotResults
          .map(s => ({
            ...s,
            distance: s.latitude && s.longitude 
              ? calculateDistance(originLocation.latitude, originLocation.longitude, s.latitude, s.longitude)
              : null
          }))
          .filter(s => s.distance !== null && (!maxDistance || s.distance <= maxDistance))
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }

      const typedSpots = spotResults.map(s => ({ ...s, searchType: SearchType.SPOT }));
      results.push(...typedSpots);
      totalCount += spotResults.length;
    }

    // Search Hotels
    if (hotel || (!spot && !restaurant && !resort)) {
      const hotelWhere: any = {};
      
      if (hotel?.query) {
        hotelWhere.OR = [
          { name: { contains: hotel.query, mode: 'insensitive' } },
          { description: { contains: hotel.query, mode: 'insensitive' } },
        ];
      }
      if (hotel?.city) hotelWhere.city = { contains: hotel.city, mode: 'insensitive' };
      if (hotel?.starRating?.length) hotelWhere.starRating = { in: hotel.starRating };
      if (hotel?.priceRange) {
        hotelWhere.priceMin = {};
        if (hotel.priceRange.min) hotelWhere.priceMin.gte = hotel.priceRange.min;
        if (hotel.priceRange.max) hotelWhere.priceMin.lte = hotel.priceRange.max;
      }
      if (ratingFilter) hotelWhere.rating = ratingFilter;
      if (amenitiesFilter) hotelWhere.amenities = amenitiesFilter;

      // F045: Date-specific availability check
      if (dateRange && groupSize) {
        const hotels = await prisma.hotel.findMany({
          where: hotelWhere,
          include: {
            rooms: {
              where: { maxGuests: { gte: groupSize } }
            }
          }
        });

        const availableHotels = hotels
          .map(h => {
            const totalAvailable = h.rooms.reduce((sum, r) => sum + r.available, 0);
            return { ...h, totalAvailable };
          })
          .filter(h => h.totalAvailable > 0);

        const typedHotels = availableHotels.map(h => ({ 
          ...h, 
          searchType: SearchType.HOTEL,
          availableRooms: h.totalAvailable 
        }));
        results.push(...typedHotels);
        totalCount += typedHotels.length;
      } else {
        const hotelResults = await prisma.hotel.findMany({
          where: hotelWhere,
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
        });
        
        const typedHotels = hotelResults.map(h => ({ ...h, searchType: SearchType.HOTEL }));
        results.push(...typedHotels);
        totalCount += hotelResults.length;
      }
    }

    // Search Restaurants
    if (restaurant || (!spot && !hotel && !resort)) {
      const restaurantWhere: any = {};
      
      if (restaurant?.query) {
        restaurantWhere.OR = [
          { name: { contains: restaurant.query, mode: 'insensitive' } },
          { address: { contains: restaurant.query, mode: 'insensitive' } },
        ];
      }
      if (restaurant?.city) restaurantWhere.city = { contains: restaurant.city, mode: 'insensitive' };
      if (restaurant?.cuisineType?.length) restaurantWhere.cuisineType = { in: restaurant.cuisineType };
      if (restaurant?.priceRange?.length) restaurantWhere.priceRange = { in: restaurant.priceRange };
      if (restaurant?.style?.length) restaurantWhere.style = { in: restaurant.style };
      if (ratingFilter) restaurantWhere.rating = ratingFilter;

      const restaurantResults = await prisma.restaurant.findMany({
        where: restaurantWhere,
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
      });

      const typedRestaurants = restaurantResults.map(r => ({ ...r, searchType: SearchType.RESTAURANT }));
      results.push(...typedRestaurants);
      totalCount += restaurantResults.length;
    }

    // Search Resorts
    if (resort || (!spot && !hotel && !restaurant)) {
      const resortWhere: any = {};
      
      if (resort?.query) {
        resortWhere.OR = [
          { name: { contains: resort.query, mode: 'insensitive' } },
          { description: { contains: resort.query, mode: 'insensitive' } },
        ];
      }
      if (resort?.locationType?.length) resortWhere.locationType = { in: resort.locationType };
      if (resort?.starRating?.length) resortWhere.starRating = { in: resort.starRating };
      if (resort?.priceRange) {
        resortWhere.priceMin = {};
        if (resort.priceRange.min) resortWhere.priceMin.gte = resort.priceRange.min;
        if (resort.priceRange.max) resortWhere.priceMin.lte = resort.priceRange.max;
      }
      if (resort?.resortType?.length) resortWhere.resortType = { in: resort.resortType };
      if (ratingFilter) resortWhere.rating = ratingFilter;
      if (amenitiesFilter) resortWhere.amenities = amenitiesFilter;

      const resortResults = await prisma.resort.findMany({
        where: resortWhere,
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
      });

      const typedResorts = resortResults.map(r => ({ ...r, searchType: SearchType.RESORT }));
      results.push(...typedResorts);
      totalCount += resortResults.length;
    }

    // F036: Apply sorting
    switch (sort) {
      case SortOption.RATING_DESC:
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case SortOption.RATING_ASC:
        results.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case SortOption.PRICE_ASC:
        results.sort((a, b) => (a.priceMin || a.price || 0) - (b.priceMin || b.price || 0));
        break;
      case SortOption.PRICE_DESC:
        results.sort((a, b) => (b.priceMin || b.price || 0) - (a.priceMin || a.price || 0));
        break;
      case SortOption.NAME_ASC:
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortOption.NAME_DESC:
        results.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case SortOption.DISTANCE:
        if (originLocation) {
          results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
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
      }
    });

  } catch (error) {
    console.error('Advanced search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
