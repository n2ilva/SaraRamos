
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContatoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
       <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-pink-600 mb-4 flex items-center justify-center gap-3">
          <Mail className="w-10 h-10" />
          Fale com a Professora
        </h1>
        <p className="text-xl text-gray-500">Tem alguma dúvida? Mande uma mensagem!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Contact Info */}
        <div className="bg-pink-500 p-8 text-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-pink-400 p-3 rounded-full">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-pink-100 text-sm">Telefone</p>
                <p className="font-semibold">+55 (62) 98555-3124</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-pink-400 p-3 rounded-full">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-pink-100 text-sm">Email</p>
                <p className="font-semibold">sararamos.prof@gmail.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-pink-200 text-sm mb-2">Horário de Atendimento</p>
            <p className="font-medium">Segunda a Sexta: 07:00 - 17:00</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável</label>
              <input 
                type="text" 
                id="name"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                placeholder="Seu nome"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                id="email"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea 
                id="message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all placeholder-gray-400 resize-none"
                placeholder="Olá professora..."
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition-all flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              Enviar Mensagem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
