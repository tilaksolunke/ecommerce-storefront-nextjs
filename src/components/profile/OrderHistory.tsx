// src/components/profile/OrderHistory.tsx
'use client';
import { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  _id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    product: { name: string; price: number };
    quantity: number;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface OrderHistoryProps {
  orders: Order[];
  loading: boolean;
}

export default function OrderHistory({ orders, loading }: OrderHistoryProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Package className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
        <a
          href="/products"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order History</h2>
      
      <div className="space-y-4">
        {orders.map((order, index) => (
          <div 
            key={`order-${order._id}-${index}`} // Fixed: Added unique key
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-semibold">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Items: {order.items.length}</p>
                <p className="text-gray-600">
                  Total: <span className="font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</span>
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  Ship to: {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-gray-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                 onClick={() => setSelectedOrder(null)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Order Details #{selectedOrder.orderNumber}
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Items</h4>
                        <div className="space-y-2">
                          {selectedOrder.items.map((item, itemIndex) => (
                            <div key={`modal-item-${itemIndex}`} className="flex justify-between text-sm">
                              <span>{item.product.name} × {item.quantity}</span>
                              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border-t pt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}<br/>
                          {selectedOrder.shippingAddress.address}<br/>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
