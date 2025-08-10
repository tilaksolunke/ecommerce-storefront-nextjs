'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CartButtonProps {
  showText?: boolean;
  floating?: boolean;
}

export default function CartButton({ showText = false, floating = false }: CartButtonProps) {
  const [cartCount, setCartCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Update cart count from localStorage
  const updateCartCount = () => {
    try {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const cartItems = JSON.parse(cart);
        if (Array.isArray(cartItems)) {
          const totalCount = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
          setCartCount(totalCount);
        }
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error loading cart count:', error);
      setCartCount(0);
    } finally {
      setIsLoading(false);
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

  const baseClasses = floating 
    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-105 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
    : showText
    ? "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
    : "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 shadow-lg flex items-center space-x-2";

  return (
    <Link href="/cart" className={baseClasses}>
      <div className="relative">
        <svg className={`${floating ? 'w-6 h-6' : 'w-5 h-5'} fill-none stroke="currentColor`} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-2.4 0L9 19h10" />
        </svg>
        {cartCount > 0 && (
          <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}>
            {cartCount > 99 ? '99+' : cartCount}
          </span>
        )}
      </div>
      {showText && !floating && (
        <span className={isLoading ? 'opacity-50' : ''}>
          {isLoading ? 'Loading...' : `View Cart ${cartCount > 0 ? `(${cartCount})` : ''}`}
        </span>
      )}
    </Link>
  );
}
