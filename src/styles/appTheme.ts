// 🔥 Panda Dark Theme
const pandaDarkColors: AppThemeColors = {
  primary: {
    background: '#0e0e10', // глубокий графит
    surface: '#1f1f22',
    text: '#f5f5f4'
  },
  secondary: {
    background: '#1a1a1d',
    surface: '#27272a',
    text: '#a1a1aa',
    border: '#2d2d30'
  },
  accent: {
    primary: 'from-[#b8252b] to-[#e0343a]', // бургерный бордо
    secondary: 'from-[#d4af37] to-[#e4c257]', // золотой акцент
    success: 'from-emerald-500 to-green-600',
    warning: 'from-amber-500 to-orange-500',
    error: 'from-red-500 to-rose-600'
  }
}

const pandaDarkClasses: AppThemeClasses = {
  background: 'bg-[#0e0e10]',
  surface: 'bg-[#1f1f22]',
  card: 'bg-[#1f1f22] border border-[#2d2d30]/50 shadow-sm',

  bg: 'bg-[#0e0e10]',
  bgSecondary: 'bg-[#1a1a1d]',
  cardBg: 'bg-[#1f1f22] border border-[#2d2d30]/50',

  text: 'text-[#f5f5f4]',
  textSecondary: 'text-[#a1a1aa]',
  textMuted: 'text-[#7c7c85]',

  hover: 'hover:bg-[#27272a]',
  accent: 'bg-linear-to-r from-[#b8252b] to-[#e0343a]',
  accentSecondary: 'bg-linear-to-r from-[#d4af37] to-[#e4c257]',

  success: 'text-emerald-400 bg-emerald-900/20',
  warning: 'text-amber-400 bg-amber-900/20',
  error: 'text-red-400 bg-red-900/20',

  border: 'border-[#2d2d30]',
  borderLight: 'border-[#27272a]',

  gradients: {
    main: 'bg-gradient-to-br from-[#0e0e10] via-[#1a1a1d] to-[#1f1f22]',
    accent: 'from-[#b8252b] to-[#e0343a]',
    card: 'from-[#1f1f22] via-[#1a1a1d] to-[#27272a]',
    hero: 'from-[#b8252b] via-[#d4af37] to-[#e0343a]'
  }
}

// 🌟 Gold Elegance Theme
const goldEleganceColors: AppThemeColors = {
  primary: {
    background: '#faf9f6', // мягкий бежево-золотистый
    surface: '#ffffff',
    text: '#1e1e1e'
  },
  secondary: {
    background: '#f7f6f1',
    surface: '#fefcf9',
    text: '#6b6b6b',
    border: '#e8e4dc'
  },
  accent: {
  primary: 'from-[#d4af37] to-[#d8a62b]', // благородное золото
    secondary: 'from-[#c5a572] to-[#d4af37]', // тёплое золото
    success: 'from-emerald-500 to-green-600',
    warning: 'from-amber-500 to-orange-500',
    error: 'from-red-500 to-rose-600'
  }
}

const goldEleganceClasses: AppThemeClasses = {
  background: 'bg-[#faf9f6]',
  surface: 'bg-white',
  card: 'bg-white border border-[#e8e4dc]/50 shadow-sm',

  bg: 'bg-[#faf9f6]',
  bgSecondary: 'bg-[#f7f6f1]',
  cardBg: 'bg-white border border-[#e8e4dc]/50',

  text: 'text-[#1e1e1e]',
  textSecondary: 'text-[#6b6b6b]',
  textMuted: 'text-[#9a8f7a]',

  hover: 'hover:bg-[#f4f0e6]',
  accent: 'bg-linear-to-r from-[#d4af37] to-[#d8a62b]',
  accentSecondary: 'bg-linear-to-r from-[#c5a572] to-[#d4af37]',

  success: 'text-emerald-600 bg-emerald-50',
  warning: 'text-amber-600 bg-amber-50',
  error: 'text-red-600 bg-red-50',

  border: 'border-[#e8e4dc]',
  borderLight: 'border-[#f2eee7]',

  gradients: {
    main: 'bg-gradient-to-br from-[#fffefc] via-[#faf6ed] to-[#f2e6c9]',
  accent: 'from-[#d4af37] to-[#d8a62b]',
    card: 'from-[#fffefc] via-[#faf6ed] to-[#f2e6c9]',
  hero: 'from-[#d4af37] via-[#c5a572] to-[#d8a62b]'
  }
}
/**
 * Универсальная система тем для всего приложения
 * Включает админ-панель, основные страницы и компоненты
 * Основана на правиле 60-30-10 дизайна
 */

export type AppTheme = 'dark' | 'han-tagam'

export interface AppThemeColors {
  // 60% - Основные цвета (фоны, поверхности)
  primary: {
    background: string
    surface: string
    text: string
  }
  
  // 30% - Вторичные цвета (карточки, панели, навигация)
  secondary: {
    background: string
    surface: string
    text: string
    border: string
  }
  
  // 10% - Акцентные цвета (кнопки, активные элементы)
  accent: {
    primary: string      // Основной акцент (синий градиент)
    secondary: string    // Вторичный акцент (фиолетовый градиент)
    success: string      // Успех (зеленый)
    warning: string      // Предупреждение (желтый)
    error: string        // Ошибка (красный)
  }
}

export interface AppThemeClasses {
  // Основные фоны (60%)
  background: string
  surface: string
  card: string
  
  // Дополнительные фоны для совместимости
  bg: string
  bgSecondary: string
  cardBg: string
  
  // Текст (30%)
  text: string
  textSecondary: string
  textMuted: string
  
  // Интерактивные элементы (10%)
  hover: string
  accent: string
  accentSecondary: string
  
  // Состояния (10%)
  success: string
  warning: string
  error: string
  
  // Границы
  border: string
  borderLight: string
  
  // Градиенты для разных целей
  gradients: {
    main: string        // Основной градиент страниц
    accent: string      // Акцентный градиент кнопок
    card: string        // Градиент карточек
    hero: string        // Градиент для главных элементов
  }
}

// Цвета конфигурации
import { COLORS } from '@/config/colors';

// Цвета для светлой темы
const COLORS_TYPED = COLORS as {
  background: string;
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  admin: string;
  warning: string;
  danger: string;
  success: string;
};

const lightThemeColors: AppThemeColors = {
  primary: {
    background: COLORS_TYPED.background,
    surface: COLORS_TYPED.surface,
    text: COLORS_TYPED.text
  },
  secondary: {
    background: COLORS_TYPED.surface,
    surface: COLORS_TYPED.border,
    text: COLORS_TYPED.textSecondary,
    border: COLORS_TYPED.border
  },
  accent: {
    primary: 'from-blue-500 to-indigo-600',     // 10% - основной акцент
    secondary: 'from-purple-500 to-pink-600',   // 10% - вторичный акцент
    success: 'from-emerald-500 to-green-600',   // 10% - успех
    warning: 'from-amber-500 to-orange-600',    // 10% - предупреждение
    error: 'from-red-500 to-rose-600'           // 10% - ошибка
  }
}

// Цвета для темной темы
const darkThemeColors: AppThemeColors = {
  primary: {
    background: '#0f172a',
    surface: '#1f2937',
    text: '#f1f5f9'
  },
  secondary: {
    background: '#334155',
    surface: COLORS_TYPED.textSecondary,
    text: COLORS_TYPED.textMuted,
    border: COLORS_TYPED.textSecondary
  },
  accent: {
    primary: 'from-blue-400 to-indigo-500',     // 10% - основной акцент
    secondary: 'from-purple-400 to-pink-500',   // 10% - вторичный акцент
    success: 'from-emerald-400 to-green-500',   // 10% - успех
    warning: 'from-amber-400 to-orange-500',    // 10% - предупреждение
    error: 'from-red-400 to-rose-500'           // 10% - ошибка
  }
}

// CSS классы для светлой темы
const lightThemeClasses: AppThemeClasses = {
  // Основные фоны (60%)
  background: 'bg-white',
  surface: 'bg-gray-50',
  card: 'bg-white/80 border border-gray-200/50',
  
  // Дополнительные фоны
  bg: 'bg-white',
  bgSecondary: 'bg-gray-50',
  cardBg: 'bg-white/80 border border-gray-200/50',
  
  // Текст (30%)
  text: 'text-gray-900',
  textSecondary: 'text-gray-600',
  textMuted: 'text-gray-500',
  
  // Интерактивные элементы (10%)
  hover: 'hover:bg-gray-100',
  accent: 'bg-linear-to-r from-blue-500 to-indigo-600',
  accentSecondary: 'bg-linear-to-r from-purple-500 to-pink-600',
  
  // Состояния (10%)
  success: 'text-emerald-600 bg-emerald-50',
  warning: 'text-amber-600 bg-amber-50',
  error: 'text-red-600 bg-red-50',
  
  // Границы
  border: 'border-gray-200',
  borderLight: 'border-gray-100',
  
  // Градиенты
  gradients: {
    main: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    accent: 'from-blue-500 to-indigo-600',
    card: 'from-white via-blue-50 to-purple-50',
    hero: 'from-blue-600 via-purple-600 to-indigo-700'
  }
}

