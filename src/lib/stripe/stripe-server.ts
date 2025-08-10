// src/lib/stripe/stripe-server.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil', // FIXED: Using a stable, working API version
  typescript: true,
});

// Helper function to format amount for Stripe (convert to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Helper function to format amount from Stripe (convert from cents)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};
