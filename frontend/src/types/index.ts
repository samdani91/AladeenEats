export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'customer' | 'restaurantAdmin' | 'superAdmin';
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string[];
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrder: number;
  image: string;
  coverImage: string;
  isOpen: boolean;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'very-hot';
  customizations?: Customization[];
}

export interface Customization {
  id: string;
  name: string;
  options: CustomizationOption[];
  required: boolean;
  maxSelections: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customizations: { [key: string]: string[] };
  specialInstructions?: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurant: Restaurant;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  deliveryAddress: Address;
  paymentMethod: PaymentMethod;
  promoCode?: string;
  estimatedDeliveryTime: string;
  actualDeliveryTime?: string;
  createdAt: string;
  trackingInfo?: TrackingInfo;
}

export interface TrackingInfo {
  driverName: string;
  driverPhone: string;
  driverLocation: {
    latitude: number;
    longitude: number;
  };
  estimatedArrival: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'digital_wallet';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  restaurantId: string;
  orderId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_delivery';
  value: number;
  minimumOrder: number;
  expiresAt: string;
  isActive: boolean;
}