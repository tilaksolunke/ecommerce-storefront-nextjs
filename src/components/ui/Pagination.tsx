'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  pagination: {
    current: number;
    pages: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function Pagination({ pagination }: PaginationProps) {
  const searchParams = useSearchParams();
  
  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `/products?${params.toString()}`;
  };

  if (pagination.pages <= 1) return null;

  const pages = [];
  const showPages = 5;
  const halfShow = Math.floor(showPages / 2);
  
  let startPage = Math.max(pagination.current - halfShow, 1);
  let endPage = Math.min(startPage + showPages - 1, pagination.pages);
  
  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(endPage - showPages + 1, 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2">
      {/* Previous Button */}
      {pagination.hasPrev ? (
        <Link
          href={createPageURL(pagination.current - 1)}
          className="px-3 py-2 border rounded-lg hover:bg-gray-50"
        >
          Previous
        </Link>
      ) : (
        <span className="px-3 py-2 border rounded-lg text-gray-400 cursor-not-allowed">
          Previous
        </span>
      )}

      {/* First Page */}
      {startPage > 1 && (
        <>
          <Link
            href={createPageURL(1)}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={createPageURL(page)}
          className={`px-3 py-2 border rounded-lg ${
            page === pagination.current
              ? 'bg-blue-600 text-white border-blue-600'
              : 'hover:bg-gray-50'
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Last Page */}
      {endPage < pagination.pages && (
        <>
          {endPage < pagination.pages - 1 && <span className="px-2">...</span>}
          <Link
            href={createPageURL(pagination.pages)}
            className="px-3 py-2 border rounded-lg hover:bg-gray-50"
          >
            {pagination.pages}
          </Link>
        </>
      )}

      {/* Next Button */}
      {pagination.hasNext ? (
        <Link
          href={createPageURL(pagination.current + 1)}
          className="px-3 py-2 border rounded-lg hover:bg-gray-50"
        >
          Next
        </Link>
      ) : (
        <span className="px-3 py-2 border rounded-lg text-gray-400 cursor-not-allowed">
          Next
        </span>
      )}
    </div>
  );
}
