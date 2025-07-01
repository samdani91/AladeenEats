import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { mockRestaurants } from '@/data/mockData';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const restaurant = items.length > 0 
    ? mockRestaurants.find(r => r.id === items[0].menuItem.restaurantId)
    : null;

  const subtotal = getSubtotal();
  const deliveryFee = restaurant?.deliveryFee || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious items from our restaurants to get started!</p>
            <Button asChild>
              <Link to="/restaurants">Browse Restaurants</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/restaurants">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
              {restaurant && (
                <p className="text-gray-600">From {restaurant.name}</p>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={clearCart} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.menuItem.id}-${JSON.stringify(item.customizations)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.menuItem.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.menuItem.description}</p>
                      
                      {/* Customizations */}
                      {Object.keys(item.customizations).length > 0 && (
                        <div className="mb-2">
                          {Object.entries(item.customizations).map(([category, options]) => (
                            <div key={category} className="text-sm text-gray-600">
                              <span className="font-medium">{category}:</span> {options.join(', ')}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Special Instructions */}
                      {item.specialInstructions && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-600">Special Instructions:</span>
                          <p className="text-sm text-gray-600">{item.specialInstructions}</p>
                        </div>
                      )}

                      {/* Dietary Info */}
                      <div className="flex space-x-2 mb-3">
                        {item.menuItem.isVegetarian && (
                          <Badge variant="outline" className="text-green-600">Vegetarian</Badge>
                        )}
                        {item.menuItem.isVegan && (
                          <Badge variant="outline" className="text-green-600">Vegan</Badge>
                        )}
                        {item.menuItem.isGlutenFree && (
                          <Badge variant="outline" className="text-blue-600">Gluten Free</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-lg">
                            ${(item.menuItem.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.menuItem.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {restaurant && restaurant.minimumOrder > subtotal && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Add ${(restaurant.minimumOrder - subtotal).toFixed(2)} more to reach the minimum order of ${restaurant.minimumOrder}
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={restaurant ? subtotal < restaurant.minimumOrder : false}
                >
                  {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                </Button>

                {restaurant && (
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Estimated delivery:</span>
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>From:</span>
                      <span>{restaurant.name}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;