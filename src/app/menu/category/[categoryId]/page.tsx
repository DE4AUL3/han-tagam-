"use client"

import ContactsModal from '@/components/ContactsModal'

import { useState, useEffect, useReducer } from 'react'
// framer-motion removed from server component to avoid SSR/runtime issues
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { ShoppingCart, Globe, ArrowLeft, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'
import { getText, getPluralForm } from '@/i18n/translations'
import { getImageUrl } from "@/lib/imageUtils"
import { useCart } from '@/hooks/useCart'
import FloatingCallButton from '@/components/FloatingCallButton'
import { getAppThemeClasses } from '@/styles/appTheme'
import type { Category, Dish } from '@/types/common'



export default function CategoryPage() {
  // Все хуки должны быть вызваны до любого return!
  const [showContacts, setShowContacts] = useState(false)
  const params = useParams()
  const categoryId = params?.categoryId as string
  const restaurantId = params?.id as string
  const router = useRouter()
  const searchParams = useSearchParams()
  const { currentLanguage, setCurrentLanguage, toggleLanguage } = useLanguage()
  const { state: cartState, dispatch } = useCart()
  const theme = getAppThemeClasses('gold-elegance')

  // Используем gold-elegance тему
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  type State = {
    categories: Category[],
    category: Category | null,
    dishes: Dish[],
    isLoading: boolean,
    fade: 'in' | 'out',
  }
  type Action =
    | { type: 'START_LOADING' }
    | { type: 'SET_DATA', categories: Category[], category: Category | null, dishes: Dish[] }
    | { type: 'SET_FADE', fade: 'in' | 'out' }

  const initialState: State = {
    categories: [],
    category: null,
    dishes: [],
    isLoading: true,
    fade: 'in',
  }
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'START_LOADING':
        return { ...state, isLoading: true, fade: 'out' };
      case 'SET_DATA':
        return { ...state, categories: action.categories, category: action.category, dishes: action.dishes, isLoading: false };
      case 'SET_FADE':
        return { ...state, fade: action.fade };
      default:
        return state;
    }
  }
  const [state, dispatchState] = useReducer(reducer, initialState);

  // categories теперь загружаются только в основном useEffect ниже

  // Синхронизируем язык с query-параметром lang
  useEffect(() => {
    const langParam = searchParams?.get('lang');
    if (langParam && (langParam === 'ru' || langParam === 'tk')) {
      setCurrentLanguage(langParam);
    }
  }, [searchParams, setCurrentLanguage]);

  // scrollIntoView для активной категории — хуки всегда должны быть на верхнем уровне
  useEffect(() => {
    const activeBtn = document.querySelector(`[data-cat="${categoryId}"]`);
    if (activeBtn) {
      try {
        (activeBtn as HTMLElement).scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } catch (e) {
        // ignore
      }
    }
  }, [categoryId]);

  useEffect(() => {
    let isMounted = true;
    dispatchState({ type: 'START_LOADING' });
    const timer = setTimeout(async () => {
      // Параллельно грузим категории и блюда
      const [catRes, dishRes] = await Promise.all([
        fetch('/api/category'),
        fetch(`/api/meal?categoryId=${categoryId}`)
      ]);
      const categoriesData = await catRes.json();
      const dishesData = await dishRes.json();
      if (!isMounted) return;
      // Категории
      const transformedCategories = categoriesData.map((cat: any) => ({
        id: cat.id,
        name: cat.nameRu,
        nameTk: cat.nameTk,
        image: cat.imageCard,
        gradient: 'from-slate-500 to-slate-700',
        description: cat.descriptionRu || '',
        descriptionTk: cat.descriptionTk || '',
        isActive: cat.status,
        sortOrder: cat.order
      }));
      // Категория
      const foundCategory = transformedCategories.find((cat: any) => cat.id === categoryId);
      let categoryObj: Category | null = null;
      if (foundCategory) {
        categoryObj = {
          id: foundCategory.id,
          name: foundCategory.name,
          nameTk: foundCategory.nameTk,
          image: foundCategory.image,
          gradient: foundCategory.gradient || 'from-slate-500 to-slate-700',
          description: foundCategory.description || '',
          descriptionTk: foundCategory.descriptionTk || '',
          isActive: foundCategory.isActive,
          sortOrder: foundCategory.sortOrder,
          createdAt: foundCategory.createdAt,
          updatedAt: foundCategory.updatedAt
        };
      }
      // Блюда
      const transformedDishes = (dishesData || []).map((meal: any) => ({
        id: meal.id,
        name: { ru: meal.nameRu, tk: meal.nameTk },
        description: { ru: meal.descriptionRu || '', tk: meal.descriptionTk || '' },
        categoryId: meal.categoryId,
        price: meal.price,
        image: meal.image,
        isActive: true,
        createdAt: meal.createdAt || null,
        updatedAt: meal.updatedAt || null
      }));
  dispatchState({ type: 'SET_DATA', categories: transformedCategories, category: categoryObj, dishes: transformedDishes });
      setTimeout(() => { if (isMounted) dispatchState({ type: 'SET_FADE', fade: 'in' }); }, 50);
    }, 200);
    return () => { isMounted = false; clearTimeout(timer); };
  }, [categoryId]);

  // loadCategoryData больше не нужен (fetch объединён)

  const handleOrderClick = (dishId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [dishId]: !prev[dishId]
    }))
  }

  const increaseQuantity = (dishId: string) => {
    setQuantities(prev => ({
      ...prev,
      [dishId]: (prev[dishId] || 1) + 1
    }))
  }

  const decreaseQuantity = (dishId: string) => {
    setQuantities(prev => ({
      ...prev,
      [dishId]: Math.max(1, (prev[dishId] || 1) - 1)
    }))
  }

  const addToCart = (dish: Dish) => {
    const quantity = quantities[dish.id] || 1
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: dish.id,
        name: dish.name.ru,
        nameTk: dish.name.tk,
        description: dish.description?.ru || '',
        descriptionTk: dish.description?.tk || '',
        price: dish.price,
        image: dish.image || '',
        category: categoryId,
        ingredients: [],
        ingredientsTk: [],
        quantity
      }
    })
    
    setExpandedItems(prev => ({
      ...prev,
      [dish.id]: false
    }))
    
    setQuantities(prev => ({
      ...prev,
      [dish.id]: 1
    }))
  }


  // --- UI ниже ---

  if (state.isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}> 
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto" style={{ borderColor: '#d4af37' }}></div>
          <p className={`mt-4 ${theme.textSecondary}`}>Загружаем меню...</p>
        </div>
      </div>
    )
  }

  if (!state.category) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}> 
        <div className="text-center">
          <h1 className={`text-2xl font-bold mb-4 ${theme.text}`}>Категория не найдена</h1>
          <button
            onClick={() => router.push(`/menu/${restaurantId}`)}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${theme.accent} text-white`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к меню
          </button>
        </div>
      </div>
    )
  }

  // Получаем изображение для заголовка категории (упрощённо)
  const getCategoryHeaderImage = () => {
    const img = state.category?.dishPageImage || state.category?.image;
    return img ? img : '/images/placeholder.svg';
  }

  // scrollIntoView для активной категории
  

  return (
    <div className={`min-h-screen transition-opacity duration-300 ${theme.bg}`}>
      {/* Header */}
      <header className={`sticky top-0 z-30 backdrop-blur-md border-b ${theme.bg} ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Back Button + Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(`/menu/${restaurantId}`)}
                className={`p-2 transition-colors duration-200 ${theme.text}`}
                aria-label="Назад к категориям"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className={`text-lg sm:text-xl font-bold ${theme.text}`}>
                  {currentLanguage === 'tk' ? state.category.nameTk : state.category.name}
                </h1>
                <p className={`text-sm ${theme.textSecondary}`}>
                  {(state.dishes?.length ?? 0)} {getPluralForm((state.dishes?.length ?? 0), currentLanguage, getText('dishesCount', currentLanguage))}
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleLanguage}
                className={`p-2 rounded-full transition-colors duration-200 border-0 bg-transparent hover:bg-transparent focus:outline-none`}
                aria-label="Сменить язык"
              >
                <Globe className="w-6 h-6" />
              </button>
              <button
                onClick={() => router.push('/cart')}
                className={`relative p-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${theme.accent} text-white`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartState.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse bg-yellow-400 text-black border-2 border-yellow-400 shadow-md">
                    {cartState.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Модальное окно контактов */}
      {showContacts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="relative">
            <ContactsModal onClose={() => setShowContacts(false)} />
          </div>
        </div>
      )}
      {/* Горизонтальная навигация по категориям */}
      <div className={`sticky top-[72px] z-20 ${theme.bg} ${theme.border}`} style={{ borderBottomWidth: 1 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x">
            {state.categories && state.categories.length > 0 && state.categories.map((cat: Category) => (
              <button
                key={cat.id}
                data-cat={cat.id}
                onClick={() => router.push(`/menu/${restaurantId}/category/${cat.id}`)}
                className={`px-6 py-2 rounded-full whitespace-nowrap transition-all font-medium snap-center border ${cat.id === categoryId ? `${theme.accent} text-white` : `${theme.bgSecondary} ${theme.textSecondary} ${theme.border}`}`}
              >
                {currentLanguage === 'tk' ? cat.nameTk : cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Menu Items */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${state.fade === 'out' ? 'opacity-0 scale-[0.99] pointer-events-none' : 'opacity-100 scale-100'}`}>
        {state.dishes.length === 0 ? (
          <div className="text-center py-12">
            <p className={`text-lg ${theme.textSecondary}`}>{getText('noDishesInCategory', currentLanguage)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {state.dishes.map((dish: Dish) => {
              const isExpanded = expandedItems[dish.id]
              const quantity = quantities[dish.id] || 1
              return (
                <div
                  key={dish.id}
                  className={`group relative rounded-3xl border overflow-hidden transition-all duration-300 ${isExpanded ? 'z-20' : ''} ${theme.cardBg}`}
                >
                  {/* Image */}
                  <div className={`relative h-40 sm:h-44 lg:h-48 overflow-hidden ${theme.bgSecondary}`}>
                    <Image
                      src={getImageUrl(dish.image)}
                      alt={currentLanguage === 'tk' ? dish.name.tk : dish.name.ru}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {/* Content */}
                  <div className="p-4">
                    {isExpanded ? (
                      <div className="flex flex-col justify-between h-30 md:h-32">
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-center gap-2 mb-1.5">
                          <button
                            onClick={() => decreaseQuantity(dish.id)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${theme.bgSecondary} ${theme.text}`}
                            aria-label={getText('decreaseQuantity', currentLanguage)}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className={`font-bold min-w-8 text-center ${theme.text}`}>{quantity}</span>
                          <button
                            onClick={() => increaseQuantity(dish.id)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${theme.bgSecondary} ${theme.text}`}
                            aria-label={getText('increaseQuantity', currentLanguage)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Total, Add to Cart and Back */}
                        <div className="pt-1.5">
                          <div className="text-center mb-1.5">
                            <span className={`text-sm sm:text-base font-bold ${theme.text}`}>{`${getText('total', currentLanguage)}: ${dish.price * quantity} ${getText('currency', currentLanguage)}`}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOrderClick(dish.id)}
                              className={`flex-1 flex items-center justify-center py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${theme.bgSecondary} ${theme.text}`}
                              aria-label="Назад к карточке блюда"
                            >
                              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                            <button
                              onClick={() => addToCart(dish)}
                              className={`flex-1 flex items-center justify-center py-2 sm:py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${theme.accent} text-white`}
                              aria-label="Добавить в корзину"
                            >
                              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className={`font-bold mb-2 leading-tight line-clamp-2 ${theme.text}`}> 
                          {currentLanguage === 'tk' ? dish.name.tk : dish.name.ru}
                        </h3>
                        {dish.description && (
                          <p className={`text-xs mb-4 line-clamp-2 ${theme.textSecondary}`}>
                            {currentLanguage === 'tk' ? dish.description.tk : dish.description.ru}
                          </p>
                        )}
                        {/* Order Button */}
                        <button
                          onClick={() => handleOrderClick(dish.id)}
                          className={`w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${theme.accent} text-white`}
                        >
                          Заказать
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <FloatingCallButton />
    </div>
  )
}
