'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '../../../context/ProductsContext';
import { useCart } from '../../../context/CartContext';
import WatermarkedImage from '../../../components/WatermarkedImage';
import { 
  Loader2, 
  ShoppingBag, 
  ArrowLeft, 
  CheckCircle, 
  Share2, 
  ShieldCheck,
  Scissors,
  Video,
  Gamepad,
  Gift,
  Users
} from 'lucide-react';

const ageRangeLabels: Record<string, string> = {
  '0-2': '👶 0 a 2 anos',
  '3-4': '🧒 3 a 4 anos',
  '5-6': '👦 5 a 6 anos',
  '7-9': '🎒 7 a 9 anos',
  '10+': '👨‍🏫 10 anos ou mais',
  'todas': '🌈 Todas as idades',
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  const [copied, setCopied] = useState(false);

  // Find product
  const product = products.find(p => p.id === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Produto não encontrado</h1>
        <p className="text-gray-500 mb-6">O produto que você está procurando não existe ou foi removido.</p>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-pink-500 font-semibold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
      </div>
    );
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getIcon = () => {
    switch(product.type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'jogo': return <Gamepad className="w-5 h-5" />;
      case 'atividade': return <Scissors className="w-5 h-5" />;
      default: return <Gift className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    switch(product.type) {
        case 'video': return 'Vídeo Educativo';
        case 'jogo': return 'Jogo Interativo';
        case 'atividade': return 'Atividade Pedagógica';
        default: return 'Pacote Promocional';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-pink-600 transition-colors mb-6 font-medium group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar
        </button>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column: Image */}
            <div className="bg-gray-100 relative min-h-[400px] lg:min-h-[600px]">
               {product.imageUrl ? (
                  <WatermarkedImage
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
               ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                    {getIcon()}
                  </div>
               )}
            </div>

            {/* Right Column: Details */}
            <div className="p-8 lg:p-12 flex flex-col h-full">
              {/* Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
                  ${product.type === 'video' ? 'bg-purple-100 text-purple-700' :
                    product.type === 'jogo' ? 'bg-green-100 text-green-700' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                  {getIcon()}
                  {getTypeLabel()}
                </span>

                <button 
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all"
                  title="Copiar link"
                >
                  {copied ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
                </button>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {product.title}
              </h1>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-bold text-pink-600">
                  {formatPrice(product.price)}
                </span>
                {product.downloadUrl && (
                  <span className="flex items-center gap-1 text-sm text-green-600 font-medium mb-2 bg-green-50 px-2 py-1 rounded-lg">
                    <ShieldCheck className="w-4 h-4" />
                    Entrega Digital Imediata
                  </span>
                )}
              </div>

              {/* Age Range Badge - Prominent above description */}
              {product.ageRange && (
                <div className="mb-6 inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-xl font-medium border border-purple-100">
                  <Users className="w-5 h-5 text-purple-500" />
                  <span>
                    Indicação: <strong>{ageRangeLabels[product.ageRange] || product.ageRange}</strong>
                  </span>
                </div>
              )}

              <div className="prose prose-pink max-w-none text-gray-600 mb-8 flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sobre este material:</h3>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {product.description || 'Sem descrição detalhada.'}
                </p>
              </div>

              {/* Action Section */}
              <div className="mt-auto pt-8 border-t border-gray-100">
                <button
                  onClick={() => addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    type: product.type
                  })}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl active:scale-95 group"
                >
                  <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Adicionar ao Carrinho
                </button>
                <div className="mt-4 flex items-center justify-center gap-8 text-sm text-gray-500">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Compra Segura
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Acesso Vitalício
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
