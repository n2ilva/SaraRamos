'use client';

import { useState, useMemo } from 'react';
import { Video, ShoppingBag, Loader2, Filter, TrendingUp, X, Play, Youtube } from 'lucide-react';
import Link from 'next/link';
import WatermarkedImage from '../../components/WatermarkedImage';
import { useCart } from '../../context/CartContext';
import { useProducts, ProductCategory, categoryLabels } from '../../context/ProductsContext';

type FilterType = 'all' | 'popular' | ProductCategory;

// YouTube Videos Database
interface YouTubeVideo {
  id: string;
  title: string;
  videoId: string; // YouTube video ID
  category: ProductCategory;
  ageRange: string;
  description: string;
}

const youtubeVideos: YouTubeVideo[] = [
  // Alfabetização
  {
    id: 'yt-alfa-1',
    title: 'ABC - Galinha Pintadinha',
    videoId: 'BceHGzsDVLY',
    category: 'alfabetizacao',
    ageRange: '3-4',
    description: 'Aprenda o alfabeto com a Galinha Pintadinha!'
  },
  {
    id: 'yt-alfa-2',
    title: 'ABC do Bita - Mundo Bita',
    videoId: 'VHZJ48UMIE4',
    category: 'alfabetizacao',
    ageRange: '3-4',
    description: 'O ABC animado do Mundo Bita!'
  },
  {
    id: 'yt-alfa-3',
    title: 'Vogais - Aprendendo as Letras',
    videoId: 'REJwGWTa8BY',
    category: 'alfabetizacao',
    ageRange: '3-4',
    description: 'Aprenda as vogais de forma divertida!'
  },

  // Escrita
  {
    id: 'yt-escrita-1',
    title: 'Letra A - Aprender a Escrever',
    videoId: 'O6jBZKHH_C8',
    category: 'escrita',
    ageRange: '5-6',
    description: 'Aprenda a escrever a letra A!'
  },
  {
    id: 'yt-escrita-2',
    title: 'Alfabeto - Aprender a Escrever',
    videoId: 'kXcFLe77KBU',
    category: 'escrita',
    ageRange: '5-6',
    description: 'Aprenda a escrever todas as letras!'
  },
  {
    id: 'yt-escrita-3',
    title: 'Coordenação Motora - Tracejados',
    videoId: 'c3lmKBqN_Ao',
    category: 'escrita',
    ageRange: '5-6',
    description: 'Exercícios de tracejado para escrever melhor!'
  },

  // Matemática
  {
    id: 'yt-mat-1',
    title: 'Números 1 a 10 - Galinha Pintadinha',
    videoId: '0OanrQBC5Dc',
    category: 'matematica',
    ageRange: '3-4',
    description: 'Aprenda a contar com a Galinha Pintadinha!'
  },
  {
    id: 'yt-mat-2',
    title: 'Números - Mundo Bita',
    videoId: '8SrwCeau_xU',
    category: 'matematica',
    ageRange: '3-4',
    description: 'Aprenda os números com o Mundo Bita!'
  },
  {
    id: 'yt-mat-3',
    title: 'Contando até 20',
    videoId: 'SSPdyNbJfEk',
    category: 'matematica',
    ageRange: '5-6',
    description: 'Aprenda a contar até 20!'
  },

  // Lógica
  {
    id: 'yt-logica-1',
    title: 'Formas Geométricas - Aprender',
    videoId: 'OT6vKwHRuVw',
    category: 'logica',
    ageRange: '5-6',
    description: 'Conheça as formas geométricas!'
  },
  {
    id: 'yt-logica-2',
    title: 'Cores - Aprender Cantando',
    videoId: 'doX-V7u6R-w',
    category: 'logica',
    ageRange: '3-4',
    description: 'Aprenda as cores de forma divertida!'
  },
  {
    id: 'yt-logica-3',
    title: 'Tamanhos - Grande e Pequeno',
    videoId: 'u6qxixgQJ4M',
    category: 'logica',
    ageRange: '3-4',
    description: 'Aprenda sobre tamanhos e proporções!'
  },

  // Coordenação Motora
  {
    id: 'yt-coord-1',
    title: 'Dança da Laranja - Mundo Bita',
    videoId: 'cBdvz61m_hA',
    category: 'coordenacao',
    ageRange: '3-4',
    description: 'Dance e desenvolva coordenação motora!'
  },
  {
    id: 'yt-coord-2',
    title: 'Cabeça, Ombro, Joelho e Pé',
    videoId: 'w8s_p1BcOH8',
    category: 'coordenacao',
    ageRange: '3-4',
    description: 'Aprenda as partes do corpo dançando!'
  },
  {
    id: 'yt-coord-3',
    title: 'Mexe Mexe - Mundo Bita',
    videoId: 'j4KQxfPKMNY',
    category: 'coordenacao',
    ageRange: '3-4',
    description: 'Movimente o corpo com música!'
  },

  // Artes
  {
    id: 'yt-artes-1',
    title: 'Como Desenhar - Fácil para Crianças',
    videoId: 'ZPnJN-qE71Q',
    category: 'artes',
    ageRange: '5-6',
    description: 'Aprenda a desenhar passo a passo!'
  },
  {
    id: 'yt-artes-2',
    title: 'Pintura e Arte - Criatividade',
    videoId: 'gmOv7aXqhKo',
    category: 'artes',
    ageRange: '5-6',
    description: 'Explore sua criatividade com arte!'
  },
  {
    id: 'yt-artes-3',
    title: 'Artes Manuais - DIY Kids',
    videoId: 'YT9WRLaSF_M',
    category: 'artes',
    ageRange: '7-9',
    description: 'Projetos de artesanato para crianças!'
  },

  // Ciências
  {
    id: 'yt-ciencias-1',
    title: 'Planetas - Sistema Solar',
    videoId: 'h2n-HJ4CMxw',
    category: 'ciencias',
    ageRange: '7-9',
    description: 'Conheça os planetas do sistema solar!'
  },
  {
    id: 'yt-ciencias-2',
    title: 'Animais Terrestres e Aquáticos',
    videoId: 'PbxuBaBF8G0',
    category: 'ciencias',
    ageRange: '5-6',
    description: 'Descubra os diferentes tipos de animais!'
  },
  {
    id: 'yt-ciencias-3',
    title: 'Plantas e Natureza',
    videoId: 'hn-8cQh7Kv0',
    category: 'ciencias',
    ageRange: '5-6',
    description: 'Aprenda sobre plantas e a natureza!'
  },

  // Música
  {
    id: 'yt-musica-1',
    title: 'Galinha Pintadinha 1 - Completo',
    videoId: 'CeZWfW2fwPQ',
    category: 'musica',
    ageRange: '0-2',
    description: 'Músicas infantis da Galinha Pintadinha!'
  },
  {
    id: 'yt-musica-2',
    title: 'Mundo Bita - Melhores Músicas',
    videoId: 'xImFXI7JKYQ',
    category: 'musica',
    ageRange: '3-4',
    description: 'Coletânea musical do Mundo Bita!'
  },
  {
    id: 'yt-musica-3',
    title: 'Palavra Cantada - Clássicos',
    videoId: 'PXFRjGHoBmg',
    category: 'musica',
    ageRange: '3-4',
    description: 'Músicas educativas da Palavra Cantada!'
  },

  // Socioemocional
  {
    id: 'yt-socio-1',
    title: 'O Monstro das Cores - Emoções',
    videoId: 'S-4r52rLqkE',
    category: 'socioemocional',
    ageRange: '5-6',
    description: 'Aprenda sobre emoções e sentimentos!'
  },
  {
    id: 'yt-socio-2',
    title: 'Amizade e Gentileza',
    videoId: 'GqN1ToRlqcQ',
    category: 'socioemocional',
    ageRange: '3-4',
    description: 'A importância da amizade e ser gentil!'
  },
  {
    id: 'yt-socio-3',
    title: 'Valores - Respeito e Empatia',
    videoId: 'piy6Rg8dw2Q',
    category: 'socioemocional',
    ageRange: '5-6',
    description: 'Aprenda sobre valores importantes!'
  },
];

