'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Star } from 'lucide-react';
import LanguageToggle from './LanguageToggle';
import { useTheme } from '@/hooks/useTheme';

interface HeaderProps {
  restaurantName: string;
}

export default function Header({ restaurantName }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { currentRestaurant } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const restaurantInfo = {
    rating: 4.8,
    status: 'Открыт',
    hours: '09:00 - 23:00',
    location: 'Бишкек, ул. Чуй 1'
  };

  return (
    <>
  <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? currentRestaurant === 'panda-burger' || currentRestaurant === '1'
            ? 'bg-[#282828]/95 backdrop-blur-xl shadow-lg border-b border-gray-600/50' 
            : 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
          : currentRestaurant === 'panda-burger' || currentRestaurant === '1'
            ? 'bg-[#282828]/90 backdrop-blur-md'
            : 'bg-white/90 backdrop-blur-md'
      }`}>
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* Левая часть - Логотип и информация */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              {/* Компактный логотип */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    {restaurantName.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Адаптивная информация */}
              <div className="min-w-0 flex-1">
                {/* Мобильная версия (до 640px) */}
                <div className="block sm:hidden">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {restaurantName}
                    </h1>
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-full flex-shrink-0">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">
                        {restaurantInfo.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{restaurantInfo.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="truncate">{restaurantInfo.hours}</span>
                    </div>
                  </div>
                </div>

                {/* Планшетная версия (640px - 1024px) */}
                <div className="hidden sm:block lg:hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-base font-bold text-gray-900 dark:text-white">
                      {restaurantName}
                    </h1>
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">
                        {restaurantInfo.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span>{restaurantInfo.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{restaurantInfo.hours}</span>
                    </div>
                  </div>
                </div>

                {/* Десктопная версия (1024px+) */}
                <div className="hidden lg:block">
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      {restaurantName}
                    </h1>
                    <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">
                        {restaurantInfo.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{restaurantInfo.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{restaurantInfo.hours}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurantInfo.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая часть - Компактные кнопки */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <LanguageToggle />
              {/* Theme toggle removed */}
            </div>
          </div>
        </div>
      </header>

      {/* Отступ для контента */}
      <div className="h-14 sm:h-16"></div>
    </>
  );
}