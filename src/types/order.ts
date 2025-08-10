// src/types/order.ts
export interface OrderItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    images?: string[];
  } | null;
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

export interface OrderDocument {
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
