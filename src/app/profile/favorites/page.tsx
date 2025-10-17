import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Item from '@/models/Item';
import Link from 'next/link';

async function getFavorites() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return [];
    }

    await connectDB();
    const user = await User.findById(session.user.id).populate('favorites');

    return user?.favorites || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  const favorites = await getFavorites();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold uppercase tracking-tight">My Favorites</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-gray-700 mb-4">You haven't saved any items yet</p>
            <Link
              href="/items"
              className="inline-block bg-black text-white px-8 py-3 font-medium tracking-wider hover:bg-gray-800 transition-colors"
            >
              Browse Items
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item: any) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <Link href={`/items/${item._id}`} className="relative aspect-square overflow-hidden block">
                  {item.thumb && (
                    <img
                      src={item.thumb}
                      alt={item.name}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                  )}
                  {/* Category badge */}
                  {item.categories && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-black/80 text-white text-xs px-3 py-1 tracking-wider font-medium">
                        {item.categories}
                      </span>
                    </div>
                  )}
                </Link>

                {/* Content */}
                <div className="p-6">
                  {/* Partner label */}
                  {item.categories && (
                    <p className="text-xs text-gray-700 tracking-widest uppercase mb-2">
                      PARTNER / {item.categories}
                    </p>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold mb-3 uppercase tracking-tight text-black leading-tight">
                    {item.name}
                  </h2>

                  {/* Description */}
                  {item.description && (
                    <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {/* Price */}
                  {item.price && (
                    <p className="text-lg font-bold mb-4 text-black">
                      {item.price}
                    </p>
                  )}

                  {/* CTAs */}
                  <div className="flex gap-3 text-sm">
                    <Link
                      href={`/items/${item._id}`}
                      className="text-gray-600 hover:text-black underline decoration-2 underline-offset-4 font-medium"
                    >
                      View Details
                    </Link>
                    {item.link && (
                      <>
                        <span className="text-gray-700">or</span>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-black underline decoration-2 underline-offset-4 font-medium"
                        >
                          Buy Now
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
