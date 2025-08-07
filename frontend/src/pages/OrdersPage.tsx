import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { Order } from '../types';
import { Clock, MapPin, Star, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const OrdersPage: React.FC = () => {
  const { user } = useAuthContext();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getOrders();
        // Validate and filter orders
        const validOrders = response.data.filter(
          (order: Order) => order.id && typeof order.id === 'string'
        );
        setOrders(validOrders);
        if (validOrders.length !== response.data.length) {
          console.warn('Some orders were filtered out due to missing or invalid id');
        }
      } catch (err) {
        setError('Failed to fetch orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed':
      case 'preparing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'ready':
      case 'picked_up':
      case 'out_for_delivery':
        return <Truck className="h-5 w-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
      case 'picked_up':
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">
            You haven't placed any orders yet. Start exploring our amazing restaurants!
          </p>
          <Link to="/restaurants">
            <Button size="lg">Browse Restaurants</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">Track your current and past orders</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id || `order-${order.createdAt}`} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id ? order.id.slice(-8) : 'N/A'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {formatStatus(order.status)}
                  </span>
                </div>

                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src="https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=100"
                    alt={order.restaurant?.name || 'Restaurant'}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {order.restaurant?.name || 'Unknown Restaurant'}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {order.restaurant?.address?.street
                          ? `${order.restaurant.address.street}, ${order.restaurant.address.city}`
                          : 'Address not available'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600">{item.quantity}x</span>
                          <span className="text-sm font-medium text-gray-900">
                            {item.menuItem?.name || 'Unknown Item'}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-orange-600">
                      ৳{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {order.status === 'out_for_delivery' && (
                  <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2 text-orange-800">
                      <Truck className="h-5 w-5" />
                      <span className="font-medium">Out for delivery</span>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      Estimated delivery: {order.estimatedDeliveryTime || 'Not available'}
                    </p>
                    {order.deliveryAgent && (
                      <p className="text-sm text-orange-700">
                        Delivery agent: {order.deliveryAgent.name || 'Unknown'} -{' '}
                        {order.deliveryAgent.phone || 'Not available'}
                      </p>
                    )}
                  </div>
                )}

                {order.status === 'delivered' && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Delivered successfully</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Star className="h-4 w-4 mr-1" />
                      Rate Order
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
