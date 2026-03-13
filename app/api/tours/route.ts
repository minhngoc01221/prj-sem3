// Tours Public API
// F068-F083 - Get tours for frontend

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Query parameters
    const search = searchParams.get("search");
    const destinations = searchParams.get("destinations")?.split(",").filter(Boolean);
    const duration = searchParams.get("duration");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const startDate = searchParams.get("startDate");
    const sort = searchParams.get("sort") || "popular";
    const filter = searchParams.get("filter");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const days = parseInt(searchParams.get("days") || "30");

    const db = await getDb();
    const toursCollection = db.collection("tours");

    // Build query
    const query: any = {
      isActive: true,
    };

    // Search by name or destination (F080)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { destinations: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by destinations (F069)
    if (destinations && destinations.length > 0) {
      query.destinations = { $in: destinations };
    }

    // Filter by duration (F070)
    if (duration) {
      const durationMap: Record<string, { min: number; max: number }> = {
        '2n1d': { min: 2, max: 2 },
        '3n2d': { min: 3, max: 3 },
        '4n3d': { min: 4, max: 4 },
        '5n4d': { min: 5, max: 5 },
        '6n5d+': { min: 6, max: 999 },
      };
      
      const durationFilter = durationMap[duration];
      if (durationFilter) {
        query.durationDays = { $gte: durationFilter.min, $lte: durationFilter.max };
      }
    }

    // Filter by price range (F071)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Filter by start date (F072)
    if (startDate) {
      query.startDates = { $in: [startDate] };
    }

    // Special filters (F081, F082, F083)
    if (filter === 'featured') {
      query.isFeatured = true;
    } else if (filter === 'new') {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      query.createdAt = { $gte: cutoffDate.toISOString() };
    } else if (filter === 'hot-deals' || filter === 'discounted') {
      query.discount = { $gt: 0 };
    }

    // Get total count
    const totalTours = await toursCollection.countDocuments(query);

    // Build sort
    let sortOptions: any = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      case 'popular':
      default:
        sortOptions = { bookingCount: -1 };
        break;
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch tours
    const tours = await toursCollection
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .project({
        name: 1,
        description: 1,
        duration: 1,
        destinations: 1,
        price: 1,
        discount: 1,
        discountPrice: 1,
        images: 1,
        rating: 1,
        reviewCount: 1,
        bookingCount: 1,
        startDates: 1,
        isFeatured: 1,
        groupSize: 1,
        createdAt: 1,
      })
      .toArray();

    // Transform data for frontend
    const transformedTours = tours.map(tour => ({
      id: tour._id.toString(),
      name: tour.name,
      description: tour.description,
      duration: tour.duration,
      destinations: tour.destinations,
      price: tour.price,
      discountPrice: tour.discountPrice,
      discountPercent: tour.discount,
      images: tour.images || [],
      rating: tour.rating || 0,
      reviewCount: tour.reviewCount || 0,
      bookingCount: tour.bookingCount || 0,
      startDates: tour.startDates || [],
      isFeatured: tour.isFeatured || false,
      isNewArrival: new Date(tour.createdAt) > new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      isHotDeal: !!tour.discount && tour.discount > 0,
      isDiscounted: !!tour.discount && tour.discount > 0,
      groupSize: tour.groupSize,
      createdAt: tour.createdAt,
    }));

    const totalPages = Math.ceil(totalTours / limit);

    return NextResponse.json({
      success: true,
      data: {
        tours: transformedTours,
        total: transformedTours.length,
        totalTours,
        page,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching tours:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}
