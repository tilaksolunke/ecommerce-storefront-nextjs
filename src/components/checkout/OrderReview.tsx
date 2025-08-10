// src/components/checkout/OrderReview.tsx
'use client';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { CheckCircle, CreditCard, AlertCircle, Loader2 } from 'lucide-react';

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

interface OrderReviewProps {
  onPrev: () => void;
  shippingData: ShippingAddress;
  paymentData?: any;
}

export default function OrderReview({ onPrev, shippingData }: OrderReviewProps) {
  const { state: cartState } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCartData = () => {
    console.log('🔍 Validating cart data:', cartState);

    if (!cartState.items || cartState.items.length === 0) {
      throw new Error('Your cart is empty. Please add items before checkout.');
    }

    const validationErrors: string[] = [];
    
    cartState.items.forEach((item, index) => {
      if (!item._id) {
        validationErrors.push(`Item ${index + 1}: Missing product ID`);
      }
      if (!item.name || item.name.trim() === '') {
        validationErrors.push(`Item ${index + 1}: Missing product name`);
      }
      if (!item.price || isNaN(Number(item.price)) || Number(item.price) <= 0) {
        validationErrors.push(`Item ${index + 1}: Invalid price (${item.price})`);
      }
      if (!item.quantity || isNaN(Number(item.quantity)) || Number(item.quantity) <= 0) {
        validationErrors.push(`Item ${index + 1}: Invalid quantity (${item.quantity})`);
      }
      if (item.quantity > (item.stock || 0)) {
        validationErrors.push(`Item ${index + 1}: Quantity exceeds stock (${item.quantity} > ${item.stock})`);
      }
    });

    if (validationErrors.length > 0) {
      throw new Error('Cart validation errors: ' + validationErrors.join(', '));
    }

    console.log('✅ Cart validation passed');
  };

  const validateShippingData = () => {
    console.log('🔍 Validating shipping data:', shippingData);

    const requiredFields: (keyof ShippingAddress)[] = [
      'firstName', 'lastName', 'email', 'phone', 
      'address', 'city', 'state', 'zipCode', 'country'
    ];
    
    const missingFields: string[] = [];
    
    requiredFields.forEach(field => {
      if (!shippingData[field] || shippingData[field].trim() === '') {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      throw new Error(`Missing shipping information: ${missingFields.join(', ')}`);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingData.email)) {
      throw new Error('Invalid email address format');
    }

    // Phone validation (basic)
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(shippingData.phone.replace(/\s/g, ''))) {
      throw new Error('Invalid phone number format');
    }

    console.log('✅ Shipping data validation passed');
  };

  const handleStripeCheckout = async () => {
    setIsProcessing(true);
    setError(null);
    
    try {
      console.log('🚀 Starting Stripe checkout process...');

      // Validate cart state
      validateCartData();

      // Validate shipping data
      validateShippingData();

      const orderData = {
        items: cartState.items.map(item => ({
          product: item._id,
          quantity: Number(item.quantity),
          price: Number(item.price)
        })),
        shippingAddress: {
          ...shippingData,
          phone: shippingData.phone.replace(/\D/g, ''), // Remove non-digits from phone
        },
      };

      console.log('🔍 Sending order data to Stripe:', {
        itemCount: orderData.items.length,
        totalAmount: cartState.total,
        customerEmail: shippingData.email
      });

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('🔍 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      const result = await response.json();
      console.log('🔍 Response data:', result);

      if (!response.ok) {
        const errorMessage = result.details || result.error || `Server error (${response.status})`;
        throw new Error(errorMessage);
      }

      if (!result.url) {
        throw new Error('No checkout URL received from Stripe');
      }

      console.log('✅ Redirecting to Stripe checkout:', result.url);

      // Store checkout session info in localStorage for recovery
      localStorage.setItem('checkoutSession', JSON.stringify({
        sessionId: result.sessionId,
        timestamp: Date.now(),
        items: cartState.items.length,
        total: cartState.total
      }));

      // Redirect to Stripe Checkout
      window.location.href = result.url;

    } catch (error: unknown) {
      console.error('❌ Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const retryCheckout = () => {
    setError(null);
    handleStripeCheckout();
  };

  if (cartState.items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <AlertCircle className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-4">Add some items to your cart before proceeding to checkout.</p>
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-800 mb-1">Checkout Error</h4>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={retryCheckout}
                className="mt-3 text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Order Items ({cartState.items.length})</h3>
            <div className="space-y-4">
              {cartState.items.map((item, index) => (
                <div 
                  key={`order-item-${item._id}-${index}`}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || '/placeholder.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg';
                      }}
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      <p className="text-sm text-blue-600 font-semibold">${Number(item.price).toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Total */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-blue-600">${cartState.total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                *Final total may include taxes and shipping fees calculated by Stripe
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">{shippingData.firstName} {shippingData.lastName}</p>
                  <p className="text-gray-600">{shippingData.email}</p>
                  <p className="text-gray-600">{shippingData.phone}</p>
                </div>
                <div>
                  <p>{shippingData.address}</p>
                  <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
                  <p>{shippingData.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cartState.itemCount} items)</span>
                <span>${cartState.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            {/* Stripe Payment Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <CreditCard className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 font-medium mb-1">Secure Payment with Stripe</p>
                  <p className="text-xs text-blue-600">
                    You'll be redirected to Stripe's secure checkout page to complete your payment
                  </p>
                  <ul className="text-xs text-blue-600 mt-2 space-y-1">
                    <li>• Credit & Debit Cards</li>
                    <li>• Bank Transfers</li>
                    <li>• Digital Wallets</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Checkout Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleStripeCheckout}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Pay with Stripe</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={onPrev}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isProcessing}
              >
                Back to Shipping
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
