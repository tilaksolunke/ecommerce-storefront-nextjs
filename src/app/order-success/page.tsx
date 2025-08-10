// src/app/order-success/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface OrderDetails {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  items: Array<{
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { dispatch } = useCart();

  useEffect(() => {
    if (sessionId) {
      // Clear cart after successful payment
      dispatch({ type: 'CLEAR_CART' });
      
      // Create order based on successful payment
      handleSuccessfulPayment();
    } else {
      setLoading(false);
      setError('No payment session found');
    }
  }, [sessionId]);

  const handleSuccessfulPayment = async () => {
    try {
      console.log('🔍 Processing successful payment for session:', sessionId);

      // Verify payment and create order
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        const order = await response.json();
        setOrderDetails(order);
        console.log('✅ Order created successfully:', order.orderNumber);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('❌ Error processing payment:', error);
      setError('Failed to process your order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Processing Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Your payment was successful, but there was an issue creating your order.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/profile"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Check Order History
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed and will be processed shortly.
          </p>

          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-2 text-gray-800">Order #{orderDetails.orderNumber}</h3>
              <p className="text-sm text-gray-600">Total: ${orderDetails.totalAmount.toFixed(2)}</p>
              <p className="text-sm text-green-600 font-medium mt-1">Status: {orderDetails.status}</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>📧 Order confirmation email sent</li>
              <li>📦 Processing within 24 hours</li>
              <li>🚚 Tracking info will be provided</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Package className="w-4 h-4 mr-2" />
              View Orders
            </Link>
            
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
