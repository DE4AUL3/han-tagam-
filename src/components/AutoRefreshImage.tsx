'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useImageRefresh } from '@/hooks/useImageRefresh';

interface AutoRefreshImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  onError?: () => void;
}

export default function AutoRefreshImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
  priority,
  sizes,
  onError
}: AutoRefreshImageProps) {
  const { refreshKey } = useImageRefresh();
  const [imageSrc, setImageSrc] = useState(src);
  const [error, setError] = useState(false);

  // Обновляем src изображения при изменении refreshKey
  useEffect(() => {
    if (src) {
      // Добавляем timestamp для избежания кэширования
      const timestamp = Date.now();
      const separator = src.includes('?') ? '&' : '?';
      setImageSrc(`${src}${separator}t=${timestamp}`);
      setError(false);
    }
  }, [src, refreshKey]);

  const handleError = () => {
    setError(true);
    if (onError) {
      onError();
    }
  };

  // Если произошла ошибка, показываем плейсхолдер
  if (error) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Изображение недоступно</span>
      </div>
    );
  }

  const imageProps = {
    src: imageSrc,
    alt,
    className,
    onError: handleError,
    ...(priority && { priority }),
    ...(sizes && { sizes }),
  };

  if (fill) {
    return <Image {...imageProps} fill />;
  }

  return (
    <Image
      {...imageProps}
      width={width || 300}
      height={height || 200}
    />
  );
}
