// src/app/checkout/page.tsx
'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCart } from '@/contexts/CartContext';
import { redirect } from 'next/navigation';
import CartSummary from '@/components/checkout/CartSummary';
import ShippingForm from '@/components/checkout/ShippingForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderReview from '@/components/checkout/OrderReview';
import { CheckCircle, ShoppingCart, Truck, CreditCard, Eye } from 'lucide-react';

const steps = [
  { id: 1, name: 'Cart', icon: ShoppingCart },
  { id: 2, name: 'Shipping', icon: Truck },
  { id: 3, name: 'Payment', icon: CreditCard },
  { id: 4, name: 'Review', icon: Eye },
];

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { state: cartState } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState({});
  const [paymentData, setPaymentData] = useState({});

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) redirect('/auth/signin');
  if (cartState.items.length === 0) redirect('/products');

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6">
              {currentStep === 1 && (
                <CartSummary onNext={nextStep} />
              )}
              {currentStep === 2 && (
                <ShippingForm 
                  onNext={nextStep} 
                  onPrev={prevStep}
                  onDataChange={setShippingData}
                  initialData={shippingData}
                />
              )}
              {currentStep === 3 && (
                <PaymentForm 
                  onNext={nextStep} 
                  onPrev={prevStep}
                  onDataChange={setPaymentData}
                  initialData={paymentData}
                />
              )}
              {currentStep === 4 && (
                <OrderReview 
                  onPrev={prevStep}
                  shippingData={shippingData}
                  paymentData={paymentData}
                />
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3">
              {cartState.items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 font-semibold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>${cartState.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
