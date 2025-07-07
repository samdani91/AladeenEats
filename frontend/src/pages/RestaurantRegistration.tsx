import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, MapPin, Phone, Mail, Image as ImageIcon, FileText, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const RestaurantRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    restaurantName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    image: null as File | null,
    licenseNumber: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only JPEG or PNG images are allowed');
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (!formData.image) {
      toast.error('Please upload a restaurant image');
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('restaurantName', formData.restaurantName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('image', formData.image);
      formDataToSend.append('licenseNumber', formData.licenseNumber);
      formDataToSend.append('ownerId', user?.id || '');

      // Replace with actual API call
      // await api.submitRestaurant(formDataToSend);

      toast.success('Restaurant submitted successfully! 🎉', {
        description: 'Your restaurant is under review. We will notify you once approved.',
      });
      navigate('/');
    } catch (error) {
      toast.error('Failed to submit restaurant', {
        description: 'Please try again with different details.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23f97316%27 fill-opacity=%270.05%27%3E%3Ccircle cx=%2730%27 cy=%2730%27 r=%272%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      {/* Back to dashboard button */}
      <Link to="/" className="absolute top-6 left-6 z-10">
        <Button variant="ghost" size="sm" className="hover:bg-white/50 backdrop-blur-sm rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      <div className="w-full max-w-2xl relative z-10">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95 rounded-3xl overflow-hidden animate-fade-in-scale">
          <CardHeader className="space-y-1 text-center pb-4 pt-6">
            <div className="relative mb-4">
              <div className="h-16 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <span className="text-white font-bold text-xl">Aladeen Eats</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl opacity-20 blur-xl"></div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Add Your Restaurant
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Submit your restaurant details for admin approval
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Two-column layout for Restaurant Name and Phone Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName" className="text-sm font-semibold text-gray-700">
                    Restaurant Name
                  </Label>
                  <div className="relative group">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      id="restaurantName"
                      name="restaurantName"
                      type="text"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      placeholder="Enter restaurant name"
                      className="pl-10 pr-3 py-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all duration-300 bg-gray-50/50 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="pl-10 pr-3 py-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all duration-300 bg-gray-50/50 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Two-column layout for Email and License Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Contact Email
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter contact email"
                      className="pl-10 pr-3 py-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all duration-300 bg-gray-50/50 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber" className="text-sm font-semibold text-gray-700">
                    Business License Number
                  </Label>
                  <div className="relative group">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="Enter business license number"
                      className="pl-10 pr-3 py-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all duration-300 bg-gray-50/50 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Full-width Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                  Restaurant Address
                </Label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter restaurant address"
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all duration-300 bg-gray-50/50 focus:bg-white min-h-[80px]"
                    required
                  />
                </div>
              </div>

              {/* Full-width Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Restaurant Description
                </Label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your restaurant (cuisine, ambiance, etc.)"
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all duration-300 bg-gray-50/50 focus:bg-white min-h-[80px]"
                    required
                  />
                </div>
              </div>

              {/* Full-width Image */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-semibold text-gray-700">
                  Restaurant Image
                </Label>
                <div className="relative group">
                  <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleImageChange}
                    className="pl-10 pr-3 py-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-all duration-300 bg-gray-50/50 focus:bg-white"
                    required
                  />
                </div>
                {formData.image && (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Image selected: {formData.image.name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-3 pt-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                disabled={isLoading || !agreeTerms || !formData.image}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting restaurant...
                  </div>
                ) : (
                  'Submit Restaurant'
                )}
              </Button>
            </form>

            <div className="text-center text-sm mt-3">
              <span className="text-gray-600">Back to Home? </span>
              <Link to="/" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors hover:underline">
                Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantRegistration;