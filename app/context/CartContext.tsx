'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string; // unique string (e.g. "book-1")
  title: string;
  price: number; // numerical value
  type: 'livro' | 'atividade';
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, type: 'livro' | 'atividade') => void; // Need type since title might not be unique across categories? Actually ID should be enough if unique.
  // We'll assume ID is unique or combination of title is enough for this simple app. 
  // Let's use ID made of title + type to be safe.
  clearCart: () => void;
  isOpen: boolean;
  toggleCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item: CartItem) => {
    // Prevent adding duplicates for digital products? 
    // Usually digital products are quantity 1.
    setItems((prev) => {
      if (prev.some(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
    setIsOpen(true); // Open cart on add
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCart = () => {
    setIsOpen(prev => !prev);
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, isOpen, toggleCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
