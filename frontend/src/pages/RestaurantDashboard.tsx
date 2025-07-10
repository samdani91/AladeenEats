import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  BarChart3, 
  Package, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { mockRestaurants, mockMenuItems, mockOrders } from '@/data/mockData';
import { Restaurant, MenuItem, Order } from '@/types';
import { toast } from 'sonner';

const RestaurantDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showAddItemForm, setShowAddItemForm] = useState(false);

  useEffect(() => {
    // Check if user is a restaurant owner
    if (!user || user.role !== 'restaurant') {
      navigate('/');
      return;
    }

    // Mock restaurant data - in real app, fetch based on user ID
    const mockRestaurant = mockRestaurants[0]; // Assume first restaurant belongs to logged-in user
    setRestaurant(mockRestaurant);
    setIsRestaurantOpen(mockRestaurant.isOpen);
    
    // Get menu items for this restaurant
    const restaurantMenuItems = mockMenuItems.filter(item => item.restaurantId === mockRestaurant.id);
    setMenuItems(restaurantMenuItems);
    
    // Get orders for this restaurant
    const restaurantOrders = mockOrders.filter(order => order.restaurantId === mockRestaurant.id);
    setOrders(restaurantOrders);
  }, [user, navigate]);

  const handleToggleRestaurantStatus = () => {
    setIsRestaurantOpen(!isRestaurantOpen);
    if (restaurant) {
      setRestaurant({ ...restaurant, isOpen: !isRestaurantOpen });
    }
    toast.success(`Restaurant ${!isRestaurantOpen ? 'opened' : 'closed'} successfully`);
  };

  const handleToggleItemAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, isAvailable: !item.isAvailable }
        : item
    ));
    toast.success('Item availability updated');
  };

  const handleDeleteItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Menu item deleted');
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'preparing': return 'bg-orange-500';
      case 'out_for_delivery': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'New Order';
      case 'confirmed': return 'Confirmed';
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return 'Unknown';
    }
  };

  if (!user || user.role !== 'restaurant') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need restaurant owner privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant data...</p>
        </div>
      </div>
    );
  }

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
            <p className="text-gray-600 mt-1">{restaurant.name}</p>
          </div>
          
          {/* Restaurant Status Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="restaurant-status" className="text-sm font-medium">
                Restaurant Status
              </Label>
              <Switch
                id="restaurant-status"
                checked={isRestaurantOpen}
                onCheckedChange={handleToggleRestaurantStatus}
              />
              <Badge className={isRestaurantOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {isRestaurantOpen ? 'Open' : 'Closed'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{todayOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">${todayRevenue.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{activeOrders.length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rating</p>
                  <p className="text-3xl font-bold text-gray-900">{restaurant.rating}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 10).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-semibold">Order #{order.id.slice(-6)}</span>
                            <Badge className={getOrderStatusColor(order.status)}>
                              {getOrderStatusText(order.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length !== 1 ? 's' : ''} • ${order.total.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {order.status === 'pending' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              Accept
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Menu Management Tab */}
          <TabsContent value="menu" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
                <Button onClick={() => setShowAddItemForm(true)} className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="grid gap-4">
                {menuItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={item.isAvailable}
                              onCheckedChange={() => handleToggleItemAvailability(item.id)}
                            />
                            <span className="text-sm">
                              {item.isAvailable ? (
                                <Badge className="bg-green-100 text-green-800">Available</Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800">Unavailable</Badge>
                              )}
                            </span>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{orders.length}</div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Total Revenue</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{restaurant.rating}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {menuItems.slice(0, 5).map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-gray-400">#{index + 1}</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Restaurant Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="restaurant-name">Restaurant Name</Label>
                    <Input id="restaurant-name" defaultValue={restaurant.name} />
                  </div>
                  <div>
                    <Label htmlFor="delivery-time">Delivery Time</Label>
                    <Input id="delivery-time" defaultValue={restaurant.deliveryTime} />
                  </div>
                  <div>
                    <Label htmlFor="delivery-fee">Delivery Fee</Label>
                    <Input id="delivery-fee" type="number" defaultValue={restaurant.deliveryFee} />
                  </div>
                  <div>
                    <Label htmlFor="minimum-order">Minimum Order</Label>
                    <Input id="minimum-order" type="number" defaultValue={restaurant.minimumOrder} />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" defaultValue={restaurant.description} />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue={restaurant.location.address} />
                </div>

                <Button className="bg-orange-500 hover:bg-orange-600">
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDashboard;