/**
 * Конфигурация для продакшн-сервера
 * Настройки для полной функциональности сайта и админ-панели
 */

export const PRODUCTION_CONFIG = {
  // Настройки API
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : process.env.NODE_ENV === 'production' 
      ? 'https://hantagam.com/api' 
      : 'http://localhost:3001/api',
  
  // Настройки CORS для админ-панели
  CORS_ORIGINS: [
    'https://hantagam.com',
    'https://admin.hantagam.com',
    'http://localhost:3001'
  ],
  
  // Настройки файлового хранилища
  FILE_STORAGE: {
    // Для production рекомендуется использовать cloud storage
    USE_CLOUD_STORAGE: true,
    CLOUD_PROVIDER: 'cloudinary', // или 'aws-s3', 'firebase-storage'
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  },
  
  // Настройки базы данных
  DATABASE: {
    // Для production нужна настоящая БД
    USE_PERSISTENT_DB: true,
    PROVIDER: 'mongodb', // или 'postgresql', 'mysql'
    BACKUP_INTERVAL: 24 * 60 * 60 * 1000, // раз в сутки
  },
  
  // Настройки безопасности
  SECURITY: {
    ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET,
    ADMIN_SESSION_TIMEOUT: 2 * 60 * 60 * 1000, // 2 часа
    REQUIRE_HTTPS: true,
    RATE_LIMIT: {
      ADMIN_API: 100, // запросов в минуту для админ API
      PUBLIC_API: 500, // запросов в минуту для публичного API
    }
  },
  
  // Настройки кэширования
  CACHE: {
    MENU_TTL: 15 * 60 * 1000, // 15 минут
    IMAGES_TTL: 60 * 60 * 1000, // 1 час
    CATEGORIES_TTL: 30 * 60 * 1000, // 30 минут
  },
  
  // Настройки уведомлений
  NOTIFICATIONS: {
    ORDER_WEBHOOK_URL: process.env.ORDER_WEBHOOK_URL,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    SMS_PROVIDER: 'twilio', // или другой провайдер
  }
};

// Валидация обязательных переменных окружения для production
export function validateProductionConfig() {
  const requiredEnvVars = [
    'ADMIN_JWT_SECRET',
    'ORDER_WEBHOOK_URL',
    'ADMIN_EMAIL',
  ];
  
  const missing = requiredEnvVars.filter(
    varName => !process.env[varName]
  );
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Настройки синхронизации админ-панели с фронтендом
export const ADMIN_SYNC_CONFIG = {
  // Автоматическая синхронизация изменений
  ENABLE_REAL_TIME_SYNC: true,
  
  // Интервал проверки изменений (мс)
  SYNC_INTERVAL: 5000,
  
  // Кэш инвалидация при изменениях
  INVALIDATE_CACHE_ON_CHANGE: true,
  
  // Webhooks для уведомления фронтенда об изменениях
  FRONTEND_WEBHOOK_URLS: [
    '/api/revalidate/menu',
    '/api/revalidate/categories',
    '/api/revalidate/restaurants'
  ]
};