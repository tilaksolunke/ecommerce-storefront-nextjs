// src/app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe/stripe-server';
import connectMongoDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Starting payment verification');

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    console.log('🔍 Verifying Stripe session:', sessionId);

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'line_items.data.price.product']
    });

    console.log('✅ Stripe session retrieved:', {
      id: checkoutSession.id,
      payment_status: checkoutSession.payment_status,
      amount_total: checkoutSession.amount_total
    });

    // Verify payment was successful
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ 
        error: 'Payment not completed' 
      }, { status: 400 });
    }

    await connectMongoDB();

    // Check if order already exists (prevent duplicates)
    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) {
      console.log('✅ Order already exists:', existingOrder.orderNumber);
      return NextResponse.json(existingOrder);
    }

    // Parse metadata from Stripe session
    const metadata = checkoutSession.metadata;
    if (!metadata) {
      return NextResponse.json({ 
        error: 'No order metadata found' 
      }, { status: 400 });
    }

    const shippingAddress = JSON.parse(metadata.shippingAddress);
    const items = JSON.parse(metadata.items);

    // Generate order number
    const orderNumber = 'ORD-' + Date.now();

    console.log('🔍 Creating order with items:', items);

    // Process items and update stock
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        // Update stock
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save();

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: item.price || product.price
        });

        console.log(`✅ Stock updated for ${product.name}: ${product.stock} remaining`);
      }
    }

    // Create order in database
    const order = new Order({
      orderNumber,
      user: {
        id: session.user.id || session.user.email,
        email: session.user.email,
        name: session.user.name || session.user.email
      },
      items: orderItems,
      shippingAddress,
      paymentMethod: 'stripe',
      totalAmount: (checkoutSession.amount_total || 0) / 100, // Convert from cents
      status: 'confirmed',
      paymentStatus: 'paid',
      stripeSessionId: sessionId,
      stripePaymentIntentId: checkoutSession.payment_intent,
    });

    await order.save();

    console.log('✅ Order created successfully:', orderNumber);

    // Populate product details for response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name price')
      .lean();

    return NextResponse.json(populatedOrder);

  } catch (error) {
    console.error('❌ Payment verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({ 
      error: 'Failed to verify payment',
      details: errorMessage 
    }, { status: 500 });
  }
}
