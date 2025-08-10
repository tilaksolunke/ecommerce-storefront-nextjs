// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Order from '@/models/Order';
// import Product from '@/models/Product';

// // Define TypeScript interfaces for type safety
// interface OrderItem {
//   product: string; // MongoDB ObjectId as string
//   name: string;
//   quantity: number;
//   price: number;
//   image?: string;
// }

// interface ShippingAddress {
//   firstName: string;
//   lastName: string;
//   address: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
//   phone?: string;
// }

// interface CreateOrderRequest {
//   userId: string;
//   email: string;
//   items: OrderItem[];
//   shippingAddress: ShippingAddress;
//   paymentMethod: 'credit_card' | 'paypal' | 'stripe' | 'cash_on_delivery';
//   subtotal: number;
//   tax?: number;
//   shipping?: number;
//   total: number;
//   notes?: string;
// }

// // GET all orders (Admin) or user orders
// export async function GET(request: NextRequest) {
//   try {
//     await connectDB();

//     const { searchParams } = new URL(request.url);
//     const userId = searchParams.get('userId');
//     const isAdmin = searchParams.get('admin') === 'true';
//     const status = searchParams.get('status');
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');

//     let query: any = {};
    
//     if (userId && !isAdmin) {
//       query.user = userId;
//     }
    
//     if (status) {
//       query.orderStatus = status;
//     }

//     const skip = (page - 1) * limit;

//     const [orders, totalCount] = await Promise.all([
//       Order.find(query)
//         .populate('items.product', 'name images')
//         .populate('user', 'name email')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),
//       Order.countDocuments(query)
//     ]);

//     const totalPages = Math.ceil(totalCount / limit);

//     return NextResponse.json({
//       orders,
//       pagination: {
//         current: page,
//         pages: totalPages,
//         total: totalCount,
//         hasNext: page < totalPages,
//         hasPrev: page > 1
//       }
//     });
//   } catch (error) {
//     console.error('GET orders error:', error);
//     return NextResponse.json(
//       { message: 'Failed to fetch orders' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create new order
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();

//     const body: CreateOrderRequest = await request.json();
//     const {
//       userId,
//       email,
//       items,
//       shippingAddress,
//       paymentMethod,
//       subtotal,
//       tax,
//       shipping,
//       total,
//       notes
//     } = body;

//     // Validation
//     if (!userId || !email || !items || !items.length || !shippingAddress || !subtotal || !total) {
//       return NextResponse.json(
//         { message: 'Missing required fields' },
//         { status: 400 }
//       );
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return NextResponse.json(
//         { message: 'Invalid email format' },
//         { status: 400 }
//       );
//     }

//     // Validate shipping address
//     const requiredAddressFields = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode', 'country'];
//     for (const field of requiredAddressFields) {
//       if (!shippingAddress[field as keyof ShippingAddress]) {
//         return NextResponse.json(
//           { message: `Missing required address field: ${field}` },
//           { status: 400 }
//         );
//       }
//     }

//     // Validate products and prepare stock updates
//     const productUpdates = [];
    
//     for (const item of items) {
//       // Validate item structure
//       if (!item.product || !item.name || !item.quantity || !item.price) {
//         return NextResponse.json(
//           { message: 'Invalid item structure' },
//           { status: 400 }
//         );
//       }

//       if (item.quantity <= 0) {
//         return NextResponse.json(
//           { message: `Invalid quantity for ${item.name}` },
//           { status: 400 }
//         );
//       }

//       if (item.price <= 0) {
//         return NextResponse.json(
//           { message: `Invalid price for ${item.name}` },
//           { status: 400 }
//         );
//       }

//       const product = await Product.findById(item.product);
      
//       if (!product) {
//         return NextResponse.json(
//           { message: `Product ${item.name} not found` },
//           { status: 404 }
//         );
//       }
      
//       if (product.stock < item.quantity) {
//         return NextResponse.json(
//           { message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` },
//           { status: 400 }
//         );
//       }
      
//       // Prepare stock update
//       productUpdates.push({
//         updateOne: {
//           filter: { _id: item.product },
//           update: { $inc: { stock: -item.quantity } }
//         }
//       });
//     }

//     // Validate totals
//     const calculatedSubtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//     if (Math.abs(calculatedSubtotal - subtotal) > 0.01) {
//       return NextResponse.json(
//         { message: 'Subtotal mismatch' },
//         { status: 400 }
//       );
//     }

//     // Create order
//     const newOrder = new Order({
//       user: userId,
//       email: email.trim(),
//       items: items.map((item: OrderItem) => ({
//         product: item.product,
//         name: item.name,
//         quantity: item.quantity,
//         price: item.price,
//         image: item.image || ''
//       })),
//       shippingAddress,
//       paymentMethod,
//       subtotal: parseFloat(subtotal.toString()),
//       tax: parseFloat((tax || 0).toString()),
//       shipping: parseFloat((shipping || 0).toString()),
//       total: parseFloat(total.toString()),
//       notes: notes?.trim() || ''
//     });

//     const savedOrder = await newOrder.save();

//     // Update product stock
//     if (productUpdates.length > 0) {
//       await Product.bulkWrite(productUpdates);
//     }

//     // Populate the order for response
//     await savedOrder.populate('items.product', 'name images');

//     return NextResponse.json({
//       order: savedOrder,
//       message: 'Order created successfully'
//     }, { status: 201 });

//   } catch (error) {
//     console.error('POST order error:', error);
    
//     // Handle specific MongoDB errors
//     if (error instanceof Error) {
//       if (error.message.includes('validation failed')) {
//         return NextResponse.json(
//           { message: 'Validation error: Please check your order data' },
//           { status: 400 }
//         );
//       }
      
//       if (error.message.includes('duplicate key')) {
//         return NextResponse.json(
//           { message: 'Order already exists' },
//           { status: 409 }
//         );
//       }
//     }
    
//     return NextResponse.json(
//       { message: 'Failed to create order. Please try again.' },
//       { status: 500 }
//     );
//   }
// }


// src/app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectMongoDB from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, shippingAddress, paymentMethod, totalAmount } = body;

    // Validate required fields
    if (!items || !shippingAddress || !totalAmount) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    await connectMongoDB();

    // Generate order number
    const orderNumber = 'ORD-' + Date.now();

    // Validate stock and get product details
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ 
          error: `Product not found: ${item.product}` 
        }, { status: 400 });
      }
      
      if (product.stock < item.quantity) {
        return NextResponse.json({ 
          error: `Insufficient stock for ${product.name}` 
        }, { status: 400 });
      }

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: item.price || product.price
      });

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      orderNumber,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name
      },
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    return NextResponse.json({ 
      success: true, 
      orderId: order._id,
      orderNumber: order.orderNumber 
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ 
      error: 'Failed to create order',
      details: error.message 
    }, { status: 500 });
  }
}
