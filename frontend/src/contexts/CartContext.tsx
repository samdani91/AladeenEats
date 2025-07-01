import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, MenuItem } from '@/types';

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; customizations?: { [key: string]: string[] }; specialInstructions?: string } }
  | { type: 'REMOVE_ITEM'; payload: { menuItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { menuItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartState };

interface CartContextType {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (menuItem: MenuItem, customizations?: { [key: string]: string[] }, specialInstructions?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, customizations = {}, specialInstructions } = action.payload;
      
      // If adding from different restaurant, clear cart first
      if (state.restaurantId && state.restaurantId !== menuItem.restaurantId) {
        return {
          items: [{
            menuItem,
            quantity: 1,
            customizations,
            specialInstructions
          }],
          restaurantId: menuItem.restaurantId
        };
      }

      // Check if item with same customizations already exists
      const existingItemIndex = state.items.findIndex(item => 
        item.menuItem.id === menuItem.id &&
        JSON.stringify(item.customizations) === JSON.stringify(customizations) &&
        item.specialInstructions === specialInstructions
      );

      if (existingItemIndex > -1) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += 1;
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [...state.items, {
          menuItem,
          quantity: 1,
          customizations,
          specialInstructions
        }],
        restaurantId: menuItem.restaurantId
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.menuItem.id !== action.payload.menuItemId);
      return {
        ...state,
        items: newItems,
        restaurantId: newItems.length > 0 ? state.restaurantId : null
      };
    }

    case 'UPDATE_QUANTITY': {
      const { menuItemId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { menuItemId } });
      }

      const newItems = state.items.map(item =>
        item.menuItem.id === menuItemId ? { ...item, quantity } : item
      );
      return { ...state, items: newItems };
    }

    case 'CLEAR_CART':
      return { items: [], restaurantId: null };

    case 'SET_CART':
      return action.payload;

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], restaurantId: null });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'SET_CART', payload: cartData });
      } catch (error) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (menuItem: MenuItem, customizations?: { [key: string]: string[] }, specialInstructions?: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { menuItem, customizations, specialInstructions } });
  };

  const removeItem = (menuItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { menuItemId } });
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { menuItemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return state.items.reduce((total, item) => {
      let itemTotal = item.menuItem.price * item.quantity;
      
      // Add customization costs
      Object.values(item.customizations).flat().forEach(customizationId => {
        // In a real app, you'd look up the customization price
        itemTotal += 1.50; // Mock customization price
      });

      return total + itemTotal;
    }, 0);
  };

  return (
    <CartContext.Provider value={{
      items: state.items,
      restaurantId: state.restaurantId,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getSubtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};