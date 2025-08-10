'use client';

import { useState } from 'react';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
}

interface QuickAddToCartProps {
  product: Product;
}

export default function QuickAddToCart({ product }: QuickAddToCartProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0 || isAdding) return;
    
    setIsAdding(true);
    
    try {
      // Get existing cart from localStorage
      let cart: any[] = [];
      try {
        const existingCart = localStorage.getItem('cart');
        if (existingCart) {
          const parsedCart = JSON.parse(existingCart);
          cart = Array.isArray(parsedCart) ? parsedCart : [];
        }
      } catch (parseError) {
        cart = [];
      }
      
      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex((item: any) => item.id === product._id);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product exists
        cart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        cart.push({
          id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images && product.images.length > 0 ? product.images[0] : '',
          stock: product.stock
        });
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Show success feedback
      showSuccessMessage();
      
      // Trigger cart update event
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      console.error('Quick add to cart error:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const showSuccessMessage = () => {
    const notification = document.createElement('div');
    notification.innerHTML = `✅ Added ${product.name} to cart!`;
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transition-all duration-300 transform translate-x-0';
    notification.style.zIndex = '9999';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 2000);
  };

  return (
    <button
      onClick={handleQuickAdd}
      disabled={product.stock === 0 || isAdding}
      className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm flex items-center justify-center space-x-1 ${
        product.stock === 0
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : isAdding
          ? 'bg-blue-400 text-white cursor-wait'
          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5'
      }`}
    >
      {product.stock === 0 ? (
        <>
          <span>❌</span>
          <span>Out of Stock</span>
        </>
      ) : isAdding ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Adding...</span>
        </>
      ) : (
        <>
          <span>🛒</span>
          <span>Quick Add</span>
        </>
      )}
    </button>
  );
}
