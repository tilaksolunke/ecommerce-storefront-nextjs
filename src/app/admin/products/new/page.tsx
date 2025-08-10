import ProductForm from '@/components/admin/ProductForm';

export default function AddProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <a href="/admin" className="hover:text-blue-600">Admin</a>
            <span>/</span>
            <a href="/admin/products" className="hover:text-blue-600">Products</a>
            <span>/</span>
            <span>Add Product</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">Create a new product for your catalog</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Add Product - Admin Dashboard',
  description: 'Add a new product to your e-commerce catalog',
};
