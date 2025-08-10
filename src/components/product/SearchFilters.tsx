'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Automotive',
  'Toys'
];

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'createdAt');
  const [order, setOrder] = useState(searchParams.get('order') || 'desc');

  const updateURL = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  }, [searchParams, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ search });
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    updateURL({ category: newCategory });
  };

  const handleSortChange = (newSort: string, newOrder: string) => {
    setSort(newSort);
    setOrder(newOrder);
    updateURL({ sort: newSort, order: newOrder });
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setSort('createdAt');
    setOrder('desc');
    router.push('/products');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search for amazing products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-6 py-4 text-lg text-gray-900 placeholder-gray-500 bg-gray-50 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-300"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            📂 Category
          </label>
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-300"
          >
            <option value="" className="text-gray-900">🌟 All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="text-gray-900">{cat}</option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            🔄 Sort By
          </label>
          <select
            value={`${sort}-${order}`}
            onChange={(e) => {
              const [newSort, newOrder] = e.target.value.split('-');
              handleSortChange(newSort, newOrder);
            }}
            className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all duration-300"
          >
            <option value="createdAt-desc" className="text-gray-900">🆕 Newest First</option>
            <option value="createdAt-asc" className="text-gray-900">⏰ Oldest First</option>
            <option value="price-asc" className="text-gray-900">💰 Price: Low to High</option>
            <option value="price-desc" className="text-gray-900">💎 Price: High to Low</option>
            <option value="name-asc" className="text-gray-900">🔤 Name: A to Z</option>
            <option value="name-desc" className="text-gray-900">🔤 Name: Z to A</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex flex-col justify-end">
          <button
            onClick={clearFilters}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            🗑️ Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
}
