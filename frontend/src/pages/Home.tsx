import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Star, Truck, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import RestaurantCard from '@/components/RestaurantCard';
import { mockRestaurants } from '@/data/mockData';
import { Restaurant } from '@/types';

const Home: React.FC = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([]);
  const [popularRestaurants, setPopularRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading with stagger animation
    setTimeout(() => {
      setFeaturedRestaurants(mockRestaurants.slice(0, 3));
      setPopularRestaurants(mockRestaurants.filter(r => r.rating >= 4.5));
    }, 300);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  const cuisineTypes = [
    { name: 'Italian', icon: '🍝', color: 'from-red-400 to-red-600', count: '120+ restaurants' },
    { name: 'Japanese', icon: '🍣', color: 'from-pink-400 to-pink-600', count: '85+ restaurants' },
    { name: 'Mexican', icon: '🌮', color: 'from-yellow-400 to-orange-500', count: '95+ restaurants' },
    { name: 'Indian', icon: '🍛', color: 'from-orange-400 to-red-500', count: '110+ restaurants' },
    { name: 'American', icon: '🍔', color: 'from-blue-400 to-blue-600', count: '150+ restaurants' },
    { name: 'Healthy', icon: '🥗', color: 'from-green-400 to-green-600', count: '75+ restaurants' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-pink-600"></div>
        <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-30`}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center animate-fade-in-up">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-yellow-300 mr-3 animate-pulse" />
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                #1 Food Delivery App
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Delicious Food <br />
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Delivered Fast
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Order from your favorite restaurants and get it delivered in minutes. 
              Fresh, fast, and always delicious.
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-4xl mx-auto animate-fade-in-scale">
              <form onSubmit={handleSearch} className="bg-white rounded-2xl p-3 shadow-2xl backdrop-blur-sm border border-white/20">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex items-center flex-1 px-4 py-2 bg-gray-50 rounded-xl">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="Enter your delivery address"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="border-0 bg-transparent focus:ring-0 text-gray-900 placeholder-gray-500 p-0"
                    />
                  </div>
                  <div className="flex items-center flex-1 px-4 py-2 bg-gray-50 rounded-xl">
                    <Search className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="Search for restaurants or dishes"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-0 bg-transparent focus:ring-0 text-gray-900 placeholder-gray-500 p-0"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </form>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12 text-white/90">
              <div className="text-center">
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm">Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">30min</div>
                <div className="text-sm">Avg Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by Cuisine
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing flavors from around the world
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {cuisineTypes.map((cuisine, index) => (
              <Link
                key={cuisine.name}
                to={`/restaurants?cuisine=${cuisine.name.toLowerCase()}`}
                className={`group stagger-item`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="hover-lift border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${cuisine.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {cuisine.icon}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {cuisine.name}
                    </h3>
                    <p className="text-sm text-gray-500">{cuisine.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Restaurants</h2>
              <p className="text-xl text-gray-600">Handpicked favorites just for you</p>
            </div>
            <Button variant="outline" asChild className="hidden md:flex hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-300 rounded-xl">
              <Link to="/restaurants">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant, index) => (
              <div key={restaurant.id} className={`stagger-item`} style={{ animationDelay: `${index * 0.2}s` }}>
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12 md:hidden">
            <Button asChild className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl">
              <Link to="/restaurants">
                View All Restaurants
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular This Week */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Popular This Week
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trending restaurants that everyone's talking about
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularRestaurants.map((restaurant, index) => (
              <div key={restaurant.id} className={`stagger-item`} style={{ animationDelay: `${index * 0.15}s` }}>
                <RestaurantCard restaurant={restaurant} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        <div className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]`}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose FoodieExpress?</h2>
            <p className="text-xl text-gray-300 mx-auto">
              We're committed to delivering the best food experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Clock,
                title: 'Lightning Fast Delivery',
                description: 'Get your food delivered in 30 minutes or less, guaranteed fresh and hot',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Star,
                title: 'Premium Restaurants',
                description: 'Order from the highest-rated restaurants in your area, curated for quality',
                gradient: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Truck,
                title: 'Real-time Tracking',
                description: 'Track your order in real-time from kitchen to doorstep with live updates',
                gradient: 'from-green-500 to-emerald-500'
              }
            ].map((feature, index) => (
              <div key={feature.title} className={`text-center group stagger-item`} style={{ animationDelay: `${index * 0.2}s` }}>
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Order?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            Join thousands of satisfied customers and start your food journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link to="/restaurants">
                Browse Restaurants
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild  size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link to="/register">
                Sign Up Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;