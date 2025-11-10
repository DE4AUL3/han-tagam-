'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Globe } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'
import { useTheme } from '@/hooks/useTheme'
import { useCart } from '@/hooks/useCart'
import { Category } from '@/types/menu'
import FloatingCallButton from '@/components/FloatingCallButton'
import FloatingRestaurantButton from '@/components/FloatingRestaurantButton'
import { getImageUrl } from "@/lib/imageUtils"
import { getAppThemeColors, getAppThemeClasses } from '@/styles/appTheme'

// Skeleton компонент для загрузки (Han Tagam - светлая тема)
function CategorySkeleton() {
  return (
    <div className="group backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden bg-gray-100 animate-pulse">
      <div className="relative h-32 sm:h-36 bg-gray-200" />
      <div className="px-2 py-2 sm:px-4 sm:py-4 text-center bg-gray-100">
        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
      </div>
    </div>
  )
}

export default function MenuPage() {
  const router = useRouter()
  const { currentLanguage, toggleLanguage } = useLanguage()
  const { currentRestaurant, setRestaurant } = useTheme()
  const { state: cartState } = useCart()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Устанавливаем тему для Han Tagam
    setRestaurant('han-tagam')

    // Загружаем категории из API
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/category', {
          // Добавляем кэширование на 60 секунд
          next: { revalidate: 60 }
        })
        if (response.ok) {
          const data = await response.json()
          // Трансформируем данные из БД в формат Category
          const transformedCategories = data.map((cat: any) => ({
            id: cat.id,
            name: cat.nameRu,
            nameTk: cat.nameTk,
            image: cat.imageCard,
            gradient: 'from-slate-500 to-slate-700',
            description: cat.descriptionRu || '',
            descriptionTk: cat.descriptionTk || '',
            isActive: cat.status,
            sortOrder: cat.order
          }))
          setCategories(transformedCategories)
        }
      } catch (error) {
        console.error('Ошибка загрузки категорий:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [setRestaurant])

  // Используем gold-elegance тему для Han Tagam
  const themeColors = getAppThemeColors('gold-elegance');
  const themeClasses = getAppThemeClasses('gold-elegance');

  // Устанавливаем имя ресторана для Han Tagam
  const restaurantDisplayName = 'Han Tagam';
  
  const pageVariants: any = {
    hidden: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] } }
  }

  // Debounced navigation для предотвращения двойных кликов
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/menu/category/${categoryId}?restaurantId=han-tagam`)
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className={`min-h-screen transition-all duration-500 smooth-scroll mobile-app-feel safe-area-padding ${themeClasses.bg}`}
      style={{ background: themeColors.primary.background }}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-lg border-b ${themeClasses.background} ${themeClasses.border}`}
        style={{ background: themeColors.primary.background, borderColor: themeColors.secondary.border }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                  <Image
                    src="/images/han-tagam-logo.png"
                    alt="Han Tagam"
                    fill
                    className="object-contain"
                    loading="eager"
                    priority
                    quality={90}
                  />
                </div>
                <div>
                  <h1 className={`text-xl sm:text-2xl font-bold ${themeClasses.text}`}> 
                    {restaurantDisplayName}
                  </h1>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-full transition-colors duration-200 border-0 bg-transparent hover:bg-transparent focus:outline-none"
                style={{ boxShadow: 'none' }}
                aria-label="Сменить язык"
              >
                <Globe className="w-6 h-6 text-gray-700" />
              </button>

              {/* Cart */}
              <button
                onClick={() => router.push('/cart')}
                className="relative p-2 rounded-xl transition-colors duration-200 bg-[#d4af37] hover:bg-[#c19a2e] text-white"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartState.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#d4af37] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartState.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Grid */}
        <div className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-4">
            {isLoading ? (
              // Показываем skeleton во время загрузки
              Array.from({ length: 8 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))
            ) : (
              categories.map((category, index) => (
                <div
                  key={category.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCategoryClick(category.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCategoryClick(category.id) }}
                  className={`group backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-[0.97] ${themeClasses.card}`}
                >
                  {/* Category Image */}
                  <div className={`relative h-32 sm:h-36 bg-gradient-to-br ${themeClasses.gradients.card} overflow-hidden`}>
                    {category.image ? (
                      <Image
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        priority={index < 4}
                        loading={index < 4 ? 'eager' : 'lazy'}
                        quality={75}
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                      />
                    ) : null}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Category Info */}
                  <div className={`px-2 py-2 sm:px-4 sm:py-4 text-center ${themeClasses.bgSecondary} backdrop-blur-md border-t ${themeClasses.border}`}>
                    <h3 className={`font-semibold text-xs sm:text-base mb-0.5 sm:mb-1 leading-tight sm:leading-normal transition-colors duration-300 ${themeClasses.text}`}>
                      {currentLanguage === 'tk' ? (category.nameTk || category.name) : category.name}
                    </h3>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Call & Restaurant Switch Buttons */}
        <FloatingCallButton />
        <FloatingRestaurantButton />
      </main>
    </motion.div>
  )
}
