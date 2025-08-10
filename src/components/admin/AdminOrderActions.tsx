'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Order {
  _id: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
}

interface AdminOrderActionsProps {
  order: Order;
}

export default function AdminOrderActions({ order }: AdminOrderActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/orders/${order._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderStatus: newStatus
        }),
      });

      if (response.ok) {
        showSuccessMessage(`Order status updated to ${newStatus}`);
        window.location.reload();
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      console.error('Update error:', error);
      showErrorMessage('Failed to update order status');
    } finally {
      setIsUpdating(false);
      setShowStatusModal(false);
    }
  };

  const showSuccessMessage = (message: string) => {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transition-all duration-300';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  const showErrorMessage = (message: string) => {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] transition-all duration-300';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        {/* View Order Details */}
        <Link
          href={`/admin/orders/${order._id}`}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>

        {/* Update Status */}
        <button
          onClick={() => setShowStatusModal(true)}
          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          title="Update Status"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Update Order Status</h3>
              <p className="text-gray-600 mb-6">
                Order: <strong>{order.orderNumber}</strong>
              </p>
              
              <div className="space-y-3">
                {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(status)}
                    disabled={isUpdating}
                    className={`w-full px-4 py-3 rounded-lg font-medium transition-colors capitalize ${
                      order.orderStatus === status
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                    } disabled:opacity-50`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowStatusModal(false)}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
