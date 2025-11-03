"use client";
import React, { useEffect } from "react";

export default function ColorThemeInitializer() {
  useEffect(() => {
    // Инициализируем тему для Han Tagam (светлая тема)
    const root = document.documentElement;
    
    // Устанавливаем CSS переменные для Han Tagam
    root.style.setProperty('--han-bg', '#ffffff');
    root.style.setProperty('--han-text', '#1a1a1a');
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--text-primary', '#1a1a1a');
    root.style.setProperty('--bg-secondary', '#f8f9fa');
    root.style.setProperty('--text-secondary', '#666666');
    root.style.setProperty('--accent-call', '#10b981');
    root.style.setProperty('--accent-hover', '#059669');
    root.style.setProperty('--border-color', '#e5e7eb');
    
    // Устанавливаем data-theme для специфичных стилей
    document.body.setAttribute('data-theme', 'light');
    document.body.setAttribute('data-restaurant', 'han-tagam');
  }, []);
  
  return null;
}