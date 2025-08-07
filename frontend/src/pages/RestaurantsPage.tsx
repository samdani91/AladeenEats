import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const RestaurantsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');

  // Mock data - in real app, this would come from API
  const restaurants = [
    {
      id: '1',
      name: 'Bella Italia',
      cuisine: 'Italian',
      rating: 4.8,
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      minimumOrder: 15,
      image: 'https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400',
      priceRange: '$$',
      isOpen: true,
    },
    {
      id: '2',
      name: 'Spice Garden',
      cuisine: 'Indian',
      rating: 4.6,
      deliveryTime: '30-40 min',
      deliveryFee: 3.49,
      minimumOrder: 20,
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=400',
      priceRange: '$',
      isOpen: true,
    },
    {
      id: '3',
      name: 'Tokyo Express',
      cuisine: 'Japanese',
      rating: 4.9,
      deliveryTime: '20-30 min',
      deliveryFee: 4.99,
      minimumOrder: 25,
      image: 'https://images.pexels.com/photos/2323398/pexels-photo-2323398.jpeg?auto=compress&cs=tinysrgb&w=400',
      priceRange: '$$$',
      isOpen: true,
    },
    {
      id: '4',
      name: 'Burger Palace',
      cuisine: 'American',
      rating: 4.4,
      deliveryTime: '15-25 min',
      deliveryFee: 2.49,
      minimumOrder: 10,
      image: 'https://images.pexels.com/photos/1556698/pexels-photo-1556698.jpeg?auto=compress&cs=tinysrgb&w=400',
      priceRange: '$',
      isOpen: false,
    },
    {
      id: '5',
      name: 'Mediterranean Delight',
      cuisine: 'Mediterranean',
      rating: 4.7,
      deliveryTime: '35-45 min',
      deliveryFee: 3.99,
      minimumOrder: 18,
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
      priceRange: '$$',
      isOpen: true,
    },
    {
      id: '6',
      name: 'Dragon House',
      cuisine: 'Chinese',
      rating: 4.5,
      deliveryTime: '25-35 min',
      deliveryFee: 2.99,
      minimumOrder: 15,
      image: 'https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=400',
      priceRange: '$$',
      isOpen: true,
    },
  ];

  const cuisineTypes = ['Italian', 'Indian', 'Japanese', 'American', 'Mediterranean', 'Chinese'];
  const priceRanges = ['$', '$$', '$$$'];

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = !selectedCuisine || restaurant.cuisine === selectedCuisine;
    const matchesRating = !selectedRating || restaurant.rating >= parseInt(selectedRating);
    const matchesPrice = !selectedPriceRange || restaurant.priceRange === selectedPriceRange;

    return matchesSearch && matchesCuisine && matchesRating && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Restaurants Near You
          </h1>
          <p className="text-gray-600">
            Discover amazing food from local restaurants
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search restaurants or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Cuisines</option>
              {cuisineTypes.map((cuisine) => (
                <option key={cuisine} value={cuisine}>{cuisine}</option>
              ))}
            </select>

            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>

            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Price Range</option>
              {priceRanges.map((range) => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!restaurant.isOpen && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Currently Closed</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full shadow-md">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded-full shadow-md">
                  <span className="text-sm font-medium text-gray-700">{restaurant.priceRange}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {restaurant.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    restaurant.isOpen 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {restaurant.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{restaurant.cuisine}</p>
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                    <span>৳{restaurant.deliveryFee} delivery</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>Min: ৳{restaurant.minimumOrder}</span>
                    </div>
                    <span className="text-orange-600 font-medium hover:text-orange-700">
                      View Menu →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later for new restaurants.
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCuisine('');
                setSelectedRating('');
                setSelectedPriceRange('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;