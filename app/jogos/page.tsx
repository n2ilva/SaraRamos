
import { Gamepad, Puzzle } from 'lucide-react';

export default function JogosPage() {
  const games = [
    { title: "Jogo da Memória", icon: "🧠", color: "from-pink-400 to-pink-600" },
    { title: "Quebra-Cabeça", icon: "🧩", color: "from-blue-400 to-blue-600" },
    { title: "Matemática Divertida", icon: "🔢", color: "from-green-400 to-green-600" },
    { title: "Pintura Mágica", icon: "🎨", color: "from-yellow-400 to-yellow-600" },
    { title: "Soletrando", icon: "📝", color: "from-purple-400 to-purple-600" },
    { title: "Piano Virtual", icon: "🎹", color: "from-red-400 to-red-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-pink-600 mb-4 flex items-center justify-center gap-3">
          <Gamepad className="w-10 h-10" />
          Jogos Educativos
        </h1>
        <p className="text-xl text-gray-500">Divirta-se enquanto aprende!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => (
          <div key={index} className="group relative overflow-hidden rounded-3xl shadow-lg cursor-pointer transform transition-all hover:scale-105">
            <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-90 transition-opacity`}></div>
            <div className="relative p-8 h-64 flex flex-col items-center justify-center text-center">
              <span className="text-6xl mb-4 drop-shadow-md transform group-hover:rotate-12 transition-transform duration-300">
                {game.icon}
              </span>
              <h3 className="text-2xl font-bold text-white mb-2 shadow-sm">{game.title}</h3>
              <button className="mt-4 px-6 py-2 bg-white text-gray-800 rounded-full font-bold shadow-md hover:bg-gray-50 transition-colors">
                Jogar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
