'use client';

import { Gamepad, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductsContext';

export default function JogosPage() {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  // Filter only active "jogo" products
  const jogos = products.filter(p => p.type === 'jogo' && p.isActive);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-pink-600 mb-4 flex items-center justify-center gap-3">
          <Gamepad className="w-10 h-10" />
          Jogos Educativos
        </h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
          Aprender nunca foi tão divertido! Jogos interativos que estimulam o raciocínio enquanto divertem.
        </p>
      </div>

      {jogos.length === 0 ? (
        <div className="text-center py-16">
          <Gamepad className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Nenhum jogo disponível no momento</p>
          <p className="text-gray-400 text-sm mt-2">Volte em breve para conferir novidades!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jogos.map((jogo) => (
            <div 
              key={jogo.id} 
              className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Image */}
              <div className="aspect-video overflow-hidden relative">
                {jogo.imageUrl ? (
                  <img
                    src={jogo.imageUrl}
                    alt={jogo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <Gamepad className="w-16 h-16 text-green-500 opacity-50" />
                  </div>
                )}
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    🎮 Interativo
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {jogo.title}
                </h2>

                {jogo.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {jogo.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-2xl font-bold text-pink-600">
                    {formatPrice(jogo.price)}
                  </span>
                  <button 
                    onClick={() => addToCart({
                      id: jogo.id,
                      title: jogo.title,
                      price: jogo.price,
                      type: 'jogo'
                    })}
                    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Jogar!
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
