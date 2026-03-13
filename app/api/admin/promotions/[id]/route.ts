import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = getDb();
    const promotionsCollection = db.collection('promotions');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid promotion ID' },
        { status: 400 }
      );
    }

    const promotion = await promotionsCollection.findOne({ _id: new ObjectId(id) });

    if (!promotion) {
      return NextResponse.json(
        { success: false, message: 'Promotion not found' },
        { status: 404 }
      );
    }

    // Calculate current status based on dates (F210)
    const now = new Date();
    const endDate = new Date(promotion.endDate);
    const startDate = new Date(promotion.startDate);
    let displayStatus = promotion.status;

    if (now > endDate) {
      displayStatus = 'expired';
    } else if (now < startDate) {
      displayStatus = 'scheduled';
    }

    return NextResponse.json({
      success: true,
      data: {
        ...promotion,
        id: promotion._id?.toString(),
        status: displayStatus,
        createdAt: promotion.createdAt?.toISOString(),
        startDate: promotion.startDate?.toISOString(),
        endDate: promotion.endDate?.toISOString(),
        updatedAt: promotion.updatedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching promotion:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch promotion' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = getDb();
    const promotionsCollection = db.collection('promotions');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid promotion ID' },
        { status: 400 }
      );
    }

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
      status,
      isShowHome,
    } = body;

    // Validation: discount percent (0-100)
    if (discountPercent !== undefined && (discountPercent < 0 || discountPercent > 100)) {
      return NextResponse.json(
        { success: false, message: 'Discount percent must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Validation: start date must be before end date
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return NextResponse.json(
        { success: false, message: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    // Validation: unique promoCode (excluding current promotion)
    if (promoCode) {
      const existing = await promotionsCollection.findOne({
        promoCode: promoCode.toUpperCase(),
        _id: { $ne: new ObjectId(id) }
      });
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'Promo code already exists' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (promoCode !== undefined) updateData.promoCode = promoCode.toUpperCase();
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (discountPercent !== undefined) updateData.discountPercent = discountPercent;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = new Date(endDate);
    if (targetType !== undefined) updateData.targetType = targetType;
    if (targetId !== undefined) updateData.targetId = targetId;
    if (status !== undefined) updateData.status = status;
    if (isShowHome !== undefined) updateData.isShowHome = isShowHome;

    const result = await promotionsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Promotion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Promotion updated successfully',
      data: {
        ...result,
        id: result._id?.toString(),
      },
    });
  } catch (error) {
    console.error('Error updating promotion:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update promotion' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await client.connect();
    const db = getDb();
    const promotionsCollection = db.collection('promotions');

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid promotion ID' },
        { status: 400 }
      );
    }

    const result = await promotionsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Promotion not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Promotion deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting promotion:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete promotion' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
