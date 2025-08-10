'use client';

import Link from 'next/link';
import Image from 'next/image';
import SearchFilters from '@/components/product/SearchFilters';
import Pagination from '@/components/ui/Pagination';
import SeedProductsButton from '@/components/product/SeedProductsButton';
import QuickAddToCart from '@/components/product/QuickAddToCart';
import CartButton from '@/components/ui/CartButton';
import styles from './products.module.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  featured: boolean;
  createdAt?: string;
}

interface ProductsClientProps {
  products: Product[];
  pagination: any;
  categories: string[];
  resolvedSearchParams: any;
}

export default function ProductsClient({ 
  products, 
  pagination, 
  categories, 
  resolvedSearchParams 
}: ProductsClientProps) {
  const viewMode = resolvedSearchParams?.view || 'grid';

  // Smooth scroll function for Browse Categories
  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories-section');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Enhanced Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-20 mb-12 relative overflow-hidden">
          {/* Floating circles with CSS modules */}
          <div className={`absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full ${styles.floatingAnimation}`}></div>
          <div className={`absolute top-20 right-20 w-16 h-16 bg-white bg-opacity-5 rounded-full ${styles.floatingAnimation}`} style={{animationDelay: '1s'}}></div>
          <div className={`absolute bottom-20 left-1/4 w-12 h-12 bg-white bg-opacity-10 rounded-full ${styles.floatingAnimation}`} style={{animationDelay: '2s'}}></div>
          
          <div className="container mx-auto px-4 text-center relative">
            <div className="max-w-5xl mx-auto">
              <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${styles.animateFadeInDown}`}>
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Discover Amazing Products
                </span>
              </h1>
              <p className={`text-xl md:text-2xl opacity-90 mb-10 ${styles.animateFadeInUp} ${styles.stagger1}`}>
                Find exactly what you are looking for from our curated collection of{' '}
                <span className="font-bold text-yellow-300">{pagination.total}+</span> premium products
              </p>
              
              {/* Enhanced Action Buttons - Customer Focused */}
              <div className={`flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 ${styles.animateFadeInUp} ${styles.stagger2}`}>
                {/* Browse Categories Button with Smooth Scroll */}
                <button
                  onClick={scrollToCategories}
                  className="bg-white text-blue-600 px-10 py-5 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 group"
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5 group-hover:bounce transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span>Browse Categories</span>
                  </span>
                </button>
                
                {/* Shop Now Button */}
                <button
                  onClick={() => {
                    const productsSection = document.getElementById('products-section');
                    if (productsSection) {
                      productsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="border-2 border-white text-white px-10 py-5 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
                >
                  Shop Now
                </button>
              </div>

              {/* Enhanced Quick Stats - More Visible Numbers */}
              <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto ${styles.animateFadeInUp} ${styles.stagger3}`}>
                <div className="text-center p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl hover:bg-opacity-30 transition-all duration-300 transform hover:-translate-y-1 border border-white border-opacity-20">
                  <div className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">{pagination.total}+</div>
                  <div className="text-base font-semibold text-white opacity-90 mt-2">Products</div>
                </div>
                <div className="text-center p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl hover:bg-opacity-30 transition-all duration-300 transform hover:-translate-y-1 border border-white border-opacity-20">
                  <div className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">{categories.length}</div>
                  <div className="text-base font-semibold text-white opacity-90 mt-2">Categories</div>
                </div>
                <div className="text-center p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl hover:bg-opacity-30 transition-all duration-300 transform hover:-translate-y-1 border border-white border-opacity-20">
                  <div className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">24/7</div>
                  <div className="text-base font-semibold text-white opacity-90 mt-2">Support</div>
                </div>
                <div className="text-center p-6 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl hover:bg-opacity-30 transition-all duration-300 transform hover:-translate-y-1 border border-white border-opacity-20">
                  <div className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">Free</div>
                  <div className="text-base font-semibold text-white opacity-90 mt-2">Shipping</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your component JSX remains the same... */}
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <div className={styles.animateFadeInUp}>
            <SearchFilters />
          </div>

          {/* Quick Category Filter Chips with ID for scrolling */}
          <div id="categories-section" className={`mb-12 ${styles.animateFadeInUp} ${styles.stagger1} scroll-mt-8`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Shop by Category</h3>
              <div className="hidden md:block text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                {categories.length} categories available
              </div>
            </div>
            
            {/* Category filters JSX */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className={`px-6 py-4 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 ${
                  !resolvedSearchParams.category 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg ring-4 ring-blue-200 ring-opacity-50' 
                    : 'bg-white text-gray-700 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 shadow-sm'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>All Products</span>
                </span>
              </Link>
              
              {/* Add your categories mapping here */}
              {categories.slice(0, 8).map((category: string, index: number) => (
                <Link
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className={`px-6 py-4 rounded-full text-sm font-medium transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 ${styles.animateSlideInLeft} ${
                    resolvedSearchParams.category === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg ring-4 ring-blue-200 ring-opacity-50'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span>{category}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Products Section - Add your products grid here */}
          <div id="products-section" className="scroll-mt-8">
            {/* Your existing products display logic */}
          </div>
        </div>
      </div>

      {/* Enhanced Floating Cart Button for Mobile */}
      <div className="fixed bottom-8 right-8 lg:hidden z-50">
        <div className="animate-bounce hover:animate-none">
          <CartButton floating={true} />
        </div>
      </div>
    </>
  );
}
