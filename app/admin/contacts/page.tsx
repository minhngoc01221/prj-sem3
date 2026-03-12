import { Suspense } from 'react';
import { ContactsManagementContent } from '@/components/admin/contacts/ContactsManagementContent';
import ContactsLoading from './loading';
import type { Contact } from '@/types/admin';

export const dynamic = 'force-dynamic';

async function getContacts(): Promise<Contact[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/admin/contacts`, {
      cache: 'no-store',
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return [];
  }
}

export default async function AdminContactsPage() {
  const contacts = await getContacts();

  return (
    <Suspense fallback={<ContactsLoading />}>
      <ContactsManagementContent contacts={contacts} isLoading={false} />
    </Suspense>
  );
}
