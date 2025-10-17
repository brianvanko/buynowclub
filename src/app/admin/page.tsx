import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/adminAuth';
import AdminDashboard from '@/components/AdminDashboard';

async function getAllItems() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/items`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

export default async function AdminDashboardPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect('/auth/login');
  }

  const items = await getAllItems();

  return <AdminDashboard items={items} />;
}
