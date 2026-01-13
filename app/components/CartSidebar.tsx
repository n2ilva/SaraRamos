'use client';

import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const CartSidebar = () => {
  const { items, removeFromCart, isOpen, toggleCart, total } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout
    setTimeout(() => {
      alert('Checkout simulado! Implementar gateway de pagamento real.');
      setIsCheckingOut(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={toggleCart}
      ></div>

      {/* Sidebar Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
        <div className="p-6 bg-pink-50 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-pink-700 font-bold text-xl">
            <ShoppingBag className="w-6 h-6" />
            <span>Seu Carrinho</span>
          </div>
          <button 
            onClick={toggleCart}
            className="p-2 hover:bg-pink-200 rounded-full text-pink-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="text-lg font-medium">Seu carrinho está vazio</p>
              <button 
                onClick={toggleCart}
                className="text-pink-500 font-bold hover:underline"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:border-pink-200 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl
                       ${item.type === 'livro' ? 'bg-blue-100' : 'bg-green-100'}`}>
                        {item.type === 'livro' ? '📚' : '✂️'}
                     </div>
                     <div>
                       <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.title}</h4>
                       <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-pink-600">
                      R$ {item.price.toFixed(2).replace('.', ',')}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id, item.type)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold hover:bg-pink-700 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processando...
                </>
              ) : (
                'Finalizar Compra'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
