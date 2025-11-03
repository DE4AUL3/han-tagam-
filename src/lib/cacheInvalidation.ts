'use client';

import { imageCache } from './imageCache';

// Механизм инвалидации кэша изображений
export class CacheInvalidation {
  private static instance: CacheInvalidation;
  private eventSource: EventSource | null = null;
  private callbacks: Set<() => void> = new Set();

  private constructor() {
    this.setupEventSource();
  }

  static getInstance(): CacheInvalidation {
    if (!CacheInvalidation.instance) {
      CacheInvalidation.instance = new CacheInvalidation();
    }
    return CacheInvalidation.instance;
  }

  // Настройка EventSource для получения уведомлений о новых изображениях
  private setupEventSource() {
    if (typeof window === 'undefined') return;

    try {
      this.eventSource = new EventSource('/api/images/events');
      
      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'image_uploaded' || data.type === 'image_deleted') {
          this.invalidateCache();
          this.notifyCallbacks();
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('Ошибка EventSource:', error);
        // Переподключение через 5 секунд
        setTimeout(() => this.setupEventSource(), 5000);
      };
    } catch (error) {
      console.error('Не удалось настроить EventSource:', error);
    }
  }

  // Инвалидация кэша изображений
  invalidateCache() {
    imageCache.clearCache();
    // Очищаем также кэш браузера для изображений
    if ('caches' in window) {
      caches.delete('images-cache');
    }
    console.log('🔄 Кэш изображений инвалидирован');
  }

  // Добавление callback для уведомления о обновлениях
  addCallback(callback: () => void) {
    this.callbacks.add(callback);
  }

  // Удаление callback
  removeCallback(callback: () => void) {
    this.callbacks.delete(callback);
  }

  // Уведомление всех подписчиков
  private notifyCallbacks() {
    this.callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Ошибка в callback инвалидации кэша:', error);
      }
    });
  }

  // Принудительное обновление изображений
  forceRefresh() {
    this.invalidateCache();
    this.notifyCallbacks();
    // Перезагружаем страницу частично
    window.location.reload();
  }

  // Очистка ресурсов
  cleanup() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.callbacks.clear();
  }
}

// Глобальный экземпляр
export const cacheInvalidation = CacheInvalidation.getInstance();
