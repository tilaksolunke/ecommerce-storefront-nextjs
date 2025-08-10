'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  featured: boolean;
}

interface ProductFormProps {
  product?: Product;
}

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Beauty',
  'Automotive',
  'Toys'
];

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    stock: product?.stock || 0,
    images: product?.images || [''],
    featured: product?.featured || false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.stock < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    if (formData.images.every(img => !img.trim())) {
      newErrors.images = 'At least one image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const filteredImages = formData.images.filter(img => img.trim());
      
      const productData = {
        ...formData,
        images: filteredImages
      };

      const url = isEditing 
        ? `/api/products/${product._id}`
        : '/api/products';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (response.ok) {
        showSuccessMessage(
          isEditing 
            ? `✅ Product "${formData.name}" updated successfully!`
            : `✅ Product "${formData.name}" created successfully!`
        );
        
        // Redirect to products list after short delay
        setTimeout(() => {
          router.push('/admin/products');
        }, 1500);
      } else {
        throw new Error(result.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showErrorMessage('❌ Failed to save product. Please try again.');
    } finally {
      setIsSubmitting(false);
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
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              } text-gray-900 placeholder-gray-500`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              } text-gray-900 placeholder-gray-500`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                  errors.price ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                } text-gray-900 placeholder-gray-500`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-semibold text-gray-900 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                  errors.stock ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                } text-gray-900 placeholder-gray-500`}
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all ${
                errors.category ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              } text-gray-900`}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-900">
              Featured Product
            </label>
          </div>
        </div>

        {/* Right Column - Images */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Product Images *
            </label>
            
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder={`Image URL ${index + 1}`}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
                  />
                  
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="px-3 py-2 text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
              
              <button
                type="button"
                onClick={addImageField}
                className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                + Add Another Image
              </button>
              
              {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
            </div>
          </div>

          {/* Image Preview */}
          {formData.images.some(img => img.trim()) && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Image Preview
              </label>
              <div className="grid grid-cols-2 gap-4">
                {formData.images
                  .filter(img => img.trim())
                  .slice(0, 4)
                  .map((image, index) => (
                    <div key={index} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        fill
                        sizes="200px"
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-8 border-t mt-8">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-8 py-3 rounded-xl font-semibold transition-all ${
            isSubmitting
              ? 'bg-blue-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
            </div>
          ) : (
            <span>{isEditing ? '✏️ Update Product' : '➕ Create Product'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
