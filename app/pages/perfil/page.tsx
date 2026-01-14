'use client';

import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Calendar, LogOut, User as UserIcon } from 'lucide-react';
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
          className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors font-medium border border-red-100 hover:border-red-200"
        >
          <LogOut className="w-5 h-5" />
          Sair da Conta
        </button>
      </div>

      {/* Purchases */}
      <div className="bg-white rounded-3xl shadow-md p-8 border border-pink-100 min-h-[400px]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <ShoppingBag className="w-6 h-6 text-pink-500" />
          Meus Pedidos
        </h2>

        {user.purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
             <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
             <p className="text-lg">Você ainda não fez nenhuma compra.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {user.purchases.map((purchase) => (
              <div key={purchase.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:border-pink-200 transition-colors">
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{purchase.date}</span>
                  </div>
                  <span className="font-bold text-gray-800">Total: R$ {purchase.total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {purchase.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                          ${item.type === 'livro' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                          {item.type === 'livro' ? '📚' : '✂️'}
                        </div>
                        <span className="text-gray-700">{item.title}</span>
                         <span className="text-gray-400 text-sm ml-auto">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
