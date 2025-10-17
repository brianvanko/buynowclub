import { notFound } from 'next/navigation';
import ItemDetail from '@/components/ItemDetail';

async function getItem(id: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/items/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching item:', error);
    return null;
  }
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    notFound();
  }

  return <ItemDetail item={item} />;
}
