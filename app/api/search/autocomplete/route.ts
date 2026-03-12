// Autocomplete API
// F040: Search suggestions when user types

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { SearchType, AutocompleteSuggestion } from '@/types/search';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [], categories: [] });
    }

    const suggestions: AutocompleteSuggestion[] = [];

    // Search spots
    const spots = await prisma.touristSpot.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      take: limit,
      select: {
        id: true,
        name: true,
        location: true,
        region: true,
        images: true,
      }
    });

    spots.forEach(spot => {
      suggestions.push({
        id: spot.id,
        type: SearchType.SPOT,
        name: spot.name,
        subtext: `${spot.location} - ${spot.region}`,
        image: spot.images?.[0],
      });
    });

    // Search hotels
    const hotels = await prisma.hotel.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      take: limit,
      select: {
        id: true,
        name: true,
        city: true,
        starRating: true,
        images: true,
      }
    });

    hotels.forEach(hotel => {
      suggestions.push({
        id: hotel.id,
        type: SearchType.HOTEL,
        name: hotel.name,
        subtext: `${hotel.city} - ${hotel.starRating}★`,
        image: hotel.images?.[0],
      });
    });

    // Search restaurants
    const restaurants = await prisma.restaurant.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      take: limit,
      select: {
        id: true,
        name: true,
        city: true,
        cuisineType: true,
        images: true,
      }
    });

    restaurants.forEach(restaurant => {
      suggestions.push({
        id: restaurant.id,
        type: SearchType.RESTAURANT,
        name: restaurant.name,
        subtext: `${restaurant.cuisineType} - ${restaurant.city}`,
        image: restaurant.images?.[0],
      });
    });

    // Search resorts
    const resorts = await prisma.resort.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      take: limit,
      select: {
        id: true,
        name: true,
        address: true,
        starRating: true,
        images: true,
      }
    });

    resorts.forEach(resort => {
      suggestions.push({
        id: resort.id,
        type: SearchType.RESORT,
        name: resort.name,
        subtext: `${resort.address} - ${resort.starRating}★`,
        image: resort.images?.[0],
      });
    });

    // Build category counts
    const categories = [
      { type: SearchType.SPOT, count: spots.length },
      { type: SearchType.HOTEL, count: hotels.length },
      { type: SearchType.RESTAURANT, count: restaurants.length },
      { type: SearchType.RESORT, count: resorts.length },
    ];

    return NextResponse.json({
      suggestions: suggestions.slice(0, limit * 4),
      categories,
    });

  } catch (error) {
    console.error('Autocomplete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
