import Link from 'next/link';
import Pagination from '@/components/Pagination';
import SortFilter from '@/components/SortFilter';

async function getItems(searchParams: { page?: string; sortBy?: string }) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const page = searchParams.page || '1';
    const sortBy = searchParams.sortBy || 'newest';

    const res = await fetch(`${baseUrl}/api/items?page=${page}&sortBy=${sortBy}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch items');
    }

    const data = await res.json();
    return {
      items: data.data || [],
      pagination: data.pagination || { page: 1, totalPages: 1 }
    };
  } catch (error) {
    console.error('Error fetching items:', error);
    return { items: [], pagination: { page: 1, totalPages: 1 } };
  }
}

export default async function ItemsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; sortBy?: string }>;
}) {
  const params = await searchParams;
  const { items, pagination } = await getItems(params);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Sort Filter */}
        <div className="mb-6 flex justify-end">
          <SortFilter />
        </div>

        {items.length === 0 ? (
          <p className="text-center text-gray-700 py-12">
            No items found. Add your first item!
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
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
                      Read More
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

            {/* Pagination */}
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
            />
          </>
        )}
      </div>
    </div>
  );
}
