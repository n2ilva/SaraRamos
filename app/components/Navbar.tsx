'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, BookOpen, Video, Gamepad, Mail, Scissors, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { toggleCart, items } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Livros', href: '/livros', icon: BookOpen },
    { name: 'Vídeos', href: '/videos', icon: Video },
    { name: 'Jogos', href: '/jogos', icon: Gamepad },
    { name: 'Atividades', href: '/atividades', icon: Scissors },
    { name: 'Contato', href: '/contato', icon: Mail },
  ];

  return (
    <nav className="bg-white shadow-sm border-b-4 border-pink-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-pink-100 p-2 rounded-full group-hover:bg-pink-200 transition-colors">
                <span className="text-2xl">👩‍🏫</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-400 bg-clip-text text-transparent">
                Profª Sara
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:text-pink-500 hover:bg-pink-50 transition-all duration-300 font-medium group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
             
             {/* Cart Button Desktop */}
            <button 
              onClick={toggleCart}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white bg-pink-500 hover:bg-pink-600 transition-all duration-300 font-bold ml-2 shadow-md hover:shadow-lg relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Carrinho</span>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-pink-700 text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">
                  {items.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={toggleCart} 
              className="p-2 relative text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute top-1 right-1 bg-yellow-400 text-pink-700 text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border-2 border-white">
                  {items.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-pink-100 absolute w-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-pink-600 hover:bg-pink-50 font-medium transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
