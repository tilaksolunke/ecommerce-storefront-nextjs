// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'customer' | 'admin';
//   address?: {
//     street: string;
//     city: string;
//     zipCode: string;
//     country: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Product {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   category: string;
//   stock: number;
//   images: string[];
//   featured: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CartItem {
//   product: Product;
//   quantity: number;
// }

// export interface Order {
//   _id: string;
//   user: string;
//   items: {
//     product: Product;
//     quantity: number;
//     price: number;
//   }[];
//   totalAmount: number;
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   shippingAddress: {
//     street: string;
//     city: string;
//     zipCode: string;
//     country: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }


// src/types/index.ts
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface OrderItem {
  _id: string;
  product: Product | null;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}
