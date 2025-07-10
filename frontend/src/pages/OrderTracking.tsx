import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, CheckCircle, Truck, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockOrders } from '@/data/mockData';
import { Order } from '@/types';

const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (id) {
      // In a real app, fetch order by ID
      const foundOrder = mockOrders.find(o => o.id === id) || {
        ...mockOrders[0],
        id: id
      };
      setOrder(foundOrder);
    }

    // Update current time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/orders">View All Orders</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'preparing': return 75;
      case 'out_for_delivery': return 90;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'out_for_delivery': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Order Received';
      case 'confirmed': return 'Order Confirmed';
      case 'preparing': return 'Preparing Your Order';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return 'Unknown Status';
    }
  };

  const estimatedDelivery = new Date(order.estimatedDeliveryTime);
  const timeRemaining = Math.max(0, estimatedDelivery.getTime() - currentTime.getTime());
  const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/orders">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id.slice(-6)}</h1>
              <p className="text-gray-600">From {order.restaurant.name}</p>
            </div>
          </div>
          <Badge className={getStatusColor(order.status)}>
            {getStatusText(order.status)}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <Progress value={getStatusProgress(order.status)} className="h-2" />
                    <div className="flex justify-between mt-2 text-sm text-gray-600">
                      <span>Order Placed</span>
                      <span>Delivered</span>
                    </div>
                  </div>

                  {/* Status Steps */}
                  <div className="space-y-4">
                    {[
                      { status: 'pending', icon: CheckCircle, label: 'Order Received', time: '2 min ago' },
                      { status: 'confirmed', icon: CheckCircle, label: 'Order Confirmed', time: '1 min ago' },
                      { status: 'preparing', icon: ChefHat, label: 'Preparing Your Order', time: 'Now' },
                      { status: 'out_for_delivery', icon: Truck, label: 'Out for Delivery', time: '' },
                      { status: 'delivered', icon: CheckCircle, label: 'Delivered', time: '' }
                    ].map((step, index) => {
                      const isCompleted = getStatusProgress(order.status) > index * 25;
                      const isCurrent = order.status === step.status;
                      const Icon = step.icon;

                      return (
                        <div key={step.status} className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted || isCurrent 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className={`font-medium ${isCurrent ? 'text-green-600' : ''}`}>
                              {step.label}
                            </div>
                            {step.time && (
                              <div className="text-sm text-gray-500">{step.time}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Estimated Delivery */}
                  {order.status !== 'delivered' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center text-blue-800">
                        <Clock className="h-5 w-5 mr-2" />
                        <div>
                          <div className="font-medium">
                            {minutesRemaining > 0 
                              ? `Estimated delivery in ${minutesRemaining} minutes`
                              : 'Arriving soon!'
                            }
                          </div>
                          <div className="text-sm">
                            Expected by {estimatedDelivery.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Driver Information */}
            {order.status === 'out_for_delivery' && order.trackingInfo && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Delivery Driver</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {order.trackingInfo.driverName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{order.trackingInfo.driverName}</div>
                        <div className="text-sm text-gray-600">Delivery Driver</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{item.menuItem.name}</div>
                        <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                        {item.specialInstructions && (
                          <div className="text-sm text-gray-600">
                            Note: {item.specialInstructions}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="font-medium">{order.deliveryAddress.label}</div>
                  <div className="text-gray-600">
                    {order.deliveryAddress.street}<br />
                    {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${order.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                Get Help
              </Button>
              {order.status === 'delivered' && (
                <Button className="w-full">
                  Rate & Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;