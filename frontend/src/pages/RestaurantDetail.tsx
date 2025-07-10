import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Truck, MapPin, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MenuItemCard from '@/components/MenuItemCard';
import { mockRestaurants, mockMenuItems, mockReviews } from '@/data/mockData';
import { Restaurant, MenuItem, Review } from '@/types';

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      const foundRestaurant = mockRestaurants.find(r => r.id === id);
      setRestaurant(foundRestaurant || null);
      
      const restaurantMenuItems = mockMenuItems.filter(item => item.restaurantId === id);
      setMenuItems(restaurantMenuItems);
      
      const restaurantReviews = mockReviews.filter(review => review.restaurantId === id);
      setReviews(restaurantReviews);
    }
  }, [id]);

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant not found</h2>
          <p className="text-gray-600 mb-4">The restaurant you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/restaurants">Browse Restaurants</Link>
          </Button>
        </div>
      </div>
    );
  }

  const categories = ['all', ...Array.from(new Set(menuItems.map(item => item.category)))];
  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const groupedMenuItems = filteredMenuItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative h-64 md:h-80">
        <img
          src={restaurant.coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Button variant="secondary" size="sm" asChild>
            <Link to="/restaurants">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button variant="secondary" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Restaurant Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-lg text-gray-200 mb-4">{restaurant.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{restaurant.rating}</span>
              <span className="text-gray-300">({restaurant.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Truck className="h-4 w-4" />
              <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>Min ${restaurant.minimumOrder}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Restaurant Status */}
        <div className="mb-6">
          {restaurant.isOpen ? (
            <Badge className="bg-green-100 text-green-800">Open Now</Badge>
          ) : (
            <Badge variant="destructive">Closed</Badge>
          )}
        </div>

        {/* Cuisine Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {restaurant.cuisine.map((cuisine) => (
            <Badge key={cuisine} variant="outline">
              {cuisine}
            </Badge>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          {/* Menu Tab */}
          <TabsContent value="menu" className="mt-6">
            <div className="flex gap-8">
              {/* Category Sidebar */}
              <div className="hidden md:block w-48 flex-shrink-0">
                <Card className="sticky top-24">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            selectedCategory === category
                              ? 'bg-orange-100 text-orange-800 font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {category === 'all' ? 'All Items' : category}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Menu Items */}
              <div className="flex-1">
                {/* Mobile Category Selector */}
                <div className="md:hidden mb-6">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Items' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory === 'all' ? (
                  // Show all items grouped by category
                  <div className="space-y-8">
                    {Object.entries(groupedMenuItems).map(([category, items]) => (
                      <div key={category}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">{category}</h2>
                        <div className="grid gap-4">
                          {items.map((item) => (
                            <MenuItemCard key={item.id} menuItem={item} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Show items from selected category
                  <div className="grid gap-4">
                    {filteredMenuItems.map((item) => (
                      <MenuItemCard key={item.id} menuItem={item} />
                    ))}
                  </div>
                )}

                {filteredMenuItems.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No items found in this category.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{review.userName}</h4>
                          <div className="flex items-center space-x-1 mt-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Info Tab */}
          <TabsContent value="info" className="mt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Restaurant Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Address:</span>
                      <p className="text-gray-600">{restaurant.location.address}</p>
                    </div>
                    <div>
                      <span className="font-medium">Cuisine:</span>
                      <p className="text-gray-600">{restaurant.cuisine.join(', ')}</p>
                    </div>
                    <div>
                      <span className="font-medium">Price Range:</span>
                      <p className="text-gray-600">{restaurant.priceRange}</p>
                    </div>
                    <div>
                      <span className="font-medium">Minimum Order:</span>
                      <p className="text-gray-600">${restaurant.minimumOrder}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Delivery Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Delivery Time:</span>
                      <p className="text-gray-600">{restaurant.deliveryTime}</p>
                    </div>
                    <div>
                      <span className="font-medium">Delivery Fee:</span>
                      <p className="text-gray-600">${restaurant.deliveryFee.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <p className="text-gray-600">
                        {restaurant.isOpen ? 'Open Now' : 'Closed'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RestaurantDetail;