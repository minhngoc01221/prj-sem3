import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    await client.connect();
    const db = getDb();
    const promotionsCollection = db.collection('promotions');

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { promoCode: { $regex: search, $options: 'i' } },
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    const total = await promotionsCollection.countDocuments(query);
    const promotions = await promotionsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    // Auto-update expired promotions (F210)
    const now = new Date();
    const expiredPromotions = promotions.filter(
      (p: any) => new Date(p.endDate) < now && p.status === 'active'
    );

    if (expiredPromotions.length > 0) {
      for (const promo of expiredPromotions) {
        await promotionsCollection.updateOne(
          { _id: promo._id },
          { $set: { status: 'expired' } }
        );
      }
    }

    const promotionsWithStatus = promotions.map((p: any) => {
      const endDate = new Date(p.endDate);
      const startDate = new Date(p.startDate);
      let displayStatus = p.status;

      if (now > endDate) {
        displayStatus = 'expired';
      } else if (now < startDate) {
        displayStatus = 'scheduled';
      }

      return {
        ...p,
        id: p._id?.toString() || p.id,
        status: displayStatus,
        createdAt: p.createdAt?.toISOString(),
        startDate: p.startDate?.toISOString(),
        endDate: p.endDate?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: promotionsWithStatus,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching promotions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch promotions', data: [] },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  try {
    await client.connect();
    const db = getDb();
    const promotionsCollection = db.collection('promotions');

    const body = await request.json();

    const {
      promoCode,
      name,
      description,
      discountPercent,
      startDate,
      endDate,
      targetType,
      targetId,
      isShowHome,
    } = body;

    // Validation: discount percent (0-100)
    if (discountPercent === undefined || discountPercent < 0 || discountPercent > 100) {
      return NextResponse.json(
        { success: false, message: 'Discount percent must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Validation: start date must be before end date
    if (new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { success: false, message: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    // Validation: unique promoCode
    if (promoCode) {
      const existing = await promotionsCollection.findOne({ promoCode: promoCode.toUpperCase() });
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Promo code already exists' },
          { status: 400 }
        );
      }
    }

    const promotion = {
      promoCode: promoCode?.toUpperCase() || null,
      name,
      description: description || '',
      discountPercent,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      targetType: targetType || null,
      targetId: targetId || null,
      status: 'active',
      isShowHome: isShowHome || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await promotionsCollection.insertOne(promotion);

    return NextResponse.json(
      {
        success: true,
        message: 'Promotion created successfully',
        data: { ...promotion, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating promotion:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create promotion' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
