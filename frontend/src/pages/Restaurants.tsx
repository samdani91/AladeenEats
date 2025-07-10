import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import RestaurantCard from '@/components/RestaurantCard';
import { mockRestaurants } from '@/data/mockData';
import { Restaurant } from '@/types';

const Restaurants: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [minRating, setMinRating] = useState([0]);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState([60]);
  const [sortBy, setSortBy] = useState('rating');

  const cuisineTypes = ['Italian', 'Japanese', 'Mexican', 'Indian', 'American', 'Healthy', 'Chinese', 'Thai'];
  const priceRanges = ['$', '$$', '$$$', '$$$$'];

  useEffect(() => {
    setRestaurants(mockRestaurants);
    setFilteredRestaurants(mockRestaurants);
  }, []);

  useEffect(() => {
    let filtered = [...restaurants];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.some(cuisine => 
          cuisine.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Cuisine filter
    if (selectedCuisines.length > 0) {
      filtered = filtered.filter(restaurant =>
        restaurant.cuisine.some(cuisine => selectedCuisines.includes(cuisine))
      );
    }

    // Price range filter
    if (priceRange.length > 0) {
      filtered = filtered.filter(restaurant =>
        priceRange.includes(restaurant.priceRange)
      );
    }

    // Rating filter
    filtered = filtered.filter(restaurant => restaurant.rating >= minRating[0]);

    // Delivery time filter
    const maxTime = maxDeliveryTime[0];
    filtered = filtered.filter(restaurant => {
      const timeMatch = restaurant.deliveryTime.match(/(\d+)-(\d+)/);
      if (timeMatch) {
        const maxRestaurantTime = parseInt(timeMatch[2]);
        return maxRestaurantTime <= maxTime;
      }
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'deliveryTime':
          const aTime = parseInt(a.deliveryTime.match(/(\d+)/)?.[1] || '0');
          const bTime = parseInt(b.deliveryTime.match(/(\d+)/)?.[1] || '0');
          return aTime - bTime;
        case 'deliveryFee':
          return a.deliveryFee - b.deliveryFee;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredRestaurants(filtered);
  }, [restaurants, searchQuery, selectedCuisines, priceRange, minRating, maxDeliveryTime, sortBy]);

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    if (checked) {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    } else {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
    }
  };

  const handlePriceRangeChange = (range: string, checked: boolean) => {
    if (checked) {
      setPriceRange([...priceRange, range]);
    } else {
      setPriceRange(priceRange.filter(r => r !== range));
    }
  };

  const clearFilters = () => {
    setSelectedCuisines([]);
    setPriceRange([]);
    setMinRating([0]);
    setMaxDeliveryTime([60]);
    setSearchQuery('');
    setSearchParams({});
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Cuisine Filter */}
      <div>
        <h3 className="font-semibold mb-3">Cuisine Type</h3>
        <div className="space-y-2">
          {cuisineTypes.map((cuisine) => (
            <div key={cuisine} className="flex items-center space-x-2">
              <Checkbox
                id={cuisine}
                checked={selectedCuisines.includes(cuisine)}
                onCheckedChange={(checked) => handleCuisineChange(cuisine, checked as boolean)}
              />
              <label htmlFor={cuisine} className="text-sm">{cuisine}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range} className="flex items-center space-x-2">
              <Checkbox
                id={range}
                checked={priceRange.includes(range)}
                onCheckedChange={(checked) => handlePriceRangeChange(range, checked as boolean)}
              />
              <label htmlFor={range} className="text-sm">{range}</label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-semibold mb-3">Minimum Rating</h3>
        <div className="px-2">
          <Slider
            value={minRating}
            onValueChange={setMinRating}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0</span>
            <span className="font-medium">{minRating[0]}+ stars</span>
            <span>5</span>
          </div>
        </div>
      </div>

      {/* Delivery Time Filter */}
      <div>
        <h3 className="font-semibold mb-3">Max Delivery Time</h3>
        <div className="px-2">
          <Slider
            value={maxDeliveryTime}
            onValueChange={setMaxDeliveryTime}
            max={90}
            min={15}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>15 min</span>
            <span className="font-medium">{maxDeliveryTime[0]} min</span>
            <span>90 min</span>
          </div>
        </div>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Restaurants</h1>
          
          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="deliveryTime">Fastest Delivery</SelectItem>
                  <SelectItem value="deliveryFee">Lowest Delivery Fee</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Restaurants</SheetTitle>
                    <SheetDescription>
                      Narrow down your search with these filters
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCuisines.length > 0 || priceRange.length > 0 || minRating[0] > 0 || maxDeliveryTime[0] < 60) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCuisines.map((cuisine) => (
                <Badge key={cuisine} variant="secondary" className="cursor-pointer" onClick={() => handleCuisineChange(cuisine, false)}>
                  {cuisine} ×
                </Badge>
              ))}
              {priceRange.map((range) => (
                <Badge key={range} variant="secondary" className="cursor-pointer" onClick={() => handlePriceRangeChange(range, false)}>
                  {range} ×
                </Badge>
              ))}
              {minRating[0] > 0 && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setMinRating([0])}>
                  {minRating[0]}+ stars ×
                </Badge>
              )}
              {maxDeliveryTime[0] < 60 && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setMaxDeliveryTime([60])}>
                  Max {maxDeliveryTime[0]} min ×
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Filters</h2>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Restaurant Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-gray-600">
              {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
            </div>
            
            {filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MapPin className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurants;