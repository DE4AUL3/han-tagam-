// Центральные константы приложения
export const APP_CONFIG = {
  // API endpoints
  API_ENDPOINTS: {
    RESTAURANTS: '/api/restaurants',
    MENU: '/api/menu',
    ORDERS: '/api/orders'
  },
  
  // Локализация
  SUPPORTED_LANGUAGES: ['ru', 'tk'] as const,
  DEFAULT_LANGUAGE: 'ru' as const,
  
  // Тема
  THEME_STORAGE_KEY: 'qr-menu-theme',
  LANGUAGE_STORAGE_KEY: 'qr-menu-language',
  
  // Валюта
  CURRENCY: 'ТМТ',
  
  // Корзина
  MIN_ORDER_AMOUNT: 20,
  
  // UI настройки
  ANIMATION_DURATION: 300,
  LOADING_TIMEOUT: 2000,
  
  // Контакты
  WHATSAPP_NUMBER: '+99312345678',
  TELEGRAM_BOT: '@restaurant_bot',
  
  // Метрики
  GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_ID,
  YANDEX_METRICA_ID: process.env.NEXT_PUBLIC_YM_ID
} as const

// Типы для конфигурации
export type Language = typeof APP_CONFIG.SUPPORTED_LANGUAGES[number]
export type Theme = 'light' | 'dark'