'use client';

import { useState } from 'react';
import { BookOpen, Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function LivrosPage() {
  const { addToCart } = useCart();

  const books = [
    { title: "O Pequeno Príncipe", cover: "🤴", color: "bg-blue-200", price: "R$ 19,90" },
    { title: "Chapeuzinho Vermelho", cover: "🐺", color: "bg-red-200", price: "R$ 14,90" },
    { title: "Os Três Porquinhos", cover: "🐷", color: "bg-pink-200", price: "R$ 15,90" },
    { title: "Branca de Neve", cover: "🍎", color: "bg-yellow-200", price: "R$ 18,90" },
    { title: "O Gato de Botas", cover: "🐱", color: "bg-orange-200", price: "R$ 16,90" },
    { title: "Peter Pan", cover: "🧚", color: "bg-green-200", price: "R$ 21,90" },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-pink-600 mb-4 flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10" />
            Livros Digitais
          </h1>
          <p className="text-xl text-gray-500">Histórias mágicas para sua coleção!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer group overflow-hidden border border-pink-100 flex flex-col h-full">
              <div className={`${book.color} h-40 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300 relative`}>
                {book.cover}
                <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg text-sm font-bold text-gray-700 shadow-sm">
                  {book.price}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow justify-between">
                <h3 className="font-bold text-gray-800 text-lg mb-3">{book.title}</h3>
                <button 
                  onClick={() => addToCart({
                    id: `book-${index}`,
                    title: book.title, 
                    price: parseFloat(book.price.replace('R$ ', '').replace(',', '.')),
                    type: 'livro'
                  })}
                  className="w-full py-2 rounded-xl bg-pink-50 text-pink-600 font-bold group-hover:bg-pink-500 group-hover:text-white transition-colors flex items-center justify-center gap-2 active:scale-95 duration-100"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Adicionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
