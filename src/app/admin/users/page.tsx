'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Simulate fetching users data
      // In a real app, you'd fetch from your API routes
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'admin',
          status: 'active',
          createdAt: '2024-01-15',
          totalOrders: 0,
          totalSpent: 0
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'user',
          status: 'active',
          createdAt: '2024-02-20',
          totalOrders: 5,
          totalSpent: 1299.95
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          role: 'user',
          status: 'active',
          createdAt: '2024-03-10',
          totalOrders: 2,
          totalSpent: 589.98
        },
        {
          id: '4',
          name: 'Alice Brown',
          email: 'alice.brown@example.com',
          role: 'user',
          status: 'inactive',
          createdAt: '2024-01-05',
          totalOrders: 1,
          totalSpent: 149.99
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role === filter;
  });

  const toggleUserStatus = async (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
    
    // Show success notification
    const notification = document.createElement('div');
    notification.innerHTML = '✅ User status updated successfully!';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
                <span>Users</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">Manage customer accounts and permissions</p>
            </div>
            <Link 
              href="/admin"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setFilter('admin')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'admin'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Admins ({users.filter(u => u.role === 'admin').length})
            </button>
            <button
              onClick={() => setFilter('user')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'user'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Customers ({users.filter(u => u.role === 'user').length})
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Orders</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Total Spent</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Joined</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {user.role === 'admin' ? 'Administrator' : 'Customer'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{user.totalOrders}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">${user.totalSpent.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            user.status === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {user.role === 'admin' ? 'Admin' : 'Customer'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      user.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {user.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Orders</p>
                    <p className="font-semibold text-gray-900">{user.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Spent</p>
                    <p className="font-semibold text-gray-900">${user.totalSpent.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Joined</p>
                    <p className="font-semibold text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
