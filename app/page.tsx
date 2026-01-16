import Link from 'next/link';
import { Video, Gamepad, Sparkles, Scissors } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 bg-gradient-to-b from-white to-pink-50 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-pink-500 mb-6 drop-shadow-sm animate-fade-in">
          Bem Vindos! <span className="text-yellow-400">✨</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Aqui você vai encontrar muitas coisas divertidas e educativas para as crianças.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/pages/jogos" className="bg-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-pink-600 hover:scale-105 transition-all flex items-center gap-2">
            <Gamepad className="w-6 h-6" />
            Jogos Educativos!
          </Link>
          <Link href="/pages/atividades" className="bg-white text-pink-500 border-2 border-pink-500 px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:bg-pink-50 hover:scale-105 transition-all flex items-center gap-2">
            <Scissors className="w-6 h-6" />
            Atividades para Sala!
          </Link>
        </div>
      </section>

      {/* Cards Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: 'Atividades Pedagógicas',
            desc: 'Recursos especiais para professores aplicarem em sala de aula.',
            icon: Scissors,
            color: 'bg-yellow-100',
            textColor: 'text-yellow-600',
            href: '/pages/atividades'
          },
          {
            title: 'Vídeos Divertidos',
            desc: 'Músicas e desenhos para aprender cantando.',
            icon: Video,
            color: 'bg-purple-100',
            textColor: 'text-purple-500',
            href: '/pages/videos'
          },
          {
            title: 'Jogos Educativos',
            desc: 'Aprenda brincando com nossos jogos especiais.',
            icon: Gamepad,
            color: 'bg-green-100',
            textColor: 'text-green-500',
            href: '/pages/jogos'
          }
        ].map((card, index) => {
          const Icon = card.icon;
          return (
            <Link href={card.href} key={index} className="group">
              <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-pink-200 h-full flex flex-col items-center text-center">
                <div className={`${card.color} p-6 rounded-full mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-10 h-10 ${card.textColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{card.title}</h3>
                <p className="text-gray-500 text-lg leading-relaxed">{card.desc}</p>
              </div>
            </Link>
          );
        })}
      </section>
      
      {/* Daily Tip Section */}
      <section className="w-full py-16 bg-white my-8 rounded-3xl max-w-5xl mx-4 shadow-sm border border-pink-100">
        <div className="text-center px-4">
          <div className="inline-block p-3 bg-yellow-100 rounded-full mb-4">
             <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Dica da Professora</h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Lembre-se de lavar as mãozinhas antes de comer e depois de brincar! A higiene é muito importante para nossa saúde. 🧼🚿
          </p>
        </div>
      </section>
    </div>
  );
}
