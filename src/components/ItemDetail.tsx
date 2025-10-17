'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface ItemDetailProps {
  item: any;
}

export default function ItemDetail({ item }: ItemDetailProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      // Check if item is in favorites
      fetch('/api/favorites')
        .then((res) => res.json())
        .then((data) => {
          if (data.favorites) {
            setIsFavorite(data.favorites.includes(item._id));
          }
        })
        .catch(() => setIsFavorite(false));
    }
  }, [session, item._id]);

  const toggleFavorite = async () => {
    if (!session) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item._id }),
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-black inline-flex items-center text-sm tracking-wider"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            BACK
          </button>
          <Link
            href="/items"
            className="text-gray-600 hover:text-black inline-flex items-center text-sm tracking-wider"
          >
            ALL ITEMS
          </Link>
        </div>

        <div className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            {item.lg_img && (
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={item.lg_img}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                {/* Favorite button on image */}
                <button
                  onClick={toggleFavorite}
                  disabled={loading}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all disabled:opacity-50"
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg
                    className="w-6 h-6"
                    fill={isFavorite ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Content */}
            <div className="py-4">
              {/* Categories */}
              <div className="flex gap-2 mb-6">
                {item.categories && (
                  <span className="bg-black text-white text-xs px-3 py-1 tracking-wider font-medium">
                    {item.categories}
                  </span>
                )}
                {item.subcategory && (
                  <span className="bg-gray-200 text-gray-800 text-xs px-3 py-1 tracking-wider font-medium">
                    {item.subcategory}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold mb-6 uppercase tracking-tight text-black leading-tight">
                {item.name}
              </h1>

              {/* Price */}
              {item.price && (
                <p className="text-4xl font-bold mb-8 text-black">
                  {item.price}
                </p>
              )}

              {/* Description */}
              {item.description && (
                <p className="text-gray-800 leading-relaxed mb-8 text-base">
                  {item.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-black text-white px-8 py-4 font-medium tracking-wider hover:bg-gray-800 transition-colors text-sm"
                  >
                    BUY NOW
                  </a>
                )}
                <button
                  onClick={toggleFavorite}
                  disabled={loading}
                  className={`inline-block px-8 py-4 font-medium tracking-wider transition-colors text-sm ${
                    isFavorite
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  } disabled:opacity-50`}
                >
                  {loading ? '...' : isFavorite ? '♥ SAVED' : '♡ SAVE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
