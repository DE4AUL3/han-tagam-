'use client';

import { useEffect, useState, useCallback } from 'react';
import { cacheInvalidation } from '@/lib/cacheInvalidation';

export function useImageRefresh() {
  const [refreshKey, setRefreshKey] = useState(0);

  // Функция для принудительного обновления изображений
  const refreshImages = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    // Добавляем callback для уведомлений о новых изображениях
    const handleImageUpdate = () => {
      console.log('🔄 Получено уведомление о новом изображении');
      refreshImages();
    };

    cacheInvalidation.addCallback(handleImageUpdate);

    // Очистка при размонтировании компонента
    return () => {
      cacheInvalidation.removeCallback(handleImageUpdate);
    };
  }, [refreshImages]);

  return {
    refreshKey,
    refreshImages,
    forceRefresh: () => cacheInvalidation.forceRefresh()
  };
}
