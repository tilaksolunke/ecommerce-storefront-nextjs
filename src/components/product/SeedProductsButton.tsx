'use client';

import { useState } from 'react';

export default function SeedProductsButton() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSeed = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/seed-products', { method: 'POST' });
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message);
        window.location.reload();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      alert('Failed to seed products');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={isLoading}
      className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
    >
      {isLoading ? '🌱 Adding Products...' : '🌱 Add Sample Products'}
    </button>
  );
}
    