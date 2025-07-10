import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Clock, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { mockRestaurants } from '@/data/mockData';
import { toast } from 'sonner';

const Checkout: React.FC = () => {
  const { items, getSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses.find(a => a.isDefault)?.id || '');
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const restaurant = items.length > 0 
    ? mockRestaurants.find(r => r.id === items[0].menuItem.restaurantId)
    : null;

  const subtotal = getSubtotal();
  const deliveryFee = restaurant?.deliveryFee || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setIsPlacingOrder(true);

    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderId = 'order_' + Date.now();
    clearCart();
    toast.success('Order placed successfully!');
    navigate(`/order/${orderId}`);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.addresses.length > 0 ? (
                  <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                    {user.addresses.map((address) => (
                      <div key={address.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                        <RadioGroupItem value={address.id} id={address.id} />
                        <label htmlFor={address.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{address.label}</div>
                          <div className="text-sm text-gray-600">
                            {address.street}, {address.city}, {address.state} {address.zipCode}
                          </div>
                        </label>
                        {address.isDefault && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No saved addresses found</p>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg">
                    <RadioGroupItem value="cash" id="cash" />
                    <label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-gray-600">Pay when your order arrives</div>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg opacity-50">
                    <RadioGroupItem value="card" id="card" disabled />
                    <label htmlFor="card" className="flex-1">
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Coming soon</div>
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Any special instructions for the restaurant or delivery driver..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                {restaurant && (
                  <p className="text-sm text-gray-600">From {restaurant.name}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.menuItem.id}-${JSON.stringify(item.customizations)}`} className="flex justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{item.menuItem.name}</div>
                        <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-medium">
                        ${(item.menuItem.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2">
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
                </div>

                {/* Estimated Delivery Time */}
                {restaurant && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center text-blue-800">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">
                        Estimated delivery: {restaurant.deliveryTime}
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full" 
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder || !selectedAddress}
                >
                  {isPlacingOrder ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Placing Order...
                    </div>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Place Order - ${total.toFixed(2)}
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By placing this order, you agree to our Terms of Service and Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;