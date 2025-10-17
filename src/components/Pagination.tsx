'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${baseUrl || pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const pages = [];
  const showPages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  let endPage = Math.min(totalPages, startPage + showPages - 1);

  if (endPage - startPage < showPages - 1) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors uppercase text-sm tracking-wider text-black"
        >
          Previous
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 text-gray-400 uppercase text-sm tracking-wider cursor-not-allowed">
          Previous
        </span>
      )}

      {/* Page Numbers */}
      {startPage > 1 && (
        <>
          <Link
            href={createPageUrl(1)}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors text-black"
          >
            1
          </Link>
          {startPage > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={createPageUrl(page)}
          className={`w-10 h-10 flex items-center justify-center border transition-colors ${
            page === currentPage
              ? 'bg-black text-white border-black'
              : 'border-gray-300 hover:bg-gray-50 text-black'
          }`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
          <Link
            href={createPageUrl(totalPages)}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-50 transition-colors text-black"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors uppercase text-sm tracking-wider text-black"
        >
          Next
        </Link>
      ) : (
        <span className="px-4 py-2 border border-gray-200 text-gray-400 uppercase text-sm tracking-wider cursor-not-allowed">
          Next
        </span>
      )}
    </div>
  );
}
