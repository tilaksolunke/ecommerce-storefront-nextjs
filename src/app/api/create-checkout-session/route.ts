// src/app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe/stripe-server';
import connectMongoDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting checkout session creation');
    
    const session = await auth();
    
    if (!session?.user?.email) {
      console.error('❌ No authenticated user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ User authenticated:', session.user.email);

    const body = await request.json();
    console.log('🔍 Request body received:', JSON.stringify(body, null, 2));
    
    const { items, shippingAddress } = body;

    // Enhanced validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ Invalid items:', items);
      return NextResponse.json({ 
        error: 'No items provided or invalid items format',
        details: 'Items must be a non-empty array'
      }, { status: 400 });
    }

    console.log('✅ Items validation passed, item count:', items.length);

    if (!shippingAddress) {
      console.error('❌ Missing shipping address');
      return NextResponse.json({ 
        error: 'Shipping address is required' 
      }, { status: 400 });
    }

    console.log('✅ Shipping address provided');

    await connectMongoDB();
    console.log('✅ Database connected');

    // Validate products and create line items for Stripe
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let totalAmount = 0;

    console.log('🔍 Processing items for Stripe...');

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      console.log(`🔍 Processing item ${i + 1}:`, item);
      
      // Check if item has required fields
      if (!item.product) {
        console.error(`❌ Item ${i + 1} missing product ID:`, item);
        return NextResponse.json({ 
          error: `Item ${i + 1}: Missing product ID` 
        }, { status: 400 });
      }

      if (!item.quantity || item.quantity <= 0) {
        console.error(`❌ Item ${i + 1} invalid quantity:`, item.quantity);
        return NextResponse.json({ 
          error: `Item ${i + 1}: Invalid quantity` 
        }, { status: 400 });
      }

      console.log(`🔍 Searching for product with ID: ${item.product}`);

      const product = await Product.findById(item.product);
      if (!product) {
        console.error(`❌ Product not found: ${item.product}`);
        return NextResponse.json({ 
          error: `Product not found: ${item.product}` 
        }, { status: 400 });
      }

      console.log(`✅ Product found: ${product.name} - $${product.price}`);

      if (product.stock < item.quantity) {
        console.error(`❌ Insufficient stock for ${product.name}: requested ${item.quantity}, available ${product.stock}`);
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        }, { status: 400 });
      }

      // Validate price and quantity
      const unitAmount = Math.round(Number(product.price) * 100);
      const quantity = Number(item.quantity);

      if (isNaN(unitAmount) || unitAmount <= 0) {
        console.error(`❌ Invalid price for ${product.name}:`, product.price);
        return NextResponse.json({ 
          error: `Invalid price for product: ${product.name}` 
        }, { status: 400 });
      }

      if (isNaN(quantity) || quantity <= 0 || quantity > 100) {
        console.error(`❌ Invalid quantity for ${product.name}:`, item.quantity);
        return NextResponse.json({ 
          error: `Invalid quantity for product: ${product.name}` 
        }, { status: 400 });
      }

      const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.description || `${product.name} - Premium Quality`,
            images: product.images && product.images.length > 0 ? [product.images[0]] : [],
          },
          unit_amount: unitAmount,
        },
        quantity: quantity,
      };

      console.log(`✅ Line item created for ${product.name}:`, {
        name: product.name,
        unit_amount: unitAmount,
        quantity: quantity
      });

      lineItems.push(lineItem);
      totalAmount += product.price * item.quantity;
    }

    console.log(`✅ All line items processed. Count: ${lineItems.length}, Total: $${totalAmount}`);

    if (lineItems.length === 0) {
      console.error('❌ No valid line items created');
      return NextResponse.json({ 
        error: 'No valid line items created' 
      }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SITE_URL) {
      console.error('❌ NEXT_PUBLIC_SITE_URL not set');
      return NextResponse.json({ 
        error: 'Server configuration error' 
      }, { status: 500 });
    }

    // Create Stripe checkout session
    const checkoutSessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id || session.user.email,
        userEmail: session.user.email,
        userName: session.user.name || '',
        shippingAddress: JSON.stringify(shippingAddress),
        items: JSON.stringify(items),
        totalItems: items.length.toString(),
        totalAmount: totalAmount.toString()
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE'],
      },
      billing_address_collection: 'required',
      payment_intent_data: {
        metadata: {
          userId: session.user.id || session.user.email,
          userEmail: session.user.email,
        }
      }
    };

    console.log('🔍 Creating Stripe session with params:', {
      line_items_count: lineItems.length,
      customer_email: checkoutSessionParams.customer_email,
      success_url: checkoutSessionParams.success_url,
      cancel_url: checkoutSessionParams.cancel_url
    });

    const checkoutSession = await stripe.checkout.sessions.create(checkoutSessionParams);

    console.log('✅ Stripe session created successfully:', {
      id: checkoutSession.id,
      url: checkoutSession.url,
      amount_total: checkoutSession.amount_total
    });

    return NextResponse.json({ 
      success: true,
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      amount: checkoutSession.amount_total
    });

  } catch (error: unknown) {
    console.error('❌ Checkout session creation error:', error);
    
    // FIXED: Simplified error handling without problematic type casting
    let errorMessage = 'Failed to create checkout session';
    let errorDetails = 'Unknown error occurred';
    
    if (error && typeof error === 'object') {
      if ('message' in error && typeof error.message === 'string') {
        errorDetails = error.message;
      }
      
      if ('type' in error) {
        if (error.type === 'StripeInvalidRequestError') {
          errorMessage = 'Payment processing error';
        } else if (error.type === 'StripeAPIError') {
          errorMessage = 'Payment service error';
          errorDetails = 'Please try again later';
        }
      }
    } else if (error instanceof Error) {
      errorDetails = error.message;
    }
    
    console.error('❌ Error details:', errorDetails);
    
    return NextResponse.json({ 
      error: errorMessage,
      details: errorDetails 
    }, { status: 500 });
  }
}
