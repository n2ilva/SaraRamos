'use client';

import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  Calendar, 
  LogOut, 
  User as UserIcon,
  Video,
  Gamepad,
  Scissors,
  Gift,
  Download,
  Play,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/pages/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!user) return null;

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'jogo':
        return <Gamepad className="w-5 h-5" />;
      case 'atividade':
        return <Scissors className="w-5 h-5" />;
      case 'pacote':
        return <Gift className="w-5 h-5" />;
      default:
        return <ShoppingBag className="w-5 h-5" />;
    }
  };

  const getProductColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-purple-100 text-purple-600';
      case 'jogo':
        return 'bg-green-100 text-green-600';
      case 'atividade':
        return 'bg-yellow-100 text-yellow-600';
      case 'pacote':
        return 'bg-pink-100 text-pink-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-md p-8 mb-8 border border-pink-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="bg-pink-100 p-6 rounded-full">
            <UserIcon className="w-12 h-12 text-pink-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Olá, {user.name}!</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        <button 
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-6 py-3 rounded-xl transition-colors font-medium border border-red-100 hover:border-red-200"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>

      {/* Content Library */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <ShoppingBag className="w-6 h-6 text-pink-500" />
        Minha Biblioteca de Aprendizado
      </h2>

      {user.purchases.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm p-12 border border-gray-100 flex flex-col items-center justify-center text-center">
           <div className="bg-gray-50 p-6 rounded-full mb-4">
             <ShoppingBag className="w-16 h-16 text-gray-300" />
           </div>
           <h3 className="text-xl font-bold text-gray-700 mb-2">Você ainda não tem materiais</h3>
           <p className="text-gray-500 max-w-sm">Explore nossas atividades, jogos e vídeos para começar a aprender se divertindo!</p>
           <button 
             onClick={() => router.push('/pages/atividades')}
             className="mt-6 bg-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-200"
           >
             Explorar Atividades
           </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Purchased Items List */}
          <div className="grid grid-cols-1 gap-6">
            {user.purchases.flatMap(purchase => purchase.items).map((item, idx) => (
              <div key={`${item.title}-${idx}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${getProductColor(item.type)}`}>
                  {getProductIcon(item.type)}
                </div>

                {/* Info */}
                <div className="flex-grow text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getProductColor(item.type)} bg-opacity-10`}>
                      {item.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                  <p className="text-green-600 font-medium text-sm mt-1">
                    Comprado
                  </p>
                </div>

                {/* Action Button */}
                <button className={`shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
                  item.type === 'video' 
                    ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-purple-200' 
                    : item.type === 'jogo'
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200'
                    : 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200'
                }`}>
                  {item.type === 'video' ? (
                    <>
                      <Play className="w-5 h-5" /> Assistir
                    </>
                  ) : item.type === 'jogo' ? (
                    <>
                      <Gamepad className="w-5 h-5" /> Jogar
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" /> Baixar
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Purchase History Accordion (more compact) */}
          <div className="mt-12 pt-12 border-t border-gray-100">
            <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              Histórico de Pedidos
            </h3>
            <div className="space-y-4">
              {user.purchases.map((purchase) => (
                <div key={purchase.id} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between text-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-700">Pedido realizado em {purchase.date}</span>
                    <span className="text-gray-500">{purchase.items.length} itens</span>
                  </div>
                  <span className="font-bold text-gray-800">{formatPrice(purchase.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
