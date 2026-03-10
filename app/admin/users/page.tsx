import { Suspense } from 'react';
import { UsersManagementContent } from '@/components/admin/users/UsersManagementContent';
import UsersLoading from './loading';
import type { User } from '@/types/admin';

async function getUsers(): Promise<User[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/users`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <Suspense fallback={<UsersLoading />}>
      <UsersManagementContent users={users} isLoading={false} />
    </Suspense>
  );
}
