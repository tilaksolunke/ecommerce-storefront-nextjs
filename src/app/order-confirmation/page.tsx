// src/app/order-confirmation/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Updated interface to match API response
interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
  } | null;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Updated OrderData interface to include missing properties
interface OrderData {
  _id: string;
  orderNumber: string;
  user: {                    // Added missing property
    id: string;
    email: string;
    name: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;     // Added missing property
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    } else {
      setLoading(false);
      setError('No order ID provided');
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const orderData: OrderData = await response.json();
        setOrder(orderData);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Order not found');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains the same...
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">The requested order could not be found.</p>
          <Link
            href="/profile"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Package className="w-4 h-4 mr-2" />
            View Order History
          </Link>
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
            Order Placed Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Your order <strong>#{order.orderNumber}</strong> has been confirmed
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-4 text-gray-800">Order Summary</h3>
            <div className="space-y-2 text-left">
              {order.items.map((item: OrderItem, index: number) => (
                <div key={`${item._id}-${index}`} className="flex justify-between text-sm">
                  <span>
                    {item.product?.name || 'Product'} × {item.quantity}
                  </span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-blue-600">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>📧 Confirmation email sent to your inbox</li>
              <li>📦 Order will be processed within 24 hours</li>
              <li>🚚 Tracking information will be provided</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Package className="w-4 h-4 mr-2" />
                View Order History
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
    </div>
  );
}
