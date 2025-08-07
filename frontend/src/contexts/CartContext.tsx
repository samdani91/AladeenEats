/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MenuItem } from '../types';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

interface CartContextType {
  state: CartState;
  addItem: (item: MenuItem) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: any): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find((item) => item.menuItem.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.menuItem.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalItems: state.totalItems + 1,
          totalAmount: state.totalAmount + action.payload.price,
        };
      }
      return {
        ...state,
        items: [...state.items, { menuItem: action.payload, quantity: 1 }],
        totalItems: state.totalItems + 1,
        totalAmount: state.totalAmount + action.payload.price,
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item) =>
          item.menuItem.id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter((item) => item.quantity > 0),
        totalItems: state.items.reduce(
          (sum, item) =>
            item.menuItem.id === action.payload.itemId
              ? sum + action.payload.quantity
              : sum + item.quantity,
          0
        ),
        totalAmount: state.items.reduce(
          (sum, item) =>
            item.menuItem.id === action.payload.itemId
              ? sum + action.payload.quantity * item.menuItem.price
              : sum + item.quantity * item.menuItem.price,
          0
        ),
      };
    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find((item) => item.menuItem.id === action.payload);
      return {
        ...state,
        items: state.items.filter((item) => item.menuItem.id !== action.payload),
        totalItems: state.totalItems - (itemToRemove?.quantity || 0),
        totalAmount: state.totalAmount - (itemToRemove?.quantity || 0) * (itemToRemove?.menuItem.price || 0),
      };
    case 'CLEAR_CART':
      return {
        items: [],
        totalItems: 0,
        totalAmount: 0,
      };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      dispatch({ type: 'LOAD_CART', payload: parsedCart });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item: MenuItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
