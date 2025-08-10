import ProductForm from '@/components/admin/ProductForm';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  featured: boolean;
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

// Fetch product data for editing
async function getProduct(id: string): Promise<Product | null> {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/products/${id}`, {
      cache: 'no-store' // Always get fresh data for editing
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

export default async function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're trying to edit doesn't exist.</p>
          <a 
            href="/admin/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Back to Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <a href="/admin" className="hover:text-blue-600">Admin</a>
            <span>/</span>
            <a href="/admin/products" className="hover:text-blue-600">Products</a>
            <span>/</span>
            <span>Edit Product</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">Update product information</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProductForm product={product} />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Edit Product - Admin Dashboard',
  description: 'Edit product information in your e-commerce catalog',
};
