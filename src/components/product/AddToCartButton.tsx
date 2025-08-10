// 'use client';

// import { useState } from 'react';

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   stock: number;
//   images: string[];
// }

// interface AddToCartButtonProps {
//   product: Product;
// }

// export default function AddToCartButton({ product }: AddToCartButtonProps) {
//   const [quantity, setQuantity] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);

//   const handleAddToCart = async () => {
//     if (product.stock === 0) return;
    
//     setIsAdding(true);
    
//     try {
//       // Check if we're in the browser
//       if (typeof window === 'undefined') {
//         throw new Error('Not in browser environment');
//       }

//       // Get existing cart from localStorage with proper validation
//       let cart: any[] = []; // Explicitly type as array
      
//       try {
//         const existingCart = localStorage.getItem('cart');
//         if (existingCart) {
//           const parsedCart = JSON.parse(existingCart);
//           // Ensure it's an array, if not, start with empty array
//           cart = Array.isArray(parsedCart) ? parsedCart : [];
//         }
//       } catch (parseError) {
//         console.warn('Error parsing cart from localStorage:', parseError);
//         cart = []; // Reset to empty array on parse error
//       }
      
//       // Now cart is guaranteed to be an array
//       const existingItemIndex = cart.findIndex((item: any) => item.id === product._id);
      
//       if (existingItemIndex >= 0) {
//         // Update quantity if product exists
//         cart[existingItemIndex].quantity += quantity;
//       } else {
//         // Add new item to cart
//         cart.push({
//           id: product._id,
//           name: product.name,
//           price: product.price,
//           quantity: quantity,
//           image: product.images && product.images.length > 0 ? product.images[0] : '',
//           stock: product.stock
//         });
//       }
      
//       // Save updated cart to localStorage
//       localStorage.setItem('cart', JSON.stringify(cart));
      
//       // Show success message
//       showSuccessMessage(`✅ Added ${quantity} ${product.name}(s) to cart!`);
      
//       // Trigger cart update event for header cart count
//       window.dispatchEvent(new Event('cartUpdated'));
      
//     } catch (error) {
//       console.error('Add to cart error:', error);
//       showErrorMessage('❌ Failed to add item to cart. Please try again.');
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   // Success notification function
//   const showSuccessMessage = (message: string) => {
//     const notification = document.createElement('div');
//     notification.innerHTML = message;
//     notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
//     notification.style.zIndex = '9999';
//     document.body.appendChild(notification);
    
//     setTimeout(() => {
//       notification.style.opacity = '0';
//       setTimeout(() => {
//         if (document.body.contains(notification)) {
//           document.body.removeChild(notification);
//         }
//       }, 300);
//     }, 3000);
//   };

//   // Error notification function
//   const showErrorMessage = (message: string) => {
//     const notification = document.createElement('div');
//     notification.innerHTML = message;
//     notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
//     notification.style.zIndex = '9999';
//     document.body.appendChild(notification);
    
//     setTimeout(() => {
//       notification.style.opacity = '0';
//       setTimeout(() => {
//         if (document.body.contains(notification)) {
//           document.body.removeChild(notification);
//         }
//       }, 300);
//     }, 3000);
//   };

//   const maxQuantity = Math.min(product.stock, 10);

//   return (
//     <div className="space-y-4">
//       {/* Quantity Selector */}
//       <div className="flex items-center space-x-4">
//         <span className="text-sm font-medium text-gray-700">Quantity:</span>
//         <div className="flex items-center border border-gray-300 rounded-lg">
//           <button
//             onClick={() => setQuantity(Math.max(1, quantity - 1))}
//             disabled={quantity <= 1}
//             className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             −
//           </button>
//           <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">
//             {quantity}
//           </span>
//           <button
//             onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
//             disabled={quantity >= maxQuantity}
//             className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             +
//           </button>
//         </div>
//         <span className="text-sm text-gray-500">
//           (Max: {maxQuantity})
//         </span>
//       </div>

//       {/* Add to Cart Button */}
//       <button
//         onClick={handleAddToCart}
//         disabled={product.stock === 0 || isAdding}
//         className={`w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
//           product.stock === 0
//             ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             : isAdding
//             ? 'bg-blue-400 text-white cursor-wait'
//             : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
//         }`}
//       >
//         {product.stock === 0 
//           ? '❌ Out of Stock' 
//           : isAdding 
//           ? '⏳ Adding to Cart...' 
//           : '🛒 Add to Cart'
//         }
//       </button>

//       {/* Total Price Display */}
//       <div className="bg-gray-50 rounded-lg p-4">
//         <div className="flex justify-between items-center">
//           <span className="text-gray-700 font-medium">Total:</span>
//           <span className="text-2xl font-bold text-blue-600">
//             ${(product.price * quantity).toFixed(2)}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/components/products/AddToCartButton.tsx
'use client';
import { useCart } from '@/contexts/CartContext';

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
    stock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { state, dispatch } = useCart();

  const handleAddToCart = () => {
    console.log('🛒 Button clicked, product data:', product);
    
    // Validate product data
    if (!product || !product._id) {
      console.error('❌ Invalid product data:', product);
      alert('Error: Product data is invalid');
      return;
    }

    // Create cart item
    const cartItem = {
      _id: product._id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.images?.[0] || '/placeholder.jpg',
      stock: Number(product.stock) || 1
    };

    console.log('🛒 Adding cart item:', cartItem);

    // Dispatch to cart
    dispatch({ 
      type: 'ADD_ITEM', 
      payload: cartItem
    });

    console.log('🛒 Current cart state after dispatch:', state);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
      disabled={product.stock === 0}
    >
      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
    </button>
  );
}
