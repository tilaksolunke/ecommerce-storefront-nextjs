'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  // Update cart count from localStorage
  const updateCartCount = () => {
    const cart = localStorage.getItem('cart');
    if (cart) {
      const cartItems = JSON.parse(cart);
      const totalCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(totalCount);
    } else {
      setCartCount(0);
    }
  };

  // Listen for cart updates
  useEffect(() => {
    updateCartCount();
    
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            🛒 E-Shop
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Products
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Categories
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Admin
            </Link>
          </nav>

          {/* Cart and User Actions */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/cart" 
              className="relative text-gray-700 hover:text-blue-600 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L9 19h10" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline font-medium">Cart</span>
              </div>
            </Link>
            
            <Link 
              href="/profile" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
