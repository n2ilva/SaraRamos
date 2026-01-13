'use client';

import { useState } from 'react';
import { Scissors, Clock, Users, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function AtividadesPage() {
  const { addToCart } = useCart();

  const activities = [
    {
      title: "Arte com Colagem de Folhas",
      subject: "Artes",
      ageGroup: "3-5 anos",
      duration: "40 min",
      description: "Uma atividade divertida para explorar a natureza. Os alunos coletam folhas no pátio e criam animais divertidos colando-as no papel.",
      materials: ["Folhas secas", "Cola branca", "Papel A4", "Lápis de cor"],
      color: "bg-green-100",
      iconColor: "text-green-600",
      price: "R$ 9,90"
    },
    {
      title: "Matemática com Massinha",
      subject: "Matemática",
      ageGroup: "4-6 anos",
      duration: "30 min",
      description: "Usando massinha de modelar para criar números e formas geométricas. Ótimo para coordenação motora fina e reconhecimento numérico.",
      materials: ["Massinha de modelar colorida", "Cartões com números"],
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      price: "R$ 12,90"
    },
    {
      title: "Teatro de Fantoches",
      subject: "Expressão Oral",
      ageGroup: "5-7 anos",
      duration: "1 hora",
      description: "Criação de fantoches simples usando meias velhas ou sacos de papel. As crianças apresentam pequenas histórias para a turma.",
      materials: ["Meias ou sacos de papel", "Lã", "Botões", "Cola quente"],
      color: "bg-yellow-100",
      iconColor: "text-yellow-600",
      price: "R$ 14,90"
    },
    {
      title: "Circuito das Cores",
      subject: "Educação Física",
      ageGroup: "3-6 anos",
      duration: "50 min",
      description: "Um circuito onde as crianças devem pular apenas nos arcos da cor que a professora falar. Trabalha agilidade e reconhecimento de cores.",
      materials: ["Arcos coloridos (bambolês)", "Cones"],
      color: "bg-red-100",
      iconColor: "text-red-600",
      price: "R$ 8,90"
    }
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-pink-600 mb-4 flex items-center justify-center gap-3">
            <Scissors className="w-10 h-10" />
            Atividades Pedagógicas
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Recursos especiais para professores. Encontre inspiração para suas aulas com planos de aula criativos e educativos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {activities.map((activity, index) => (
            <div key={index} className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col md:flex-row">
                {/* Left Color Strip/Icon Area */}
                <div className={`${activity.color} p-8 flex flex-col items-center justify-center md:w-48 text-center shrink-0`}>
                  <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                    <Star className={`w-8 h-8 ${activity.iconColor}`} />
                  </div>
                  <span className={`font-bold ${activity.iconColor} text-lg`}>{activity.subject}</span>
                  <div className="mt-4 bg-white/50 backdrop-blur-sm px-3 py-1 rounded-lg font-bold text-gray-800 border border-black/5">
                    {activity.price}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex-grow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">{activity.title}</h2>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                        <Users className="w-4 h-4" /> {activity.ageGroup}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                        <Clock className="w-4 h-4" /> {activity.duration}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {activity.description}
                  </p>

                  <div className="mb-6">
                    <h3 className="font-bold text-gray-700 mb-2">Materiais Necessários:</h3>
                    <ul className="list-disc list-inside text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {activity.materials.map((material, idx) => (
                        <li key={idx}>{material}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    <button 
                      onClick={() => addToCart({
                        id: `activity-${index}`,
                        title: activity.title,
                        price: parseFloat(activity.price.replace('R$ ', '').replace(',', '.')),
                        type: 'atividade'
                      })}
                      className="flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors shadow-md hover:shadow-lg active:scale-95 duration-100"
                    >
                      <ShoppingBag className="w-5 h-5" />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
