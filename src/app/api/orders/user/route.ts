// src/app/api/orders/user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Updated import
import { connectMongoDB } from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: NextRequest) {
  try {
    const session = await auth(); // Updated usage
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectMongoDB();
    
    const orders = await Order.find({ 'user.email': session.user.email })
      .populate('items.product')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
