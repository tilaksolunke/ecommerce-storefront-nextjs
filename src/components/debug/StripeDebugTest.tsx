// src/components/debug/StripeDebugTest.tsx
'use client';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function StripeDebugTest() {
  const { state, dispatch } = useCart();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestProduct = () => {
    const testProduct = {
      _id: 'test-product-' + Date.now(),
      name: 'Test Product for Stripe',
      price: 29.99,
      image: '/placeholder.jpg',
      stock: 10
    };

    dispatch({
      type: 'ADD_ITEM',
      payload: testProduct
    });

    setTestResults(prev => [...prev, '✅ Test product added to cart']);
  };

  const testStripeCheckout = async () => {
    try {
      setTestResults(prev => [...prev, '🧪 Testing Stripe checkout...']);

      const testData = {
        items: [{
          product: 'test-product-123',
          quantity: 1,
          price: 29.99
        }],
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phone: '1234567890',
          address: '123 Test Street',
          city: 'Test City',
          state: 'TS',
          zipCode: '12345',
          country: 'US'
        }
      };

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      
      if (response.ok) {
        setTestResults(prev => [...prev, '✅ Stripe checkout test successful']);
        setTestResults(prev => [...prev, `Session ID: ${result.sessionId}`]);
      } else {
        setTestResults(prev => [...prev, `❌ Test failed: ${result.error}`]);
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setTestResults(prev => [...prev, `❌ Test error: ${errorMessage}`]);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="p-6 border border-gray-300 rounded-lg m-4 bg-yellow-50">
      <h3 className="text-lg font-bold mb-4 text-yellow-800">Stripe Debug Test Component</h3>
      
      <div className="space-y-3 mb-4">
        <button
          onClick={addTestProduct}
          className="bg-green-600 text-white px-4 py-2 rounded mr-2"
        >
          Add Test Product
        </button>
        
        <button
          onClick={testStripeCheckout}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2"
        >
          Test Stripe API
        </button>
        
        <button
          onClick={clearResults}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear Results
        </button>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold mb-2">Current Cart State:</h4>
        <div className="text-sm bg-white p-3 rounded border">
          <p>Items: {state.items.length}</p>
          <p>Total: ${state.total.toFixed(2)}</p>
          <p>Item Count: {state.itemCount}</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Test Results:</h4>
        <div className="bg-black text-green-400 p-3 rounded font-mono text-sm max-h-64 overflow-y-auto">
          {testResults.length === 0 ? (
            <p>No tests run yet...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index}>{result}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
