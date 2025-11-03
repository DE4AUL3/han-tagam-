'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useImageRefresh } from '@/hooks/useImageRefresh';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  placeholder?: string;
  onError?: () => void;
  fallbackSrc?: string;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  fill = false,
  priority = false,
  sizes,
  placeholder = '/images/placeholder.svg',
  onError,
  fallbackSrc = '/images/placeholder.svg'
}: OptimizedImageProps) {
  const { refreshKey } = useImageRefresh();
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Обновляем src при изменении refreshKey или исходного src
  useEffect(() => {
    if (src) {
      // Для локальных изображений добавляем timestamp для обхода кэша
      if (src.startsWith('/')) {
        const timestamp = Date.now();
        const separator = src.includes('?') ? '&' : '?';
        setImageSrc(`${src}${separator}v=${timestamp}&r=${refreshKey}`);
      } else {
        setImageSrc(src);
      }
      setHasError(false);
      setIsLoading(true);
    }
  }, [src, refreshKey]);

  const handleError = () => {
    console.warn(`Failed to load image: ${imageSrc}, falling back to: ${fallbackSrc}`);
    setHasError(true);
    setImageSrc(fallbackSrc);
    if (onError) {
      onError();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const imageProps = {
    src: imageSrc,
    alt: hasError ? `${alt} (недоступно)` : alt,
    className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
    onError: handleError,
    onLoad: handleLoad,
    ...(priority && { priority }),
    ...(sizes && { sizes }),
  };

  if (fill) {
    return (
      <div className="relative">
        <Image {...imageProps} fill />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-sm">Загрузка...</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      <Image
        {...imageProps}
        width={width || 300}
        height={height || 200}
      />
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="text-gray-400 text-sm">Загрузка...</div>
        </div>
      )}
    </div>
  );
}

// Компонент для изображений блюд с оптимизацией
export function DishImage({ dish, className = '', ...props }: { 
  dish: { id: string; name: string; image?: string };
  className?: string;
} & Omit<OptimizedImageProps, 'src' | 'alt'>) {
  const imageSrc = dish.image || '/images/menu/placeholder.jpg';
  
  return (
    <OptimizedImage
      src={imageSrc}
      alt={dish.name}
      fallbackSrc="/images/menu/placeholder.jpg"
      className={className}
      {...props}
    />
  );
}

// Компонент для изображений категорий с оптимизацией
export function CategoryImage({ category, className = '', ...props }: {
  category: { id: string; name: string; image?: string };
  className?: string;
} & Omit<OptimizedImageProps, 'src' | 'alt'>) {
  const imageSrc = category.image || '/images/categories/placeholder.jpg';
  
  return (
    <OptimizedImage
      src={imageSrc}
      alt={category.name}
      fallbackSrc="/images/categories/placeholder.jpg"
      className={className}
      {...props}
    />
  );
}
