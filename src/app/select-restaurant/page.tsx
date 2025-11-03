'use client'

import { motion } from 'framer-motion'
import { Store, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function SelectRestaurantPage() {
  const restaurants = [
    {
      id: 'han-tagam',
      name: 'Han Tagam',
      nameRu: 'Хан Тагам',
      description: 'Элегантная восточная кухня',
      url: 'https://hantagam.com',
      image: '/images/han-tagam-logo.jpg',
      gradient: 'from-emerald-600 to-emerald-800',
      accentColor: 'emerald'
    },
    {
      id: 'panda-burger',
      name: 'Panda Burger',
      nameRu: 'Панда Бургер',
      description: 'Сочные бургеры и не только',
      url: 'https://pandaburger.cloud',
      image: '/images/panda-logo.jpg',
      gradient: 'from-red-600 to-red-800',
      accentColor: 'red'
    }
  ]

  const handleRestaurantClick = (url: string) => {
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        {/* Заголовок */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-4"
          >
            <Store className="w-16 h-16 text-white mx-auto" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Выберите ресторан
          </h1>
          <p className="text-gray-400 text-lg">
            Два уникальных заведения, одно качество
          </p>
        </div>

        {/* Карточки ресторанов */}
        <div className="grid md:grid-cols-2 gap-8">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => handleRestaurantClick(restaurant.url)}
              className="group cursor-pointer"
            >
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${restaurant.gradient} p-1 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-${restaurant.accentColor}-500/50`}>
                <div className="bg-gray-900/95 backdrop-blur-sm rounded-xl p-8 h-full">
                  {/* Изображение (если есть) */}
                  <div className="relative h-48 mb-6 rounded-xl overflow-hidden bg-gray-800/50">
                    <div className={`absolute inset-0 bg-gradient-to-br ${restaurant.gradient} opacity-20`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Store className={`w-24 h-24 text-${restaurant.accentColor}-500/50`} />
                    </div>
                  </div>

                  {/* Название */}
                  <h2 className="text-3xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                    {restaurant.nameRu}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">{restaurant.name}</p>

                  {/* Описание */}
                  <p className="text-gray-300 mb-6 text-lg">
                    {restaurant.description}
                  </p>

                  {/* Кнопка */}
                  <div className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-r ${restaurant.gradient} text-white font-semibold group-hover:shadow-lg transition-all`}>
                    <span>Перейти к меню</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Информация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 text-gray-500 text-sm"
        >
          <p>Работаем ежедневно с 10:00 до 23:00</p>
          <p className="mt-2">Доставка по городу • Самовывоз • Бронирование столов</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
