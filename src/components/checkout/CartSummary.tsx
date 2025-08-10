// src/components/checkout/CartSummary.tsx
'use client';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';

interface CartSummaryProps {
  onNext: () => void;
}

export default function CartSummary({ onNext }: CartSummaryProps) {
  const { state } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Review Your Cart</h2>
      
      <div className="space-y-4 mb-6">
        {state.items.map((item, index) => (
          <div 
            key={`cart-summary-${item._id}-${index}`} // Fixed: Added unique key
            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
          >
            <Image
              src={item.image || '/placeholder.jpg'}
              alt={item.name}
              width={80}
              height={80}
              className="rounded-md object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-blue-600 font-semibold">${item.price}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total: ${state.total.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
      >
        Continue to Shipping
      </button>
    </div>
  );
}
