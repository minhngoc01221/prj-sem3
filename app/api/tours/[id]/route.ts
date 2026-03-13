// Tour Detail Public API
// F073-F078 - Get tour detail for frontend

import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const db = await getDb();
    const toursCollection = db.collection("tours");
    const reviewsCollection = db.collection("reviews");

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid tour ID" },
        { status: 400 }
      );
    }

    // Fetch tour
    const tour = await toursCollection.findOne({
      _id: new ObjectId(id),
      isActive: true,
    });

    if (!tour) {
      return NextResponse.json(
        { success: false, error: "Tour not found" },
        { status: 404 }
      );
    }

    // Fetch reviews for this tour
    const reviews = await reviewsCollection
      .find({ tourId: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Calculate review stats
    const reviewStats = {
      averageRating: tour.rating || 0,
      totalReviews: tour.reviewCount || 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
      verifiedReviews: reviews.filter((r: any) => r.isVerified).length,
    };

    // Count rating distribution from reviews
    reviews.forEach((review: any) => {
      const rating = Math.round(review.rating);
      if (rating >= 1 && rating <= 5) {
        reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]++;
      }
    });

    // Fetch related tours (same destinations)
    const tourDestinations = tour.destinations && Array.isArray(tour.destinations) ? tour.destinations : [];

    let relatedTours: any[] = [];
    if (tourDestinations.length > 0) {
      relatedTours = await toursCollection
        .find({
          _id: { $ne: new ObjectId(id) },
          isActive: true,
          destinations: { $in: tourDestinations },
        })
        .limit(4)
        .project({
          name: 1,
          duration: 1,
          destinations: 1,
          price: 1,
          discountPrice: 1,
          discount: 1,
          images: 1,
          rating: 1,
          reviewCount: 1,
          bookingCount: 1,
          startDates: 1,
          createdAt: 1,
        })
        .toArray();
    }

    // Transform related tours
    const transformedRelatedTours = relatedTours.map((t: any) => ({
      id: t._id.toString(),
      name: t.name,
      duration: t.duration,
      destinations: t.destinations,
      price: t.price,
      discountPrice: t.discountPrice,
      discountPercent: t.discount,
      images: t.images || [],
      rating: t.rating || 0,
      reviewCount: t.reviewCount || 0,
      bookingCount: t.bookingCount || 0,
      startDates: t.startDates || [],
      createdAt: t.createdAt,
    }));

    // Transform reviews
    const transformedReviews = reviews.map((review: any) => ({
      id: review._id.toString(),
      userId: review.userId?.toString() || "",
      userName: review.userName || "Khách hàng",
      userAvatar: review.userAvatar,
      rating: review.rating || 0,
      title: review.title || "",
      content: review.content || "",
      travelDate: review.travelDate || "",
      createdAt: review.createdAt,
      helpful: review.helpful || 0,
      isVerified: review.isVerified || false,
    }));

    // Get available dates (all future start dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const availableDates: string[] = [];

    // Support both startDates (array) and startDate (single date from admin)
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

    // Sort available dates
    availableDates.sort();

    // If no available dates, generate some default dates for the next 60 days
    if (availableDates.length === 0) {
      for (let i = 3; i < 60; i += 7) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        availableDates.push(date.toISOString().split("T")[0]);
      }
    }

    // Transform tour data for frontend
    const transformedTour = {
      id: tour._id.toString(),
      name: tour.name,
      description: tour.description,
      fullDescription: tour.fullDescription || tour.description,
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
      startDates: tour.startDates || (tour.startDate ? [tour.startDate] : []),
      isFeatured: tour.isFeatured || false,
      isNewArrival: new Date(tour.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      isHotDeal: !!tour.discount && tour.discount > 0,
      isDiscounted: !!tour.discount && tour.discount > 0,
      groupSize: tour.groupSize || 45,
      minAge: tour.minAge || 0,
      itinerary: tour.itinerary || [],
      includes: tour.includes || [],
      excludes: tour.excludes || [],
      highlights: tour.highlights || [],
      pickupLocation: tour.pickupLocation || "",
      dropoffLocation: tour.dropoffLocation || "",
      termsAndConditions: tour.termsAndConditions || "",
      cancellationPolicy: tour.cancellationPolicy || "",
      reviewStats,
      reviews: transformedReviews,
      relatedTours: transformedRelatedTours,
      availableDates,
      createdAt: tour.createdAt,
    };

    return NextResponse.json({
      success: true,
      data: transformedTour,
    });
  } catch (error) {
    console.error("Error fetching tour detail:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tour detail" },
      { status: 500 }
    );
  }
}
