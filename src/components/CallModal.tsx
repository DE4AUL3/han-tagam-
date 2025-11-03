import React from 'react';
import { Phone, X, Utensils, Coffee, ChefHat, Pizza } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getText } from '@/i18n/translations';

interface Contact {
  phone: string;
  icon: React.ReactNode;
}

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const contacts: Contact[] = [
  { 
    phone: '8 64 530011', 
    icon: <ChefHat className="w-5 h-5" />
  },
  { 
    phone: '8 62 530011', 
    icon: <Pizza className="w-5 h-5" />
  },
  { 
    phone: '8 63 891818', 
    icon: <Coffee className="w-5 h-5" />
  },
  { 
    phone: '8 65 530011', 
    icon: <Utensils className="w-5 h-5" />
  },
];

export default function CallModal({ isOpen, onClose }: CallModalProps) {
  const { currentLanguage } = useLanguage();

  if (!isOpen) return null;

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone.replace(/\D/g, '')}`;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-[#d4af37]/20 animate-zoom-in-95 overflow-hidden">
        {/* Заголовок с золотым градиентом */}
        <div className="relative px-6 py-6 bg-gradient-to-r from-[#d4af37] to-[#b8860b]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#f4f1e8]/10 to-[#fff8e1]/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{getText('contactUs', currentLanguage)}</h2>
                <p className="text-white/90 text-sm">{getText('selectPhone', currentLanguage)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
              aria-label={getText('close', currentLanguage)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Список контактов */}
        <div className="p-6 space-y-3">
          {contacts.map((contact, index) => (
            <button
              key={contact.phone}
              type="button"
              onClick={() => handleCall(contact.phone)}
              className="w-full flex items-center bg-gradient-to-r from-[#f8f6f0] to-[#f4f1e8] hover:from-[#f4f1e8] hover:to-[#f0ead6] rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg px-5 py-4 group border border-[#e8e4dc]/50 hover:border-[#d4af37]/30"
              aria-label={`${getText('call', currentLanguage)}: ${contact.phone}`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Иконка */}
              <div className="flex-shrink-0 p-3 bg-gradient-to-br from-[#d4af37] to-[#b8860b] rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-md">
                <div className="text-white">
                  {contact.icon}
                </div>
              </div>
              
              {/* Номер телефона */}
              <div className="flex-1 ml-4 text-center">
                <div className="font-mono text-xl font-bold text-[#1e1e1e] group-hover:text-[#d4af37] transition-colors tracking-wider">
                  {contact.phone}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Футер */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#f8f6f0] to-[#f4f1e8] border-t border-[#e8e4dc]/50">
          <div className="flex items-center justify-center space-x-2 text-sm text-[#8b7355]">
            <div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse"></div>
            <span>{getText('workingHours', currentLanguage)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
