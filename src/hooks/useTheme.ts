'use client'

import { useState, useEffect } from 'react'
import { ThemeMode, themes, getCSSVariables } from '@/styles/simpleTheme'

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>('dark')
  const [mounted, setMounted] = useState(false)
  const [currentRestaurant, setCurrentRestaurant] = useState<string>('han-tagam')

  useEffect(() => {
    setMounted(true)
    
    // Принудительно устанавливаем han-tagam для этого проекта
    setCurrentRestaurant('han-tagam')
    localStorage.setItem('selectedRestaurant', 'han-tagam')
    
    // Всегда применяем темную тему
    setTheme('dark')
    applyTheme('dark')
  }, [])

  const applyTheme = (newTheme: ThemeMode) => {
    // Всегда применяем темную тему
    const themeConfig = themes['dark']
    const cssVars = getCSSVariables(themeConfig)
    
    // Применяем CSS переменные к root
    Object.entries(cssVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
    
    // Всегда добавляем класс dark
    document.documentElement.classList.add('dark')
  }

  const setRestaurant = (restaurant: string) => {
    // Принудительно оставляем han-tagam для этого проекта
    setCurrentRestaurant('han-tagam')
    localStorage.setItem('selectedRestaurant', 'han-tagam')
  }

  // Убираем функции переключения темы, поскольку теперь всегда темная тема
  const getThemeClasses = () => {
    const currentTheme = themes['dark']
    return {
      background: `bg-[${currentTheme.colors.background.primary}]`,
      cardBackground: `bg-[${currentTheme.colors.background.secondary}]`,
      headerBackground: `bg-[${currentTheme.colors.background.secondary}]`,
      text: `text-[${currentTheme.colors.text.primary}]`,
      border: `border-[${currentTheme.colors.border.primary}]`
    }
  }

  return {
    theme,
    currentTheme: themes['dark'],
    isDark: true,
    isLight: false,
    isDarkMode: true, // для обратной совместимости
    mounted,
    currentRestaurant,
    setRestaurant,
    getThemeClasses
  }
}