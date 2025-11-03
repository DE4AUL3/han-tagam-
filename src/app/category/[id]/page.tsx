'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DishCard from '@/components/DishCard';
import FloatingCallButton from '@/components/FloatingCallButton';
import Header from '@/components/Header';
import { useTranslation } from '@/components/LanguageToggle';
import { useLanguage } from '@/hooks/useLanguage'
import { getText } from '@/i18n/translations'
import { Category, Dish } from '@/types';
import { getAppThemeClasses } from '@/styles/appTheme';
// back navigation intentionally removed for category listing

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  // TODO: Production: Получать категорию и блюда по id через API/SSR/Server Actions
  // Пример:
  // useEffect(() => {
  //   fetchCategoryAndDishes(params.id).then(({category, dishes}) => {
  //     setCategory(category);
  //     setDishes(dishes);
  //   });
  // }, [params.id]);

  // Используем gold-elegance тему
  const theme = getAppThemeClasses('gold-elegance');

  if (!category) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.textSecondary}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#d4af37] mx-auto mb-4"></div>
          <p className={theme.textSecondary}>Загрузка блюд...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors`}>
      <Header restaurantName="Han Tagam" />
      <main className="container mx-auto px-4 pt-8 pb-16">
        {/* Заголовок категории */}
        <div className="text-center mb-12">
          <div className="relative h-32 rounded-2xl overflow-hidden mb-6 shadow-lg">
            <div className={`absolute inset-0 ${theme.accent} flex items-center justify-center`}>
              <div className="text-center text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {category.name}
                </h1>
                <p className="text-white/80">
                  {dishes.length} {t('dishes')} {t('inCategory')}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Сетка блюд */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
        </div>
        {/* Пустое состояние */}
        {dishes.length === 0 && (
          <div className="text-center py-16">
            <div className={`w-24 h-24 ${theme.bgSecondary} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>
              {getText('noDishesYet', currentLanguage)}
            </h3>
            <p className={theme.textSecondary}>
              {getText('newDishesComingSoon', currentLanguage)}
            </p>
          </div>
        )}
      </main>
      <FloatingCallButton />
    </div>
  );
}