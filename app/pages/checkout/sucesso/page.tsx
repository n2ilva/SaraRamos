'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Home, ArrowRight } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useAuth } from '../../../context/AuthContext';

interface PendingPurchase {
  items: { title: string; price: number; type: string }[];
  total: number;
  timestamp: number;
}

export default function SucessoPage() {
  const { clearCart } = useCart();
  const { user, addPurchase } = useAuth();
  const [pendingPurchase, setPendingPurchase] = useState<PendingPurchase | null>(null);
  const [purchaseRecorded, setPurchaseRecorded] = useState(false);
  
  // Use refs to prevent multiple executions
  const hasProcessed = useRef(false);
  const hasRecordedPurchase = useRef(false);

  // Memoize clearCart to avoid dependency issues
  const clearCartRef = useRef(clearCart);

  useEffect(() => {
    clearCartRef.current = clearCart;
  }, [clearCart]);

  // Load pending purchase from localStorage (runs once on mount)
  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const pendingPurchaseData = localStorage.getItem('pending_purchase');
    
    if (pendingPurchaseData) {
      try {
        const purchase = JSON.parse(pendingPurchaseData) as PendingPurchase;
        
        // Check if purchase is recent (within last hour)
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        
        if (purchase.timestamp > oneHourAgo) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          setPendingPurchase(purchase);
          // Use ref to call clearCart without adding it as dependency
          clearCartRef.current();
        } else {
          // Old pending purchase, remove it
          localStorage.removeItem('pending_purchase');
        }
      } catch (err) {
        console.error('Error parsing pending purchase:', err);
        localStorage.removeItem('pending_purchase');
      }
    }
  }, []);

  // Record purchase to Firebase when user is available
  useEffect(() => {
    if (!pendingPurchase || !user || hasRecordedPurchase.current || purchaseRecorded) {
      return;
    }

    const recordPurchase = async () => {
      try {
        hasRecordedPurchase.current = true;
        await addPurchase(pendingPurchase.items, pendingPurchase.total);
        setPurchaseRecorded(true);
        localStorage.removeItem('pending_purchase');
        console.log('Purchase recorded successfully');
      } catch (err) {
        console.error('Error recording purchase:', err);
        hasRecordedPurchase.current = false;
      }
    };

    recordPurchase();
  }, [pendingPurchase, user, addPurchase, purchaseRecorded]);

  const formatPrice = useCallback((cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25"></div>
            <div className="relative p-5 bg-green-100 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Compra Realizada! 🎉
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Obrigado pela sua compra! Seus conteúdos educativos já estão disponíveis.
          </p>

          {/* Purchase Details */}
          {pendingPurchase && pendingPurchase.items.length > 0 && (
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Itens Comprados:
              </h3>
              <ul className="space-y-3">
                {pendingPurchase.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{item.title}</span>
                    <span className="font-semibold text-gray-800">
                      {formatPrice(item.price)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-800">Total:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatPrice(pendingPurchase.total)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pages/perfil"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-200"
            >
              Ver Minhas Compras
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              <Home className="w-5 h-5" />
              Voltar ao Início
            </Link>
          </div>
        </div>

        {/* Confetti animation */}
        <div className="text-center mt-8 text-4xl animate-bounce">
          🎊
        </div>
      </div>
    </div>
  );
}
