'use client';

import { useState } from 'react';
import { X, CreditCard, Banknote, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  price: string;
}

const PaymentModal = ({ isOpen, onClose, itemName, price }: PaymentModalProps) => {
  const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');

  if (!isOpen) return null;

  const handlePayment = () => {
    setStep('processing');
    // Simulate API call
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const handleClose = () => {
    setStep('method'); // Reset for next time
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl transform scale-100 transition-all">
        {/* Header */}
        <div className="bg-pink-50 p-6 flex justify-between items-center border-b border-pink-100">
          <h3 className="text-xl font-bold text-gray-800">
            {step === 'success' ? 'Pagamento Aprovado!' : 'Finalizar Compra'}
          </h3>
          <button onClick={handleClose} className="p-2 hover:bg-pink-100 rounded-full transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {step === 'method' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-gray-500 text-sm mb-1">Você está comprando:</p>
                <h4 className="text-lg font-bold text-gray-800">{itemName}</h4>
                <div className="text-3xl font-bold text-pink-600 mt-2">{price}</div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={handlePayment}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-100 rounded-2xl hover:border-pink-500 hover:bg-pink-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:bg-green-200">
                      <Banknote className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-700">Pagar com PIX</span>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">-5% OFF</span>
                </button>

                <button 
                  onClick={handlePayment}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-100 rounded-2xl hover:border-pink-500 hover:bg-pink-50 transition-all group"
                >
                   <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-200">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-700">Cartão de Crédito</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-medium animate-pulse">Processando pagamento...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10" />
              </div>
              <p className="text-center text-gray-600 mb-6">
                Parabéns! Sua compra foi realizada com sucesso. Você receberá o acesso por e-mail em instantes.
              </p>
              <button 
                onClick={handleClose}
                className="w-full bg-pink-600 text-white py-3 rounded-xl font-bold hover:bg-pink-700 transition-colors shadow-lg"
              >
                Fechar e Acessar
              </button>
            </div>
          )}
        </div>
        
        {step === 'method' && (
           <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
             <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
               <span className="w-2 h-2 bg-green-400 rounded-full"></span>
               Ambiente Seguro
             </p>
           </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
