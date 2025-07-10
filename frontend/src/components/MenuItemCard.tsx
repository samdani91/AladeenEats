import React, { useState } from 'react';
import { Plus, Leaf, Flame, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuItem } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

interface MenuItemCardProps {
  menuItem: MenuItem;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ menuItem }) => {
  const { addItem, items, updateQuantity } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Find existing item in cart
  const existingItem = items.find(item => item.menuItem.id === menuItem.id);
  const quantity = existingItem?.quantity || 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Simulate adding to cart with animation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    addItem(menuItem);
    toast.success(`${menuItem.name} added to cart!`, {
      duration: 2000,
    });
    setIsAdding(false);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity === 0) {
      updateQuantity(menuItem.id, 0);
      toast.success(`${menuItem.name} removed from cart`);
    } else {
      updateQuantity(menuItem.id, newQuantity);
    }
  };

  const getSpiceIcon = (level: string) => {
    const spiceCount = level === 'mild' ? 1 : level === 'medium' ? 2 : level === 'hot' ? 3 : 4;
    return Array.from({ length: spiceCount }, (_, i) => (
      <Flame key={i} className="h-3 w-3 text-red-500" />
    ));
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 border-0 shadow-md rounded-2xl overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="flex">
          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors duration-300 mb-2">
                  {menuItem.name}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  {menuItem.isVegetarian && (
                    <div className="flex items-center space-x-1">
                      <Leaf className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">Vegetarian</span>
                    </div>
                  )}
                  {menuItem.isVegan && (
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">V</span>
                      </div>
                      <span className="text-xs text-green-600 font-medium">Vegan</span>
                    </div>
                  )}
                  {menuItem.spiceLevel && (
                    <div className="flex items-center space-x-1">
                      {getSpiceIcon(menuItem.spiceLevel)}
                      <span className="text-xs text-red-600 font-medium capitalize">{menuItem.spiceLevel}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {menuItem.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-gray-900">
                  ${menuItem.price.toFixed(2)}
                </span>
                {menuItem.isGlutenFree && (
                  <Badge variant="outline" className="text-xs border-blue-200 text-blue-600">
                    Gluten Free
                  </Badge>
                )}
              </div>

              {/* Add to cart controls */}
              <div className="flex items-center space-x-2">
                {quantity > 0 ? (
                  <div className="flex items-center space-x-2 bg-orange-50 rounded-full p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateQuantity(quantity - 1)}
                      className="h-8 w-8 rounded-full hover:bg-orange-100 p-0"
                    >
                      <Minus className="h-4 w-4 text-orange-600" />
                    </Button>
                    <span className="font-semibold text-orange-600 min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateQuantity(quantity + 1)}
                      className="h-8 w-8 rounded-full hover:bg-orange-100 p-0"
                    >
                      <Plus className="h-4 w-4 text-orange-600" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={!menuItem.isAvailable || isAdding}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 disabled:opacity-50"
                  >
                    {isAdding ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {!menuItem.isAvailable && (
              <div className="mt-3">
                <Badge variant="destructive" className="animate-pulse">
                  Currently Unavailable
                </Badge>
              </div>
            )}
          </div>

          {/* Image */}
          <div className="w-32 h-32 m-4 flex-shrink-0 relative overflow-hidden rounded-xl">
            {!imageLoaded && (
              <div className="absolute inset-0 loading-skeleton rounded-xl"></div>
            )}
            <img
              src={menuItem.image}
              alt={menuItem.name}
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 rounded-xl ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuItemCard;