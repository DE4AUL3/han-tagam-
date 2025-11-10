'use client';

import { Store } from 'lucide-react';
import { getAppThemeClasses } from '@/styles/appTheme';

export default function FloatingRestaurantButton() {
  const theme = getAppThemeClasses('gold-elegance');

  const switchRestaurant = () => {
    // Переключаемся на Panda Burger
    window.location.href = 'https://pandaburger.cloud/menu';
  };

  return (
    <button
      onClick={switchRestaurant}
      className={`fixed bottom-6 left-6 group z-40 animate-float ${theme.accent} text-white p-5 rounded-full shadow-2xl transition-all duration-500 transform group-hover:scale-110 group-active:scale-95`}
      aria-label="Переключить на Panda Burger"
      style={{ boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.6)' }}
    >
      {/* Иконка */}
      <Store className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
      
      {/* Подсказка */}
      <div className="absolute bottom-full left-0 mb-3 bg-white/95 backdrop-blur-sm text-gray-900 text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0 shadow-xl border border-gray-200">
        Panda Burger
        <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/95"></div>
      </div>
    </button>
  );
}
