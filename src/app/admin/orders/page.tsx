import Link from 'next/link';
import AdminOrderActions from '@/components/admin/AdminOrderActions';

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  total: number;
  createdAt: string;
}

interface AdminOrdersPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
}

async function getOrders(searchParams: any) {
  const params = new URLSearchParams();
  params.append('admin', 'true');
  
  if (searchParams.page) params.append('page', searchParams.page);
  if (searchParams.status) params.append('status', searchParams.status);

  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/orders?${params}`, {
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch orders');
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { orders: [], pagination: { current: 1, pages: 1, total: 0 } };
  }
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const resolvedSearchParams = await searchParams;
  const { orders, pagination } = await getOrders(resolvedSearchParams);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Link href="/admin" className="hover:text-blue-600">Admin</Link>
                <span>/</span>
                <span>Orders</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600 mt-1">Manage customer orders and fulfillment</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/orders"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !resolvedSearchParams.status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders ({pagination.total})
            </Link>
            {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <Link
                key={status}
                href={`/admin/orders?status=${status}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${
                  resolvedSearchParams.status === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </Link>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border text-center">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">No orders match the current filter.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Order</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Customer</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Items</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Total</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order: Order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div>
                          <h4 className="font-semibold text-gray-900">{order.orderNumber}</h4>
                          <p className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <h4 className="font-medium text-gray-900">{order.user.name}</h4>
                          <p className="text-sm text-gray-600">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, index) => (
                            <p key={index} className="text-sm text-gray-600">
                              {item.quantity}x {item.name}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{order.items.length - 2} more
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                          <span className={`block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.paymentStatus)}`}>
                            Payment: {order.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">${order.total.toFixed(2)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <AdminOrderActions order={order} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {orders.map((order: Order) => (
                <div key={order._id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{order.orderNumber}</h4>
                      <p className="text-sm text-gray-600">{order.user.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <AdminOrderActions order={order} />
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
                  href={`/admin/orders?page=${pagination.current - 1}${resolvedSearchParams.status ? `&status=${resolvedSearchParams.status}` : ''}`}
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
                  href={`/admin/orders?page=${pagination.current + 1}${resolvedSearchParams.status ? `&status=${resolvedSearchParams.status}` : ''}`}
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

export const metadata = {
  title: 'Order Management - Admin Dashboard',
  description: 'Manage customer orders and fulfillment',
};
