import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/product/AddToCartButton';
import { notFound } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  featured: boolean;
  createdAt: string;
}

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

// Server-side data fetching for individual product
async function getProduct(id: string): Promise<Product | null> {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      next: { revalidate: 60 },
      cache: 'no-store'
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link href="/products" className="text-blue-600 hover:text-blue-800">
              Products
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-gray-500">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-2xl overflow-hidden bg-white shadow-lg">
              {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.featured && (
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg">
                    ⭐ Featured Product
                  </div>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <div className="bg-orange-500 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg">
                    Only {product.stock} Left!
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Product Description */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Features */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">High Quality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">Fast Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">30-Day Return</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">1 Year Warranty</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <AddToCartButton product={product} />
                
                <div className="flex space-x-4">
                  <button className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    💝 Add to Wishlist
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    📤 Share
                  </button>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">SKU:</span>
                  <span className="ml-2 text-gray-600">{product._id.slice(-8).toUpperCase()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="ml-2 text-gray-600">{product.category}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Stock:</span>
                  <span className="ml-2 text-gray-600">{product.stock} units</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Status:</span>
                  <span className={`ml-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="text-center py-8 bg-gray-100 rounded-lg">
            <p className="text-gray-500">Related products will be shown here</p>
            <Link 
              href="/products"
              className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
            >
              Browse All Products →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: 'Product Not Found - E-Shop',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} - E-Shop | Best Deals`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}
