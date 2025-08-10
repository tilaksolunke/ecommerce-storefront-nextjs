import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

const sampleProducts = [
  {
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.",
    price: 299.99,
    category: "Electronics",
    stock: 25,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"],
    featured: true
  },
  {
    name: "Smartphone Pro Max",
    description: "Latest flagship smartphone with advanced camera system, all-day battery, and lightning-fast performance. Available in multiple colors.",
    price: 999.99,
    category: "Electronics",
    stock: 15,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop"],
    featured: true
  },
  {
    name: "Designer Running Shoes",
    description: "Comfortable and stylish running shoes with advanced cushioning technology. Perfect for daily workouts and casual wear.",
    price: 129.99,
    category: "Clothing",
    stock: 40,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"],
    featured: false
  },
  {
    name: "Coffee Table Book - Photography",
    description: "Beautiful coffee table book featuring stunning landscape photography from around the world. Hardcover with premium paper quality.",
    price: 45.99,
    category: "Books",
    stock: 30,
    images: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop"],
    featured: false
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking with heart rate monitoring, GPS, water resistance, and 7-day battery life. Track your health goals.",
    price: 249.99,
    category: "Electronics",
    stock: 20,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"],
    featured: true
  },
  {
    name: "Leather Backpack",
    description: "Premium leather backpack with laptop compartment, multiple pockets, and comfortable straps. Perfect for work or travel.",
    price: 179.99,
    category: "Clothing",
    stock: 12,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"],
    featured: false
  },
  {
    name: "Indoor Plant Collection",
    description: "Set of 3 beautiful indoor plants including snake plant, pothos, and peace lily. Perfect for home decoration and air purification.",
    price: 89.99,
    category: "Home & Garden",
    stock: 18,
    images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=500&fit=crop"],
    featured: false
  },
  {
    name: "Professional Camera Lens",
    description: "High-quality 50mm prime lens for professional photography. Sharp images with beautiful bokeh effect. Compatible with most cameras.",
    price: 399.99,
    category: "Electronics",
    stock: 8,
    images: ["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=500&fit=crop"],
    featured: false
  }
];

export async function POST() {
  try {
    await connectDB();
    
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    
    return NextResponse.json({
      message: `Successfully seeded ${products.length} products!`,
      products
    });
  } catch (error) {
    console.error('Seed products error:', error);
    return NextResponse.json(
      { message: 'Failed to seed products' },
      { status: 500 }
    );
  }
}
