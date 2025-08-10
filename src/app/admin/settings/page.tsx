'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'E-Shop Store',
    storeDescription: 'Your one-stop shop for amazing products',
    currency: 'USD',
    taxRate: 10,
    shippingRate: 9.99,
    freeShippingThreshold: 50,
    enableNotifications: true,
    enableEmailMarketing: true,
    maintenanceMode: false
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setSettings(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (type === 'number') {
      setSettings(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      const notification = document.createElement('div');
      notification.innerHTML = '✅ Settings saved successfully!';
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
      
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
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
                <span>Settings</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
              <p className="text-gray-600 mt-1">Configure your e-commerce store preferences</p>
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Store Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Store Information</h2>
                
                <div>
                  <label htmlFor="storeName" className="block text-sm font-semibold text-gray-900 mb-2">
                    Store Name
                  </label>
                  <input
                    type="text"
                    id="storeName"
                    name="storeName"
                    value={settings.storeName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="storeDescription" className="block text-sm font-semibold text-gray-900 mb-2">
                    Store Description
                  </label>
                  <textarea
                    id="storeDescription"
                    name="storeDescription"
                    value={settings.storeDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="currency" className="block text-sm font-semibold text-gray-900 mb-2">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={settings.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Shipping */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Pricing & Shipping</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="taxRate" className="block text-sm font-semibold text-gray-900 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      id="taxRate"
                      name="taxRate"
                      value={settings.taxRate}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="shippingRate" className="block text-sm font-semibold text-gray-900 mb-2">
                      Shipping Rate ($)
                    </label>
                    <input
                      type="number"
                      id="shippingRate"
                      name="shippingRate"
                      value={settings.shippingRate}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="freeShippingThreshold" className="block text-sm font-semibold text-gray-900 mb-2">
                    Free Shipping Threshold ($)
                  </label>
                  <input
                    type="number"
                    id="freeShippingThreshold"
                    name="freeShippingThreshold"
                    value={settings.freeShippingThreshold}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900"
                  />
                  <p className="text-sm text-gray-500 mt-1">Orders above this amount will have free shipping</p>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                    <p className="text-sm text-gray-600">Receive notifications about orders and updates</p>
                  </div>
                  <input
                    type="checkbox"
                    id="enableNotifications"
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900">Email Marketing</h3>
                    <p className="text-sm text-gray-600">Send promotional emails to customers</p>
                  </div>
                  <input
                    type="checkbox"
                    id="enableEmailMarketing"
                    name="enableEmailMarketing"
                    checked={settings.enableEmailMarketing}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border-2 border-red-200 rounded-xl bg-red-50">
                  <div>
                    <h3 className="font-semibold text-red-900">Maintenance Mode</h3>
                    <p className="text-sm text-red-600">Temporarily disable the store for maintenance</p>
                  </div>
                  <input
                    type="checkbox"
                    id="maintenanceMode"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 pt-8 border-t border-gray-200 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  isSaving
                    ? 'bg-blue-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                }`}
              >
                {isSaving ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <span>💾 Save Settings</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
