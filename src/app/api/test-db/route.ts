import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      message: 'Database connected successfully!',
      status: 'success' 
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'error' 
    }, { status: 500 });
  }
}
