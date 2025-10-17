'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

async function getItem(id: string) {
  try {
    const res = await fetch(`/api/items/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    return null;
  }
}

export default function DeleteItemPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [itemId, setItemId] = useState<string>('');
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    async function loadItem() {
      const resolvedParams = await params;
      setItemId(resolvedParams.id);
      const itemData = await getItem(resolvedParams.id);
      setItem(itemData);
    }

    loadItem();
  }, [params]);

  const handleDelete = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to delete item');
      } else {
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold uppercase tracking-tight">Delete Item</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white border border-gray-200 p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <div className="bg-red-50 border border-red-200 p-4 mb-6">
            <p className="text-red-800 font-medium">
              ⚠️ Are you sure you want to delete this item? This action cannot be undone.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              {item.thumb && (
                <img
                  src={item.thumb}
                  alt={item.name}
                  className="w-32 h-32 object-cover border border-gray-200"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
                <p className="text-gray-600 text-sm mb-1">ID: {item._id}</p>
                {item.price && <p className="text-gray-600 text-sm mb-1">Price: {item.price}</p>}
                {item.categories && (
                  <p className="text-gray-600 text-sm">Category: {item.categories}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-4 font-medium tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50 uppercase text-sm"
            >
              {loading ? 'Deleting...' : 'Yes, Delete Item'}
            </button>
            <Link
              href="/admin"
              className="flex-1 bg-gray-200 text-black py-4 font-medium tracking-wider hover:bg-gray-300 transition-colors uppercase text-sm text-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
