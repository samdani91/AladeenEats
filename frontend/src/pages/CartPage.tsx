import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuthContext } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { state: cartState, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuthContext();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const deliveryFee = 2.99;
  const subtotal = cartState.totalAmount;
  const total = subtotal + deliveryFee - discount;

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === 'welcome10') {
      setDiscount(subtotal * 0.1);
      toast.success('Promo code applied! 10% discount added.');
    } else if (promoCode.toLowerCase() === 'free delivery') {
      setDiscount(deliveryFee);
      toast.success('Promo code applied! Free delivery!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to continue');
      return;
    }
    
    if (cartState.totalItems === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Navigate to checkout
    window.location.href = '/checkout';
  };

  if (cartState.totalItems === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Add some delicious items from our restaurants to get started!
          </p>
          <Link to="/restaurants">
            <Button size="lg">
              Browse Restaurants
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/restaurants"
              className="flex items-center text-orange-600 hover:text-orange-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Continue Shopping
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <button
            onClick={clearCart}
            className="flex items-center text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="h-5 w-5 mr-1" />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartState.items.map((item) => (
              <div key={item.menuItem.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.menuItem.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.menuItem.description}
                    </p>
                    <p className="text-orange-600 font-semibold">
                      ৳{item.menuItem.price.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.menuItem.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Promo Code */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Promo Code</h3>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={applyPromoCode}
                  disabled={!promoCode.trim()}
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Order Total */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Items ({cartState.totalItems})
                  </span>
                  <span className="font-medium">৳{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">৳{deliveryFee.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-৳{discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-orange-600">৳{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Delivery Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>🚚 Free delivery on orders over ৳30</p>
                <p>⏱️ Estimated delivery: 25-35 minutes</p>
                <p>📍 Delivering to your default address</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;