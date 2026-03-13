// Tours Compare API
// F079 - Compare multiple tours

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const { tourIds } = await request.json();

    if (!tourIds || !Array.isArray(tourIds) || tourIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "Missing tour IDs" },
        { status: 400 }
      );
    }

    // Limit to 3 tours for comparison
    const limitedIds = tourIds.slice(0, 3);

    const db = await getDb();
    const toursCollection = db.collection("tours");

    // Fetch tours by IDs
    const tours = await toursCollection
      .find({
        _id: { $in: limitedIds.map((id: string) => new ObjectId(id)) },
        isActive: true,
      })
      .toArray();

    // Transform tours for comparison (without async operations in map)
    const transformedTours = tours.map((tour) => {
      // Get available dates (next 30 days with departures)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const availableDates: string[] = [];

      // Support both startDates (array) and startDate (single date)
      const datesToCheck = tour.startDates || (tour.startDate ? [tour.startDate] : []);

      if (Array.isArray(datesToCheck)) {
        datesToCheck.forEach((date: any) => {
          let dateStr: string;
          if (date instanceof Date) {
            dateStr = date.toISOString().split("T")[0];
          } else if (typeof date === "string") {
            dateStr = date.split("T")[0];
          } else {
            return;
          }

          const tourDate = new Date(dateStr);
          if (tourDate >= today) {
            availableDates.push(dateStr);
          }
        });
      }

      // Sort and limit to 60 days if empty
      availableDates.sort();
      if (availableDates.length === 0) {
        for (let i = 3; i < 60; i += 7) {
          const date = new Date(today);
          date.setDate(date.getDate() + i);
          availableDates.push(date.toISOString().split("T")[0]);
        }
      }

      return {
        id: tour._id.toString(),
        name: tour.name,
        description: tour.description,
        duration: tour.duration,
        durationDays: tour.durationDays || 3,
        destinations: tour.destinations || [],
        price: tour.price,
        discountPrice: tour.discountPrice,
        discountPercent: tour.discount,
        images: tour.images || [],
        rating: tour.rating || 0,
        reviewCount: tour.reviewCount || 0,
        bookingCount: tour.bookingCount || 0,
        groupSize: tour.groupSize || 30,
        itinerary: tour.itinerary || [],
        includes: tour.includes || [],
        isFeatured: tour.isFeatured || false,
        isNewArrival: tour.isNewArrival || false,
        isHotDeal: tour.isHotDeal || false,
        startDates: tour.startDates || (tour.startDate ? [tour.startDate] : []),
        availableDates,
        tourId: tour._id.toString(),
      };
    });

    // Get reviews for all tours in parallel
    const reviewsCollection = db.collection("reviews");
    const reviewsData = await Promise.all(
      transformedTours.map(async (tour) => {
        const reviewCount = await reviewsCollection.countDocuments({ tourId: tour.tourId });
        const reviews = await reviewsCollection
          .find({ tourId: tour.tourId })
          .sort({ createdAt: -1 })
          .limit(5)
          .toArray();
        return { tourId: tour.tourId, reviewCount, reviews };
      })
    );

    // Merge review data back into tours
    const toursWithReviews = transformedTours.map((tour) => {
      const reviewData = reviewsData.find((r) => r.tourId === tour.tourId);
      return {
        ...tour,
        reviewCount: reviewData?.reviewCount || 0,
        reviews: reviewData?.reviews || [],
      };
    });

    // Sort results to match input order
    const sortedTours = limitedIds.map((id: string) =>
      toursWithReviews.find((t) => t.id === id)
    ).filter(Boolean);

    return NextResponse.json({
      success: true,
      data: {
        tours: sortedTours,
      },
    });
  } catch (error) {
    console.error("Compare API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
