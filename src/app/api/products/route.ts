import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET all products with filtering, search, and pagination
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;
    const featured = searchParams.get('featured');
    const stock = searchParams.get('stock');

    // Build query
    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    if (stock) {
      query.stock = { $lt: parseInt(stock) };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Execute queries
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort({ [sort]: order })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      products,
      pagination: {
        current: page,
        pages: totalPages,
        total: totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('GET products error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products', error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
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

    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category: category.trim(),
      stock: parseInt(stock),
      images: images || [],
      featured: Boolean(featured)
    });

    const savedProduct = await newProduct.save();

    return NextResponse.json({
      product: savedProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('POST product error:', error);
    return NextResponse.json(
      { message: 'Failed to create product', error: error.message },
      { status: 500 }
    );
  }
}
