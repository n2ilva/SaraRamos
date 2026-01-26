'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Youtube } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  videoId: string;
  category: string;
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

export default function VideoPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.videoId as string;

  const video = youtubeVideos.find(v => v.id === videoId);

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Youtube className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Vídeo não encontrado</h1>
        <p className="text-gray-600 mb-6">O vídeo que você está procurando não existe.</p>
        <button
          onClick={() => router.push('/pages/videos')}
          className="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-all shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Vídeos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/pages/videos')}
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Vídeos
        </button>

        {/* Video Player Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-100">
          {/* Video Player */}
          <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
              title={video.title}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Info */}
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Youtube className="w-6 h-6 text-red-600" />
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                YouTube Educativo
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                GRÁTIS
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {video.title}
            </h1>

            <p className="text-gray-600 text-lg mb-6">
              {video.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                Faixa Etária: {video.ageRange}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/pages/videos')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5" />
            Assistir Outro Vídeo
          </button>
        </div>
      </div>
    </div>
  );
}
