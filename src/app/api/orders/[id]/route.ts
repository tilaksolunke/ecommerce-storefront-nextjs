// import { NextRequest, NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Order from '@/models/Order';

// interface RouteParams {
//   params: Promise<{ id: string }>;
// }

// // GET single order by ID
// export async function GET(request: NextRequest, { params }: RouteParams) {
//   try {
//     const resolvedParams = await params;
//     await connectDB();

//     const order = await Order.findById(resolvedParams.id)
//       .populate('items.product', 'name images category')
//       .populate('user', 'name email');
    
//     if (!order) {
//       return NextResponse.json(
//         { message: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ 
//       order,
//       message: 'Order retrieved successfully' 
//     });
//   } catch (error) {
//     console.error('GET order error:', error);
//     return NextResponse.json(
//       { message: 'Failed to retrieve order' },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update order status
// export async function PUT(request: NextRequest, { params }: RouteParams) {
//   try {
//     const resolvedParams = await params;
//     await connectDB();

//     const body = await request.json();
//     const { orderStatus, paymentStatus, trackingNumber, notes, estimatedDelivery } = body;

//     const updateData: any = {};
    
//     if (orderStatus) updateData.orderStatus = orderStatus;
//     if (paymentStatus) updateData.paymentStatus = paymentStatus;
//     if (trackingNumber) updateData.trackingNumber = trackingNumber;
//     if (notes !== undefined) updateData.notes = notes;
//     if (estimatedDelivery) updateData.estimatedDelivery = new Date(estimatedDelivery);

//     const updatedOrder = await Order.findByIdAndUpdate(
//       resolvedParams.id,
//       updateData,
//       { new: true, runValidators: true }
//     ).populate('items.product', 'name images')
//      .populate('user', 'name email');

//     if (!updatedOrder) {
//       return NextResponse.json(
//         { message: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ 
//       order: updatedOrder,
//       message: 'Order updated successfully' 
//     });
//   } catch (error) {
//     console.error('UPDATE order error:', error);
//     return NextResponse.json(
//       { message: 'Failed to update order' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE order (Admin only)
// export async function DELETE(request: NextRequest, { params }: RouteParams) {
//   try {
//     const resolvedParams = await params;
//     await connectDB();

//     const deletedOrder = await Order.findByIdAndDelete(resolvedParams.id);
    
//     if (!deletedOrder) {
//       return NextResponse.json(
//         { message: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ 
//       message: 'Order deleted successfully',
//       order: deletedOrder
//     });
//   } catch (error) {
//     console.error('DELETE order error:', error);
//     return NextResponse.json(
//       { message: 'Failed to delete order' },
//       { status: 500 }
//     );
//   }
// }


// src/app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import connectMongoDB from '@/lib/mongodb';
import Order from '@/models/Order';

interface OrderDocument {
  _id: string;
  orderNumber: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      images?: string[];
    } | null;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();
    
    const order = await Order.findById(params.id)
      .populate('items.product', 'name price images')
      .lean() as OrderDocument | null;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Ensure the order belongs to the current user (security check)
    if (order.user?.email !== session.user.email && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    
    // Fix for TypeScript error: handle unknown error type
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json({ 
      error: 'Failed to fetch order',
      details: errorMessage
    }, { status: 500 });
  }
}
