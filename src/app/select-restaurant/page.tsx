'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function SelectRestaurantPage() {
  const restaurants = [
    {
      id: 'han-tagam',
      name: 'Han Tagam',
      nameRu: 'Хан Тагам',
      description: 'Элегантная восточная кухня',
      url: 'https://hantagam.com/menu',
      logo: '/images/han-tagam-logo.png',
      bgColor: 'bg-white',
      accentColor: 'bg-[#d4af37]',
      textColor: 'text-gray-900',
      subtitleColor: 'text-gray-600',
      borderColor: 'border-[#d4af37]'
    },
    {
      id: 'panda-burger',
      name: 'Panda Burger',
      nameRu: 'Панда Бургер',
      description: 'Сочные бургеры премиум класса',
      url: 'https://pandaburger.cloud/menu',
      logo: '/panda_logo.jpg',
      bgColor: 'bg-[#212121]',
      accentColor: 'bg-red-600',
      textColor: 'text-white',
      subtitleColor: 'text-gray-400',
      borderColor: 'border-red-600'
    }
  ]

  const handleRestaurantClick = (url: string) => {
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Выберите ресторан
          </h1>
          <p className="text-gray-600 text-lg">
            Два уникальных заведения • Один стандарт качества
          </p>
        </motion.div>

        {/* Карточки */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
              onClick={() => handleRestaurantClick(restaurant.url)}
              className="group cursor-pointer"
            >
              <div className={`${restaurant.bgColor} rounded-2xl overflow-hidden border-2 ${restaurant.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${restaurant.id === 'han-tagam' ? 'hover:shadow-yellow-500/30' : 'hover:shadow-red-600/30'}`}>
                {/* Логотип */}
                <div className="relative h-40 flex items-center justify-center p-6">
                  <Image
                    src={restaurant.logo}
                    alt={restaurant.name}
                    width={160}
                    height={160}
                    className="object-contain max-h-32 group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                </div>

                {/* Контент */}
                <div className={`p-6 border-t-2 ${restaurant.borderColor}`}>
                  <h2 className={`text-2xl font-bold ${restaurant.textColor} mb-2`}>
                    {restaurant.nameRu}
                  </h2>
                  <p className={`${restaurant.subtitleColor} text-sm mb-4`}>
                    {restaurant.description}
                  </p>

                  {/* Кнопка */}
                  <div className={`${restaurant.accentColor} text-white font-semibold py-3 px-4 rounded-xl text-center group-hover:shadow-lg transition-all duration-300`}>
                    Открыть меню
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm">
            © 2025 Han Tagam & Panda Burger
          </p>
        </motion.div>
      </div>
    </div>
  )
}
