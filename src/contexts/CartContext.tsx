// src/contexts/CartContext.tsx
'use client';
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  // Fix: Handle payload safely for different action types
  console.log('🔄 Cart reducer called with action:', action.type, 
    'payload' in action ? action.payload : 'no payload'); // Fixed debug log
  
  switch (action.type) {
    case 'ADD_ITEM': {
      console.log('➕ Adding item:', action.payload); // Debug log
      
      if (!action.payload._id) {
        console.error('❌ Cannot add item without _id:', action.payload);
        return state;
      }
      
      const existingItem = state.items.find(item => item._id === action.payload._id);
      let newItems;
      
      if (existingItem) {
        console.log('📦 Item already exists, updating quantity'); // Debug log
        newItems = state.items.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item
        );
      } else {
        console.log('🆕 Adding new item to cart'); // Debug log
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const newState = {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
      
      console.log('✅ New cart state:', newState); // Debug log
      return newState;
    }
    
    case 'UPDATE_QUANTITY': {
      console.log('🔄 Updating quantity:', action.payload); // Debug log
      const newItems = state.items.map(item =>
        item._id === action.payload.id
          ? { ...item, quantity: Math.min(Math.max(action.payload.quantity, 0), item.stock) }
          : item
      ).filter(item => item.quantity > 0);
      
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case 'REMOVE_ITEM': {
      console.log('🗑️ Removing item:', action.payload); // Debug log
      const newItems = state.items.filter(item => item._id !== action.payload);
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    case 'CLEAR_CART':
      console.log('🗑️ Clearing cart'); // Debug log - no payload to log
      return { items: [], total: 0, itemCount: 0 };
      
    case 'LOAD_CART': {
      console.log('📥 Loading cart from storage:', action.payload); // Debug log
      return {
        items: action.payload,
        total: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0)
      };
    }
    
    default:
      console.log('❓ Unknown action type'); // Debug log
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: { items: [], total: 0, itemCount: 0 },
  dispatch: () => null
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('🚀 CartProvider mounting, loading cart from localStorage'); // Debug log
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        console.log('📦 Found saved cart:', cartData); // Debug log
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('❌ Error loading cart:', error);
        localStorage.removeItem('cart'); // Clear corrupted data
      }
    } else {
      console.log('📭 No saved cart found'); // Debug log
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log('💾 Saving cart to localStorage:', state.items); // Debug log
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
