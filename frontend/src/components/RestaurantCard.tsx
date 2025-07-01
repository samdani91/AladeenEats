import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Truck, DollarSign, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Restaurant } from '@/types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getPriceRangeIcon = (priceRange: string) => {
    const count = priceRange.length;
    return Array.from({ length: 4 }, (_, i) => (
      <DollarSign 
        key={i} 
        className={`h-3 w-3 transition-colors ${i < count ? 'text-green-600' : 'text-gray-300'}`}
      />
    ));
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/restaurant/${restaurant.id}`} className="block group">
      <Card className="overflow-hidden hover-lift bg-white border-0 shadow-md hover:shadow-2xl transition-all duration-500 rounded-2xl">
        <div className="relative overflow-hidden">
          {/* Image with loading state */}
          <div className="relative h-48 bg-gray-200">
            {!imageLoaded && (
              <div className="absolute inset-0 loading-skeleton rounded-t-2xl"></div>
            )}
            <img
              src={restaurant.image}
              alt={restaurant.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Status badge */}
            {!restaurant.isOpen && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                <Badge variant="destructive" className="text-white font-semibold px-4 py-2 text-sm animate-pulse">
                  Closed
                </Badge>
              </div>
            )}
            
            {/* Delivery time badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/95 text-gray-900 font-medium shadow-lg backdrop-blur-sm border-0 hover:bg-white transition-colors">
                <Clock className="h-3 w-3 mr-1" />
                {restaurant.deliveryTime}
              </Badge>
            </div>

            {/* Favorite button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm border-0 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <Heart className={`h-4 w-4 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors duration-300 truncate">
                {restaurant.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">{restaurant.rating}</span>
                  <span className="text-sm text-gray-500">({restaurant.reviewCount})</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center">
                  {getPriceRangeIcon(restaurant.priceRange)}
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-4">
            {restaurant.cuisine.slice(0, 3).map((cuisine) => (
              <Badge 
                key={cuisine} 
                variant="outline" 
                className="text-xs border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors"
              >
                {cuisine}
              </Badge>
            ))}
            {restaurant.cuisine.length > 3 && (
              <Badge variant="outline" className="text-xs border-gray-200 text-gray-500">
                +{restaurant.cuisine.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center space-x-1">
                <Truck className="h-4 w-4" />
                <span className="font-medium">${restaurant.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span>Min ${restaurant.minimumOrder}</span>
              </div>
            </div>
            
            {restaurant.isOpen && (
              <Badge className="bg-green-100 text-green-800 border-green-200 font-medium">
                Open
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;