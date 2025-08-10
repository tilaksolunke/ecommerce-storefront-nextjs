// src/components/checkout/PaymentForm.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreditCard, Lock } from 'lucide-react';

const paymentSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be 16 digits'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string().min(3, 'CVV must be at least 3 digits'),
  cardName: z.string().min(1, 'Cardholder name is required'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  onNext: () => void;
  onPrev: () => void;
  onDataChange: (data: any) => void;
  initialData: any;
}

export default function PaymentForm({ onNext, onPrev, onDataChange, initialData }: PaymentFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData
  });

  const onSubmit = (data: PaymentFormData) => {
    onDataChange(data);
    onNext();
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <CreditCard className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold">Payment Information</h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Lock className="w-5 h-5 text-blue-600 mr-2" />
          <p className="text-sm text-blue-800">Your payment information is secure and encrypted</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            {...register('cardNumber')}
            placeholder="1234 5678 9012 3456"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              {...register('expiryDate')}
              placeholder="MM/YY"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              {...register('cvv')}
              placeholder="123"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.cvv && (
              <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            {...register('cardName')}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.cardName && (
            <p className="mt-1 text-sm text-red-600">{errors.cardName.message}</p>
          )}
        </div>

        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Shipping
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Review Order
          </button>
        </div>
      </form>
    </div>
  );
}
