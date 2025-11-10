'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';
import Image from 'next/image';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Готовим для вас меню...');
  const { currentRestaurant } = useTheme();

  const loadingTexts = [
    'Готовим для вас меню...',
    'Подбираем лучшие блюда...',
    'Добро пожаловать!'
  ];

  const isDark = currentRestaurant === 'panda-burger' || currentRestaurant === '1';

  useEffect(() => {
    let textIndex = 0;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return 100;
        }
        
        const newProgress = prev + 2;
        if (newProgress >= 30 && textIndex === 0) {
          setCurrentText(loadingTexts[1]);
          textIndex = 1;
        } else if (newProgress >= 80 && textIndex === 1) {
          setCurrentText(loadingTexts[2]);
          textIndex = 2;
        }
        
        return newProgress;
      });
    }, 50);

    return () => {
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-[#1a1a1a] via-[#212121] to-[#2a2a2a]' 
        : 'bg-gradient-to-br from-white via-[#fafafa] to-[#f5f5f5]'
    }`}>
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-20 animate-pulse ${
          isDark ? 'bg-white' : 'bg-[#d4af37]'
        }`} style={{ animationDuration: '3s' }}></div>
        <div className={`absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-20 animate-pulse ${
          isDark ? 'bg-white' : 'bg-[#d4af37]'
        }`} style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      </div>

      <div className="relative text-center space-y-8 max-w-md mx-auto px-6">
        {/* Logo with bounce animation */}
        <div className="relative mx-auto w-32 h-32">
          <div className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ 
              background: isDark 
                ? 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%)' 
                : 'radial-gradient(circle, rgba(212,175,55,0.5) 0%, rgba(212,175,55,0) 70%)',
              animationDuration: '2s'
            }}
          ></div>
          
          <div className="relative w-32 h-32 rounded-full overflow-hidden animate-bounce shadow-2xl"
            style={{ 
              animationDuration: '2s',
              boxShadow: isDark 
                ? '0 20px 60px rgba(255,255,255,0.3)' 
                : '0 20px 60px rgba(212,175,55,0.3)'
            }}
          >
            {isDark ? (
              <Image 
                src="/images/panda_logo.jpg" 
                alt="Panda Burger" 
                fill 
                className="object-cover"
                priority
              />
            ) : (
              <Image 
                src="/images/han_logo.jpg" 
                alt="Han Tagam" 
                fill 
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>

        {/* Title with gradient */}
        <div className="space-y-2">
          <h1 className={`text-3xl font-bold tracking-wide ${
            isDark 
              ? 'bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-[#d4af37] via-[#f4e5b0] to-[#d4af37] bg-clip-text text-transparent'
          }`}>
            QR Menu
          </h1>
          <p className={`text-lg font-medium ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {isDark ? 'Panda Burger' : 'Han Tagam'}
          </p>
        </div>

        {/* Progress bar with glow */}
        <div className="w-64 mx-auto space-y-4">
          <div className={`relative w-full rounded-full h-2 overflow-hidden ${
            isDark ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <div 
              className={`h-full rounded-full transition-all duration-300 ease-out relative ${
                isDark 
                  ? 'bg-gradient-to-r from-white via-gray-100 to-white' 
                  : 'bg-gradient-to-r from-[#d4af37] via-[#f4e5b0] to-[#d4af37]'
              }`} 
              style={{ 
                width: `${progress}%`,
                boxShadow: isDark 
                  ? '0 0 20px rgba(255,255,255,0.5)' 
                  : '0 0 20px rgba(212,175,55,0.5)'
              }}
            >
              <div className="absolute inset-0 animate-pulse"
                style={{
                  background: isDark
                    ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                  animation: 'shimmer 2s infinite'
                }}
              ></div>
            </div>
          </div>
          
          <p className={`text-sm font-medium animate-pulse ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {currentText}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
