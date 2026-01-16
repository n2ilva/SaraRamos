'use client';

import Link from 'next/link';
import { XCircle, Home, RefreshCcw } from 'lucide-react';

export default function CanceladoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Cancel Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          {/* Cancel Icon */}
          <div className="p-5 bg-gray-100 rounded-full inline-block mb-6">
            <XCircle className="w-16 h-16 text-gray-400" />
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Compra Cancelada
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Você cancelou o processo de pagamento. Não se preocupe, nenhuma cobrança foi feita.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8">
            <p className="text-blue-700 text-sm">
              💡 <strong>Dica:</strong> Seus itens ainda estão no carrinho! 
              Você pode retomar a compra quando quiser.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-200"
            >
              <RefreshCcw className="w-5 h-5" />
              Continuar Comprando
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

        {/* Help Section */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Precisa de ajuda?{' '}
            <Link href="/pages/contato" className="text-pink-500 hover:underline font-medium">
              Entre em contato
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
