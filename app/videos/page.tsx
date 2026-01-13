
import { Video, PlayCircle } from 'lucide-react';

export default function VideosPage() {
  const videos = [
    { title: "Aprendendo o Alfabeto", duration: "10:00", color: "bg-red-500" },
    { title: "Números Divertidos", duration: "05:30", color: "bg-blue-500" },
    { title: "As Cores do Arco-íris", duration: "03:45", color: "bg-purple-500" },
    { title: "Animais da Fazenda", duration: "08:20", color: "bg-green-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-pink-600 mb-4 flex items-center justify-center gap-3">
          <Video className="w-10 h-10" />
          Vídeos Educativos
        </h1>
        <p className="text-xl text-gray-500">Aprenda assistindo vídeos divertidos!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.map((video, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 group cursor-pointer">
            <div className={`aspect-video ${video.color} relative flex items-center justify-center bg-opacity-80`}>
              <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlayCircle className="w-10 h-10 text-white fill-current" />
              </div>
              <span className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm font-medium">
                {video.duration}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">{video.title}</h3>
              <p className="text-gray-500">Clique para assistir e aprender.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
