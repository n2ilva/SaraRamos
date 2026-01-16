'use client';

import { X, Trash2, ShoppingBag, CreditCard, Loader2, ExternalLink } from 'lucide-react';
import { useCart, formatPrice } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Stripe Payment Link - You should create this in your Stripe Dashboard
// For now, we'll use a placeholder that you can replace
const STRIPE_PAYMENT_LINK = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || '';

const CartSidebar = () => {
  const { items, removeFromCart, isOpen, closeCart, total, formattedTotal, clearCart, itemCount } = useCart();
  const { user, addPurchase } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCheckout = async () => {
    if (!user) {
      closeCart();
      router.push('/pages/login');
      return;
    }

    if (items.length === 0) return;

    setIsCheckingOut(true);
    setError(null);

    try {
      // 1. Save cart to localStorage for success page retrieval (crucial for recording purchase after redirect)
      localStorage.setItem('pending_purchase', JSON.stringify({
        items: items.map(item => ({ title: item.title, price: item.price, type: item.type })),
        total,
        timestamp: Date.now(),
      }));

      // 2. Call our API to create a Stripe Session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar sessão de pagamento');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('URL de pagamento não retornada');
      }
      
    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback for development/testing if API fails (optional, maybe remove for prod)
      if (process.env.NODE_ENV === 'development') {
        alert('Erro na API de pagamento. Modo DEV: Compra simulada será registrada.');
        await addPurchase(items, total);
        clearCart();
        closeCart();
        router.push('/pages/perfil');
      } else {
        setError(err instanceof Error ? err.message : 'Erro ao processar compra. Tente novamente.');
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      ></div>

      {/* Sidebar Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-full">
              <ShoppingBag className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <span className="text-pink-700 font-bold text-xl">Seu Carrinho</span>
              {itemCount > 0 && (
                <p className="text-sm text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'itens'}</p>
              )}
            </div>
          </div>
          <button 
            onClick={closeCart}
            className="p-2 hover:bg-pink-200 rounded-full text-pink-700 transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-grow overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <ShoppingBag className="w-16 h-16 opacity-30" />
              </div>
              <p className="text-lg font-medium">Seu carrinho está vazio</p>
              <p className="text-sm text-center text-gray-400">
                Explore nossos livros, vídeos e jogos educativos!
              </p>
              <button 
                onClick={closeCart}
                className="text-pink-500 font-bold hover:underline"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:border-pink-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                      ${item.type === 'livro' ? 'bg-blue-100' : 
                        item.type === 'video' ? 'bg-purple-100' :
                        item.type === 'jogo' ? 'bg-green-100' :
                        item.type === 'atividade' ? 'bg-yellow-100' :
                        'bg-pink-100'}`}
                    >
                      {item.type === 'livro' ? '📚' : 
                       item.type === 'video' ? '🎬' :
                       item.type === 'jogo' ? '🎮' :
                       item.type === 'atividade' ? '✂️' :
                       '✨'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.title}</h4>
                      <span className="text-xs text-gray-500 capitalize">{item.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-pink-600">
                      {formatPrice(item.price)}
                    </span>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                      aria-label={`Remover ${item.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white space-y-4">
            {/* Error message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                {formattedTotal}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="flex-1 py-3 px-4 border-2 border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Limpar
              </button>
              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-4 rounded-xl font-bold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    {STRIPE_PAYMENT_LINK ? 'Pagar com Stripe' : 'Finalizar'}
                    {STRIPE_PAYMENT_LINK && <ExternalLink className="w-4 h-4" />}
                  </>
                )}
              </button>
            </div>

            {/* Login prompt */}
            {!user && (
              <p className="text-center text-sm text-gray-500">
                <a href="/pages/login" className="text-pink-500 hover:underline font-medium">
                  Faça login
                </a>
                {' '}para finalizar a compra
              </p>
            )}

            {/* Secure payment badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
              <span>🔒</span>
              <span>Pagamento seguro via Stripe</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
