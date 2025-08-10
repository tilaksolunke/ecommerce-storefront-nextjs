// src/components/cart/CartDrawer.tsx
'use client';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const { state, dispatch } = useCart();

  console.log('🛒 CartDrawer render - Cart state:', state); // Debug log

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ShoppingBag className="w-6 h-6" />
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
            {state.itemCount}
          </span>
        )}
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Shopping Cart ({state.itemCount})</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Debug Info (Remove in production) */}
              <div className="p-2 bg-yellow-100 text-xs">
                <p>Debug: Items count: {state.items.length}</p>
                <p>Debug: Total: ${state.total.toFixed(2)}</p>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {state.items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.items.map((item, index) => (
                      <div 
                        key={`cart-item-${item._id}-${index}`} // Fixed: Added unique key
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Image
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-blue-600 font-semibold">${item.price}</p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center mt-2 space-x-2">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="p-1 hover:bg-white rounded-full transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="p-1 hover:bg-white rounded-full transition-colors"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeItem(item._id)}
                              className="ml-auto text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {state.items.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total: ${state.total.toFixed(2)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
