// src/app/profile/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { User, Package, Settings, Clock } from 'lucide-react';
import OrderHistory from '@/components/profile/OrderHistory';
import ProfileSettings from '@/components/profile/ProfileSettings';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) redirect('/auth/signin');

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/orders/user');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'settings', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {session.user?.name || session.user?.email}
              </h1>
              <p className="text-gray-600">Manage your account and view your orders</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6">
              {activeTab === 'orders' && (
                <OrderHistory orders={orders} loading={loading} />
              )}
              {activeTab === 'settings' && (
                <ProfileSettings user={session.user} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
