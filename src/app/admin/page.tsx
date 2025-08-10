import Link from 'next/link';

// Get dashboard stats
async function getDashboardStats() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';

  try {
    const [productsRes, ordersRes] = await Promise.all([
      fetch(`${baseUrl}/api/products`, { next: { revalidate: 300 } }),
      fetch(`${baseUrl}/api/orders`, { next: { revalidate: 300 } })
    ]);

    const productsData = productsRes.ok ? await productsRes.json() : { products: [], pagination: { total: 0 } };
    const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };

    return {
      totalProducts: productsData.pagination?.total || 0,
      totalOrders: ordersData.orders?.length || 0,
      lowStockProducts: productsData.products?.filter((p: any) => p.stock < 10).length || 0,
      featuredProducts: productsData.products?.filter((p: any) => p.featured).length || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalProducts: 0,
      totalOrders: 0,
      lowStockProducts: 0,
      featuredProducts: 0
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your e-commerce store</p>
            </div>
            <Link 
              href="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Store
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/admin/products" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Manage Products →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/admin/orders" className="text-green-600 hover:text-green-800 text-sm font-medium">
                View Orders →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.lowStockProducts}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/admin/products?filter=low-stock" className="text-orange-600 hover:text-orange-800 text-sm font-medium">
                Check Inventory →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.featuredProducts}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/admin/products?filter=featured" className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                Manage Featured →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Management */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Product Management</h3>
                <p className="text-gray-600">Create, edit, and manage your product catalog</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link 
                href="/admin/products/new"
                className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                ➕ Add New Product
              </Link>
              
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="/admin/products"
                  className="block bg-gray-100 text-gray-700 text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  📦 All Products
                </Link>
                <Link 
                  href="/admin/categories"
                  className="block bg-gray-100 text-gray-700 text-center py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  🏷️ Categories
                </Link>
              </div>
            </div>
          </div>

          {/* Order Management */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border">
            <div className="flex items-center mb-6">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Management</h3>
                <p className="text-gray-600">Track and manage customer orders</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link 
                href="/admin/orders"
                className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                📋 View All Orders
              </Link>
              
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  href="/admin/orders?status=pending"
                  className="block bg-yellow-100 text-yellow-700 text-center py-3 px-4 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
                >
                  ⏳ Pending
                </Link>
                <Link 
                  href="/admin/orders?status=shipped"
                  className="block bg-blue-100 text-blue-700 text-center py-3 px-4 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                >
                  🚚 Shipped
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/admin/analytics"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Analytics</h4>
                <p className="text-sm text-gray-600">View sales reports</p>
              </div>
            </Link>

            <Link 
              href="/admin/settings"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-gray-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Settings</h4>
                <p className="text-sm text-gray-600">Store configuration</p>
              </div>
            </Link>

            <Link 
              href="/admin/users"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="bg-pink-100 p-2 rounded-lg mr-3">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Users</h4>
                <p className="text-sm text-gray-600">Manage customers</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata
export const metadata = {
  title: 'Admin Dashboard - E-Shop',
  description: 'Manage your e-commerce store - products, orders, and analytics',
};
