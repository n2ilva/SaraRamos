'use client';

import { useState, useMemo } from 'react';
import { Scissors, ShoppingBag, Loader2, Filter, TrendingUp, X } from 'lucide-react';
import Link from 'next/link';
import WatermarkedImage from '../../components/WatermarkedImage';
import { useCart } from '../../context/CartContext';
import { useProducts, ProductCategory, categoryLabels } from '../../context/ProductsContext';

type FilterType = 'all' | 'popular' | ProductCategory;

const filterOptions: { value: FilterType; label: string; color: string }[] = [
  { value: 'all', label: '✨ Todos', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { value: 'popular', label: '🔥 Mais Comprados', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { value: 'alfabetizacao', label: '📖 Aprendendo a Ler', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { value: 'escrita', label: '✏️ Aprendendo a Escrever', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
  { value: 'matematica', label: '🔢 Matemática', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'logica', label: '🧩 Lógica e Raciocínio', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  { value: 'coordenacao', label: '✋ Coordenação Motora', color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
  { value: 'artes', label: '🎨 Artes e Criatividade', color: 'bg-rose-100 text-rose-700 hover:bg-rose-200' },
  { value: 'ciencias', label: '🔬 Ciências e Natureza', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { value: 'musica', label: '🎵 Musicalização', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { value: 'socioemocional', label: '💝 Socioemocional', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
];

const ageOptions = [
  { value: 'all', label: 'Todas as Idades' },
  { value: '0-2', label: '🍼 0-2 anos' },
  { value: '3-4', label: '🪁 3-4 anos' },
  { value: '5-6', label: '🚀 5-6 anos' },
  { value: '7-9', label: '🛸 7-9 anos' },
  { value: '10+', label: '🪐 10+ anos' },
];

export default function AtividadesPage() {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeAgeFilter, setActiveAgeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter only active "atividade" products
  const atividades = useMemo(() => {
    let filtered = products.filter(p => p.type === 'atividade' && p.isActive);

    // Apply category filter
    if (activeFilter === 'popular') {
      // Sort by purchaseCount (most purchased first)
      filtered = [...filtered].sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
    } else if (activeFilter !== 'all') {
      filtered = filtered.filter(p => p.category === activeFilter);
    }

    // Apply age filter
    if (activeAgeFilter !== 'all') {
      filtered = filtered.filter(p => p.ageRange === activeAgeFilter || p.ageRange === 'todas');
    }

    return filtered;
  }, [products, activeFilter, activeAgeFilter]);

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
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-pink-600 mb-4 flex items-center justify-center gap-3">
          <Scissors className="w-10 h-10" />
          Atividades Pedagógicas
        </h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
          Recursos especiais para professores. Encontre inspiração para suas aulas com planos de aula criativos e educativos.
        </p>
      </div>

      {/* Filter Toggle Button (Mobile) */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium shadow-sm"
        >
          <Filter className="w-5 h-5" />
          Filtros
          {activeFilter !== 'all' && (
            <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">1</span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className={`mb-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-700">Filtrar por:</span>
            {activeFilter !== 'all' && (
              <button
                onClick={() => setActiveFilter('all')}
                className="ml-auto flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
                Limpar
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter.value
                    ? 'bg-pink-500 text-white shadow-md scale-105'
                    : filter.color
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
             <div className="flex items-center gap-2 mb-4">
              <span className="font-semibold text-gray-700">Faixa Etária:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ageOptions.map((age) => (
                <button
                  key={age.value}
                  onClick={() => setActiveAgeFilter(age.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    activeAgeFilter === age.value
                      ? 'bg-purple-500 text-white border-purple-500 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                  }`}
                >
                  {age.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      {activeFilter !== 'all' && (
        <div className="mb-6 flex items-center gap-2 text-gray-600">
          {activeFilter === 'popular' && <TrendingUp className="w-5 h-5 text-orange-500" />}
          <span>
            {atividades.length} {atividades.length === 1 ? 'resultado' : 'resultados'}
            {activeFilter !== 'popular' && (
              <> em <strong>{categoryLabels[activeFilter]}</strong></>
            )}
          </span>
        </div>
      )}

      {/* Products Grid */}
      {atividades.length === 0 ? (
        <div className="text-center py-16">
          <Scissors className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {activeFilter === 'all' 
              ? 'Nenhuma atividade disponível no momento'
              : 'Nenhuma atividade encontrada nesta categoria'
            }
          </p>
          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 text-pink-500 font-medium hover:underline"
            >
              Ver todas as atividades
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {atividades.map((atividade, index) => (
            <div 
              key={atividade.id} 
              className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Link Wrapper for Image */}
              <Link href={`/pages/produto/${atividade.id}`} className="block relative cursor-pointer">
                {atividade.imageUrl ? (
                  <div className="aspect-video overflow-hidden relative">
                    <WatermarkedImage
                      src={atividade.imageUrl}
                      alt={atividade.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 4}
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                    <Scissors className="w-16 h-16 text-yellow-500 opacity-50" />
                  </div>
                )}
                {/* Visual overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
                
                {/* Category Badge */}
                {atividade.category && atividade.category !== 'geral' && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                      {categoryLabels[atividade.category]}
                    </span>
                  </div>
                )}
                {/* Popular Badge */}
                {(atividade.purchaseCount || 0) > 10 && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Popular
                    </span>
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-3">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                    ✂️ Atividade
                  </span>
                  <span className="text-2xl font-bold text-pink-600">
                    {formatPrice(atividade.price)}
                  </span>
                </div>

                <Link href={`/pages/produto/${atividade.id}`} className="hover:text-pink-600 transition-colors">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {atividade.title}
                  </h2>
                </Link>

                {atividade.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {atividade.description}
                  </p>
                )}

                <button 
                  onClick={() => addToCart({
                    id: atividade.id,
                    title: atividade.title,
                    price: atividade.price,
                    type: 'atividade'
                  })}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg active:scale-95 duration-100"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
