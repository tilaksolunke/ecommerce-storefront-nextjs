import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single product by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Await the params Promise (Next.js 15 requirement)
    const resolvedParams = await params;
    
    // Connect to database
    await connectDB();

    // Find the product by ID
    const product = await Product.findById(resolvedParams.id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      product,
      message: 'Product retrieved successfully' 
    });
  } catch (error) {
    console.error('GET product error:', error);
    return NextResponse.json(
      { message: 'Failed to retrieve product', error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE product by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    await connectDB();

    const body = await request.json();
    const { name, description, price, category, stock, images, featured } = body;

    // Validation
    if (!name || !description || price === undefined || !category || stock === undefined) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      resolvedParams.id,
      {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        category: category.trim(),
        stock: parseInt(stock),
        images: images || [],
        featured: Boolean(featured),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      product: updatedProduct,
      message: 'Product updated successfully' 
    });
  } catch (error) {
    console.error('UPDATE product error:', error);
    return NextResponse.json(
      { message: 'Failed to update product', error: error.message },
      { status: 500 }
    );
  }
}

// DELETE product by ID  
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    await connectDB();

    const deletedProduct = await Product.findByIdAndDelete(resolvedParams.id);
    
    if (!deletedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Product deleted successfully',
      product: deletedProduct
    });
  } catch (error) {
    console.error('DELETE product error:', error);
    return NextResponse.json(
      { message: 'Failed to delete product', error: error.message },
      { status: 500 }
    );
  }
}