const filterOptions: { value: FilterType; label: string; color: string }[] = [
  { value: 'all', label: '✨ Todos', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  { value: 'popular', label: '🔥 Mais Assistidos', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
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

export default function VideosPage() {
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeAgeFilter, setActiveAgeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter only active "video" products
  const videos = useMemo(() => {
    let filtered = products.filter(p => p.type === 'video' && p.isActive);

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

  // Filter YouTube videos
  const filteredYouTubeVideos = useMemo(() => {
    let filtered = [...youtubeVideos];

    // Apply category filter (ignore "popular" for free videos)
    if (activeFilter !== 'all' && activeFilter !== 'popular') {
      filtered = filtered.filter(v => v.category === activeFilter);
    }

    // Apply age filter
    if (activeAgeFilter !== 'all') {
      filtered = filtered.filter(v => v.ageRange === activeAgeFilter);
    }

    return filtered;
  }, [activeFilter, activeAgeFilter]);

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
          <Video className="w-10 h-10" />
          Vídeos Educativos
        </h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
          Aprenda brincando com nossos vídeos! Conteúdos audiovisuais que complementam o aprendizado de forma lúdica e divertida.
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
                    ? 'bg-purple-500 text-white shadow-md scale-105'
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
            {videos.length} {videos.length === 1 ? 'resultado' : 'resultados'}
            {activeFilter !== 'popular' && (
              <> em <strong>{categoryLabels[activeFilter]}</strong></>
            )}
          </span>
        </div>
      )}

      {/* Free YouTube Videos Section */}
      {filteredYouTubeVideos.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Youtube className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-800">Vídeos Gratuitos do YouTube</h2>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
              GRÁTIS
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredYouTubeVideos.map((video) => (
              <Link 
                key={video.id}
                href={`/pages/video-player/${video.id}`}
                className="bg-white rounded-2xl shadow-md border-2 border-red-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1 cursor-pointer"
              >
                {/* Thumbnail with Play Overlay */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                    }}
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="bg-red-600 p-4 rounded-full shadow-2xl transform group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-current ml-1" />
                    </div>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                      {categoryLabels[video.category]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <Youtube className="w-5 h-5 text-red-600" />
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                      YouTube Educativo
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                    {video.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {ageOptions.find(a => a.value === video.ageRange)?.label || video.ageRange}
                    </span>
                    <span className="text-lg font-bold text-green-600">
                      GRÁTIS
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Premium Videos Section */}
      {videos.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Video className="w-8 h-8 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Vídeos Premium</h2>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
              CONTEÚDO EXCLUSIVO
            </span>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {videos.length === 0 && filteredYouTubeVideos.length === 0 ? (
        <div className="text-center py-16">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {activeFilter === 'all' 
              ? 'Nenhum vídeo disponível no momento'
              : 'Nenhum vídeo encontrado nesta categoria'
            }
          </p>
          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 text-pink-500 font-medium hover:underline"
            >
              Ver todos os vídeos
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div 
              key={video.id} 
              className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Thumbnail */}
              <Link href={`/pages/produto/${video.id}`} className="block relative cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                  {video.imageUrl ? (
                    <WatermarkedImage
                      src={video.imageUrl}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 4}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Video className="w-16 h-16 text-purple-500 opacity-50" />
                    </div>
                  )}
                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                    <div className="bg-white/90 p-4 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-pink-600 fill-current" />
                    </div>
                  </div>
                  {/* Category Badge */}
                  {video.category && video.category !== 'geral' && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                        {categoryLabels[video.category]}
                      </span>
                    </div>
                  )}
                  {/* Popular Badge */}
                  {(video.purchaseCount || 0) > 10 && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Popular
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium w-fit mb-3">
                  🎬 Vídeo Educativo
                </span>

                <Link href={`/pages/produto/${video.id}`} className="hover:text-pink-600 transition-colors">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {video.title}
                  </h2>
                </Link>

                {video.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                    {video.description}
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-pink-600">
                    {formatPrice(video.price)}
                  </span>
                  <button 
                    onClick={() => addToCart({
                      id: video.id,
                      title: video.title,
                      price: video.price,
                      type: 'video'
                    })}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-3 rounded-xl font-bold hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Adicionar
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