// CSS классы для темной темы
const darkThemeClasses: AppThemeClasses = {
  // Основные фоны (60%)
  background: 'bg-slate-900',
  surface: 'bg-slate-800',
  card: 'bg-slate-800/50 border border-slate-700/50',
  
  // Дополнительные фоны
  bg: 'bg-slate-800',
  bgSecondary: 'bg-slate-700',
  cardBg: 'bg-slate-800/50 border border-slate-700/50',
  
  // Текст (30%)
  text: 'text-slate-100',
  textSecondary: 'text-slate-300',
  textMuted: 'text-slate-400',
  
  // Интерактивные элементы (10%)
  hover: 'hover:bg-slate-700/50',
  accent: 'bg-linear-to-r from-blue-400 to-indigo-500',
  accentSecondary: 'bg-linear-to-r from-purple-400 to-pink-500',
  
  // Состояния (10%)
  success: 'text-emerald-400 bg-emerald-900/20',
  warning: 'text-amber-400 bg-amber-900/20',
  error: 'text-red-400 bg-red-900/20',
  
  // Границы
  border: 'border-slate-700',
  borderLight: 'border-slate-600',
  
  // Градиенты
  gradients: {
    main: 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900',
    accent: 'from-blue-400 to-indigo-500',
    card: 'from-slate-800 via-blue-900/20 to-purple-900/20',
    hero: 'from-blue-400 via-purple-400 to-indigo-500'
  }
}

// Тема Han Tagam (светлая, элегантная)
const hanTagamColors: AppThemeColors = {
  primary: {
    background: '#fffaf5', // мягкий кремовый фон
    surface: '#ffffff',
    text: '#0f1724'
  },
  secondary: {
    background: '#fffefc',
    surface: '#f7f6f3',
    text: '#334155',
    border: '#eef2f3'
  },
  accent: {
    primary: 'from-emerald-500 to-emerald-700',
    secondary: 'from-amber-400 to-amber-600',
    success: 'from-emerald-500 to-green-600',
    warning: 'from-amber-500 to-orange-500',
    error: 'from-red-500 to-rose-600'
  }
}

const hanTagamClasses: AppThemeClasses = {
  background: 'bg-[var(--han-bg,#fffaf5)]',
  surface: 'bg-white',
  card: 'bg-white border border-[var(--han-border,#eef2f3)]',

  bg: 'bg-[var(--han-bg,#fffaf5)]',
  bgSecondary: 'bg-[var(--han-surface,#f7f6f3)]',
  cardBg: 'bg-white border border-[var(--han-border,#eef2f3)]',

  text: 'text-[#0f1724]',
  textSecondary: 'text-gray-600',
  textMuted: 'text-gray-500',

  hover: 'hover:bg-gray-50',
  accent: 'bg-linear-to-r from-emerald-500 to-emerald-700',
  accentSecondary: 'bg-linear-to-r from-amber-400 to-amber-600',

  success: 'text-emerald-600 bg-emerald-50',
  warning: 'text-amber-600 bg-amber-50',
  error: 'text-red-600 bg-red-50',

  border: 'border-[var(--han-border,#eef2f3)]',
  borderLight: 'border-gray-100',

  gradients: {
    main: 'bg-gradient-to-br from-emerald-50 via-amber-50 to-rose-50',
    accent: 'from-emerald-500 to-emerald-700',
    card: 'from-white via-emerald-50 to-amber-50',
    hero: 'from-emerald-600 via-amber-500 to-rose-500'
  }
}

// Хранилище всех тем
const appThemes: Record<string, { colors: AppThemeColors; classes: AppThemeClasses }> = {
  'gold-elegance': {
    colors: goldEleganceColors,
    classes: goldEleganceClasses
  },
  'panda-dark': {
    colors: pandaDarkColors,
    classes: pandaDarkClasses
  }
}

/**
 * Получить CSS классы для указанной темы
 */
 export function getAppThemeClasses(theme: string = 'gold-elegance'): AppThemeClasses {
   return (appThemes[theme] || appThemes['gold-elegance']).classes
}

/**
 * Получить цвета для указанной темы
 */
 export function getAppThemeColors(theme: string = 'gold-elegance'): AppThemeColors {
   return (appThemes[theme] || appThemes['gold-elegance']).colors
}

/**
 * Получить полную тему
 */
 export function getAppTheme(theme: string = 'gold-elegance') {
   return appThemes[theme] || appThemes['gold-elegance']
}

// Обратная совместимость с админской системой тем
export type AdminTheme = AppTheme
export const getThemeClasses = getAppThemeClasses
export const getThemeColors = getAppThemeColors