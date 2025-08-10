// src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/stripe-server';
import connectMongoDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers(); // Fix: await the headers
  const signature = headersList.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    try {
      await connectMongoDB();

      // Check if metadata exists and parse it safely
      if (!session.metadata) {
        console.error('No metadata found in session');
        return NextResponse.json({ error: 'Missing session metadata' }, { status: 400 });
      }

      // Parse metadata with proper null checks
      const shippingAddress = JSON.parse(session.metadata.shippingAddress);
      const items = JSON.parse(session.metadata.items);
      
      // Generate order number
      const orderNumber = 'ORD-' + Date.now();

      // Update product stock and prepare order items
      const orderItems = [];
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (product) {
          // Update stock
          product.stock -= item.quantity;
          await product.save();

          orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price
          });
        }
      }

      // Create order in database with null checks
      const order = new Order({
        orderNumber,
        user: {
          id: session.metadata.userId || '',
          email: session.metadata.userEmail || '',
        },
        items: orderItems,
        shippingAddress,
        paymentMethod: 'stripe',
        totalAmount: session.amount_total ? session.amount_total / 100 : 0, // Fix null check
        status: 'confirmed',
        paymentStatus: 'paid',
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent,
      });

      await order.save();

      console.log('Order created successfully:', orderNumber);

    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
