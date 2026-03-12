import { NextResponse } from 'next/server';
import client, { getDb } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    await client.connect();
    const db = getDb();
    const bookingsCollection = db.collection('bookings');

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (startDate || endDate) {
      query.bookingDate = {};
      if (startDate) {
        query.bookingDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.bookingDate.$lte = new Date(endDate);
      }
    }

    const bookings = await bookingsCollection.find(query).sort({ bookingDate: -1 }).toArray();

    // Create CSV data
    const headers = [
      'Mã đơn',
      'Tên khách hàng',
      'Email',
      'Số điện thoại',
      'Loại dịch vụ',
      'Tên dịch vụ',
      'Ngày đặt',
      'Ngày du lịch',
      'Số khách',
      'Tổng tiền',
      'Trạng thanh toán',
      'Trạng thái đơn',
      'Ghi chú'
    ];

    const rows = bookings.map((b: any) => [
      b.id || b._id?.toString(),
      b.userName || '',
      b.userEmail || '',
      b.userPhone || '',
      b.type || '',
      b.itemName || '',
      b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('vi-VN') : '',
      b.travelDate ? new Date(b.travelDate).toLocaleDateString('vi-VN') : '',
      b.guests || '',
      b.totalPrice || 0,
      b.paymentStatus || '',
      b.status || '',
      b.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const BOM = '\uFEFF';
    
    return new NextResponse(BOM + csvContent, {
      headers: {
        'Content-Type': 'text/csv;charset=utf-8;',
        'Content-Disposition': `attachment; filename="danh-sach-don-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting bookings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to export bookings' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
