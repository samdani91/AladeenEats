/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import { PaymentMethod } from '../types';
import { CreditCard, Plus, Trash2, Star } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('your-stripe-publishable-key-here'); // Replace with your actual Stripe publishable key

interface CardFormProps {
  onCancel: () => void;
  onSuccess: (paymentMethod: PaymentMethod) => void;
}

const CardForm: React.FC<CardFormProps> = ({ onCancel, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError('Card number element not found');
      setLoading(false);
      return;
    }

    try {
      const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumberElement,
        billing_details: {
          name: cardholderName,
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Failed to create payment method');
        setLoading(false);
        return;
      }

      if (paymentMethod) {
        const response = await apiClient.addPaymentMethod({ paymentMethodId: paymentMethod.id });
        onSuccess(response.data);
        toast.success('Payment method added successfully');
      }
    } catch (error) {
      setError('Failed to add payment method');
      toast.error('Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border border-gray-200 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Add New Card</h3>
      <div className="space-y-4">
        <Input
          label="Cardholder Name"
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          required
        />
        <div className="border border-gray-300 rounded p-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <CardNumberElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              },
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-300 rounded p-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
            <CardExpiryElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                  invalid: { color: '#9e2146' },
                },
              }}
            />
          </div>
          <div className="border border-gray-300 rounded p-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <CardCvcElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': { color: '#aab7c4' },
                  },
                  invalid: { color: '#9e2146' },
                },
              }}
            />
          </div>
        </div>
      </div>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      <div className="flex space-x-4 mt-6">
        <Button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Card'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

const PaymentMethodsPage: React.FC = () => {
  const { user } = useAuthContext();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingCard, setIsAddingCard] = useState(false);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getPaymentMethods();
        setPaymentMethods(response.data);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast.error('Failed to load payment methods');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPaymentMethods();
    }
  }, [user]);

  const handleAddCardSuccess = (newPaymentMethod: PaymentMethod) => {
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setIsAddingCard(false);
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      await apiClient.deletePaymentMethod(paymentMethodId);
      setPaymentMethods(paymentMethods.filter((pm) => pm.id !== paymentMethodId));
      toast.success('Payment method deleted successfully');
    } catch (error) {
      toast.error('Failed to delete payment method');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Methods</h1>
            <p className="text-gray-600">Manage your saved payment methods for faster checkout</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Methods List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Saved Cards</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingCard(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Card
                  </Button>
                </div>

                {isAddingCard && (
                  <CardForm
                    onCancel={() => setIsAddingCard(false)}
                    onSuccess={handleAddCardSuccess}
                  />
                )}

                <div className="space-y-4">
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border rounded-lg ${
                          method.isDefault ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <CreditCard className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="font-medium text-gray-900">
                                  {method.cardBrand} •••• {method.last4}
                                </p>
                                {method.isDefault && (
                                  <div className="flex items-center space-x-1">
                                    <Star className="h-4 w-4 text-orange-500 fill-current" />
                                    <span className="text-xs font-medium text-orange-600">Default</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                Expires {method.expiryMonth?.toString().padStart(2, '0')}/{method.expiryYear}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePaymentMethod(method.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No payment methods added yet</p>
                      <Button onClick={() => setIsAddingCard(true)}>
                        Add Your First Card
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>🔒 Your payment information is encrypted and secure</p>
                  <p>🛡️ We never store your full card details</p>
                  <p>✅ PCI DSS compliant payment processing</p>
                  <p>🔄 Easy to update or remove cards anytime</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Accepted Cards</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Visa</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded">
                    <CreditCard className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium">Mastercard</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded">
                    <CreditCard className="h-5 w-5 text-blue-800" />
                    <span className="text-sm font-medium">Amex</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border border-gray-200 rounded">
                    <CreditCard className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium">Discover</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default PaymentMethodsPage;