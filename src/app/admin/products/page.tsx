import Link from 'next/link';
import Image from 'next/image';
import AdminProductActions from '@/components/admin/AdminProductActions';

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

interface AdminProductsPageProps {
  searchParams: Promise<{
    page?: string;
    filter?: string;
    search?: string;
  }>;
}

// Fetch products for admin
async function getAdminProducts(searchParams: any) {
  const params = new URLSearchParams();
  
  if (searchParams.page) params.append('page', searchParams.page);
  if (searchParams.search) params.append('search', searchParams.search);
  
  // Apply filters
  if (searchParams.filter === 'low-stock') {
    params.append('stock', '10'); // Products with stock < 10
  } else if (searchParams.filter === 'featured') {
    params.append('featured', 'true');
  }

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/products?${params}`, {
      next: { revalidate: 0 } // No cache for admin
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return { products: [], pagination: { current: 1, pages: 1, total: 0 } };
  }
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const { products, pagination } = await getAdminProducts(resolvedSearchParams);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Link href="/admin" className="hover:text-blue-600">Admin</Link>
                <span>/</span>
                <span>Products</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="text-gray-600 mt-1">Manage your product catalog</p>
            </div>
            <Link 
              href="/admin/products/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              + Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin/products"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !resolvedSearchParams.filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Products ({pagination.total})
              </Link>
              <Link
                href="/admin/products?filter=low-stock"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  resolvedSearchParams.filter === 'low-stock'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Low Stock
              </Link>
              <Link
                href="/admin/products?filter=featured"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  resolvedSearchParams.filter === 'featured'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Featured
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Showing {products.length} of {pagination.total} products
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-6">
              {resolvedSearchParams.filter 
                ? `No products match the current filter.`
                : `Start building your product catalog.`
              }
            </p>
            <Link 
              href="/admin/products/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Product</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Category</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Price</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Stock</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product: Product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">${product.price.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-medium ${
                          product.stock < 10 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          {product.featured && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.stock > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <AdminProductActions product={product} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {products.map((product: Product) => (
                <div key={product._id} className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">${product.price.toFixed(2)} • Stock: {product.stock}</p>
                      <div className="flex items-center space-x-2">
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {product.category}
                        </span>
                        {product.featured && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <AdminProductActions product={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              {pagination.current > 1 && (
                <Link
                  href={`/admin/products?page=${pagination.current - 1}${resolvedSearchParams.filter ? `&filter=${resolvedSearchParams.filter}` : ''}`}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}
              
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Page {pagination.current} of {pagination.pages}
              </span>
              
              {pagination.current < pagination.pages && (
                <Link
                  href={`/admin/products?page=${pagination.current + 1}${resolvedSearchParams.filter ? `&filter=${resolvedSearchParams.filter}` : ''}`}
                  className="px-3 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Generate metadata
export const metadata = {
  title: 'Product Management - Admin Dashboard',
  description: 'Manage your e-commerce product catalog',
};
