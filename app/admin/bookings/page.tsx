import { Suspense } from 'react';
import { BookingsManagementContent } from '@/components/features/admin/bookings/BookingsManagementContent';
import BookingsLoading from './loading';
import type { Booking } from '@/types/admin';

async function getBookings(): Promise<Booking[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/bookings`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
}

export default async function AdminBookingsPage() {
  const bookings = await getBookings();

  return (
    <Suspense fallback={<BookingsLoading />}>
      <BookingsManagementContent bookings={bookings} isLoading={false} />
    </Suspense>
  );
}
