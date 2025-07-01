import { Restaurant, MenuItem, Order, Review } from '@/types';

export const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Giuseppe\'s Italian Kitchen',
    description: 'Authentic Italian cuisine with fresh ingredients and traditional recipes',
    cuisine: ['Italian', 'Pizza', 'Pasta'],
    rating: 4.7,
    reviewCount: 1247,
    deliveryTime: '25-35 min',
    deliveryFee: 2.99,
    minimumOrder: 15,
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    coverImage: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg',
    isOpen: true,
    priceRange: '$$',
    location: {
      address: '123 Little Italy St, New York, NY 10013',
      latitude: 40.7190,
      longitude: -74.0049
    }
  },
  {
    id: '2',
    name: 'Sakura Sushi Bar',
    description: 'Premium Japanese sushi and sashimi prepared by master chefs',
    cuisine: ['Japanese', 'Sushi', 'Asian'],
    rating: 4.9,
    reviewCount: 892,
    deliveryTime: '35-45 min',
    deliveryFee: 3.99,
    minimumOrder: 25,
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg',
    coverImage: 'https://images.pexels.com/photos/1148086/pexels-photo-1148086.jpeg',
    isOpen: true,
    priceRange: '$$$',
    location: {
      address: '456 Sushi Lane, New York, NY 10001',
      latitude: 40.7505,
      longitude: -73.9934
    }
  },
  {
    id: '3',
    name: 'Burger Palace',
    description: 'Gourmet burgers made with locally sourced beef and fresh toppings',
    cuisine: ['American', 'Burgers', 'Fast Food'],
    rating: 4.4,
    reviewCount: 2156,
    deliveryTime: '15-25 min',
    deliveryFee: 1.99,
    minimumOrder: 12,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    coverImage: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
    isOpen: true,
    priceRange: '$$',
    location: {
      address: '789 Burger Ave, New York, NY 10016',
      latitude: 40.7549,
      longitude: -73.9840
    }
  },
  {
    id: '4',
    name: 'Spice Garden',
    description: 'Authentic Indian flavors with aromatic spices and traditional cooking methods',
    cuisine: ['Indian', 'Curry', 'Vegetarian'],
    rating: 4.6,
    reviewCount: 743,
    deliveryTime: '30-40 min',
    deliveryFee: 2.49,
    minimumOrder: 18,
    image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg',
    coverImage: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    isOpen: true,
    priceRange: '$$',
    location: {
      address: '321 Curry Street, New York, NY 10019',
      latitude: 40.7614,
      longitude: -73.9776
    }
  },
  {
    id: '5',
    name: 'Taco Libre',
    description: 'Fresh Mexican street food with house-made salsas and authentic flavors',
    cuisine: ['Mexican', 'Tacos', 'Street Food'],
    rating: 4.5,
    reviewCount: 1578,
    deliveryTime: '20-30 min',
    deliveryFee: 2.99,
    minimumOrder: 15,
    image: 'https://images.pexels.com/photos/2955819/pexels-photo-2955819.jpeg',
    coverImage: 'https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg',
    isOpen: false,
    priceRange: '$',
    location: {
      address: '654 Taco Boulevard, New York, NY 10025',
      latitude: 40.7831,
      longitude: -73.9712
    }
  },
  {
    id: '6',
    name: 'Green Bowl',
    description: 'Healthy bowls, salads, and smoothies made with organic ingredients',
    cuisine: ['Healthy', 'Salads', 'Vegetarian', 'Vegan'],
    rating: 4.3,
    reviewCount: 654,
    deliveryTime: '20-30 min',
    deliveryFee: 1.99,
    minimumOrder: 12,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    coverImage: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg',
    isOpen: true,
    priceRange: '$$',
    location: {
      address: '987 Health Way, New York, NY 10014',
      latitude: 40.7357,
      longitude: -74.0014
    }
  }
];

export const mockMenuItems: MenuItem[] = [
  // Giuseppe's Italian Kitchen
  {
    id: '1',
    restaurantId: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
    price: 16.99,
    image: 'https://images.pexels.com/photos/365459/pexels-photo-365459.jpeg',
    category: 'Pizza',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Spaghetti Carbonara',
    description: 'Traditional pasta with eggs, pancetta, parmesan, and black pepper',
    price: 18.99,
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    category: 'Pasta',
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    id: '3',
    restaurantId: '1',
    name: 'Caesar Salad',
    description: 'Crispy romaine lettuce with parmesan, croutons, and caesar dressing',
    price: 12.99,
    image: 'https://images.pexels.com/photos/2116094/pexels-photo-2116094.jpeg',
    category: 'Salads',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: false
  },
  // Sakura Sushi Bar
  {
    id: '4',
    restaurantId: '2',
    name: 'Salmon Nigiri Set',
    description: 'Fresh salmon nigiri (8 pieces) with wasabi and pickled ginger',
    price: 24.99,
    image: 'https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg',
    category: 'Nigiri',
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true
  },
  {
    id: '5',
    restaurantId: '2',
    name: 'Dragon Roll',
    description: 'Eel and cucumber inside, avocado and eel sauce on top',
    price: 16.99,
    image: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg',
    category: 'Specialty Rolls',
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true
  },
  // Burger Palace
  {
    id: '6',
    restaurantId: '3',
    name: 'Classic Cheeseburger',
    description: 'Angus beef patty with cheddar cheese, lettuce, tomato, and special sauce',
    price: 14.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    category: 'Burgers',
    isAvailable: true,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false
  },
  {
    id: '7',
    restaurantId: '3',
    name: 'Truffle Fries',
    description: 'Crispy fries with truffle oil, parmesan, and fresh herbs',
    price: 8.99,
    image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
    category: 'Sides',
    isAvailable: true,
    isVegetarian: true,
    isVegan: false,
    isGlutenFree: true
  }
];

export const mockOrders: Order[] = [
  {
    id: 'order_1',
    userId: '1',
    restaurantId: '1',
    restaurant: mockRestaurants[0],
    items: [
      {
        menuItem: mockMenuItems[0],
        quantity: 2,
        customizations: {},
        specialInstructions: 'Extra cheese please'
      }
    ],
    subtotal: 33.98,
    deliveryFee: 2.99,
    tax: 3.40,
    discount: 0,
    total: 40.37,
    status: 'out_for_delivery',
    deliveryAddress: {
      id: '1',
      label: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      isDefault: true
    },
    paymentMethod: {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true
    },
    estimatedDeliveryTime: '2024-01-15T19:30:00Z',
    createdAt: '2024-01-15T18:45:00Z',
    trackingInfo: {
      driverName: 'Mike Johnson',
      driverPhone: '+1 234 567 8901',
      driverLocation: {
        latitude: 40.7128,
        longitude: -74.0060
      },
      estimatedArrival: '2024-01-15T19:25:00Z'
    }
  }
];

export const mockReviews: Review[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John D.',
    restaurantId: '1',
    orderId: 'order_1',
    rating: 5,
    comment: 'Absolutely amazing! The pizza was perfectly crispy and the flavors were incredible.',
    createdAt: '2024-01-10T20:30:00Z'
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah M.',
    restaurantId: '1',
    orderId: 'order_2',
    rating: 4,
    comment: 'Great food and fast delivery. The pasta was a bit salty but overall very good.',
    createdAt: '2024-01-08T19:15:00Z'
  }
];