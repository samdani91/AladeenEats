export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses?: Address[];
  role: 'customer' | 'restaurant_owner' | 'delivery_agent';
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisineType: string;
  imageUrl: string;
  rating: number;
  deliveryTime: number;
  minimumOrder: number;
  deliveryFee: number;
  isOpen: boolean;
  address: Address;
  menuItems?: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  restaurantId: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurant: Restaurant;
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: Address;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryTime: string;
  deliveryAgent?: DeliveryAgent;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
  };
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minimumOrder: number;
  validUntil: string;
  isActive: boolean;
}

export interface PaymentMethod {
  id: string;
  user: string;
  stripePaymentMethodId: string;
  cardBrand: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  createdAt?: string;
}