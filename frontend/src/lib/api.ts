/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
export const useApiInterceptor = () => {
  const { getAccessTokenSilently } = useAuth0();

  api.interceptors.request.use(
    async (config) => {
      try {
        const token = await getAccessTokenSilently();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting access token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// API functions
export const apiClient = {
  // User endpoints
  getUser: () => api.get('/api/my/user'),
  createUser: (userData: any) => api.post('/api/my/user/', userData),
  updateUser: (userData: any) => api.put('/api/my/user/', userData),

  // Restaurant endpoints
  getRestaurant: (restaurantId: string) => api.get(`/api/restaurant/${restaurantId}`),
  searchRestaurants: (city: string) => api.get(`/api/restaurant/search/${city}`),

  // Promotions
  getPromotions: () => api.get('/api/promotion'),
  createPromotion: (promotionData: any) => api.post('/api/promotion', promotionData),
  updatePromotion: (promotionId: string, promotionData: any) => 
    api.put(`/api/promotion/${promotionId}`, promotionData),
  deletePromotion: (promotionId: string) => api.delete(`/api/promotion/${promotionId}`),

  // Orders
  getOrders: () => api.get('/api/order'),
  createCheckoutSession: (orderData: any) => api.post('/api/order/checkout/create-checkout-session', orderData),

  // Delivery tracking
  getDeliveryAgent: (orderId: string) => api.get(`/api/delivery-agent/${orderId}`),

  // Reviews
  getRestaurantReviews: (restaurantId: string) => api.get(`/api/review/${restaurantId}`),
  createReview: (reviewData: any) => api.post('/api/review', reviewData),

  // Payment methods
  getPaymentMethods: () => api.get('/api/my/payment-method'),
  addPaymentMethod: (paymentData: any) => api.post('/api/my/payment-method', paymentData),
  deletePaymentMethod: (paymentMethodId: string) => 
    api.delete(`/api/my/payment-method/${paymentMethodId}`),

  // Restaurant management
  getRestaurantOrders: () => api.get('/api/my/restaurant/order'),
  updateOrderStatus: (orderId: string, status: any) => 
    api.patch(`/api/my/restaurant/order/${orderId}/status`, status),
  getMyRestaurant: () => api.get('/api/my/restaurant'),
  createMyRestaurant: (restaurantData: FormData) => 
    api.post('/api/my/restaurant', restaurantData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  updateMyRestaurant: (restaurantData: FormData) => 
    api.put('/api/my/restaurant', restaurantData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};