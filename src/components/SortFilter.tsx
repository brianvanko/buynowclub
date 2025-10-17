'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SortFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sortBy') || 'newest';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', e.target.value);
    params.set('page', '1'); // Reset to first page when sorting changes
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700 uppercase tracking-wider">
        Sort By:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-black bg-white uppercase text-sm tracking-wider"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name">Name (A-Z)</option>
      </select>
    </div>
  );
}
