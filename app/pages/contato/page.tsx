'use client';

import { useState } from 'react';
import { Mail, Phone, Send, MessageCircle } from 'lucide-react';

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, message } = formData;
    
    // Formata mensagem para WhatsApp
    const whatsappMessage = encodeURIComponent(
      `*Contato pelo Site*\n\n` +
      `*Nome:* ${name}\n` +
      `*Mensagem:* ${message}`
    );
    
    // Número da professora (formato internacional sem + ou -)
    const phoneNumber = '5562985553124';
    
    // Abre WhatsApp Web ou App
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
    
    // Abre em nova aba que é o padrão para links externos como WhatsApp
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
       <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-600 mb-4 flex items-center justify-center gap-3">
          <MessageCircle className="w-10 h-10" />
          Fale com a Professora
        </h1>
        <p className="text-xl text-gray-500">Tem alguma dúvida? Mande uma mensagem no WhatsApp!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Contact Info */}
        <div className="bg-green-500 p-8 text-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6">Informações de Contato</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-400 p-3 rounded-full">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-green-100 text-sm">Telefone / WhatsApp</p>
                <p className="font-semibold">+55 (62) 98555-3124</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-green-400 p-3 rounded-full">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-green-100 text-sm">Email</p>
                <p className="font-semibold">sararamos.prof@gmail.com</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-green-200 text-sm mb-2">Horário de Atendimento</p>
            <p className="font-medium">Segunda a Sexta: 07:00 - 17:00</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
              <input 
                type="text" 
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                placeholder="Como gostaria de ser chamado?"
              />
            </div>
            
            {/* Campo Email removido do formulário principal pois o foco é zap, mas mantido na info lateral */}
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
              <textarea 
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder-gray-400 resize-none"
                placeholder="Digite sua mensagem aqui..."
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Enviar para WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
