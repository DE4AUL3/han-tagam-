'use client'

import { motion } from 'framer-motion'
import { Store, ArrowRight, MapPin, Clock, Phone } from 'lucide-react'
import Image from 'next/image'

export default function SelectRestaurantPage() {
  const restaurants = [
    {
      id: 'han-tagam',
      name: 'Han Tagam',
      nameRu: 'Хан Тагам',
      nameTk: 'Han Tagam',
      description: 'Элегантная восточная кухня',
      descriptionTk: 'Şöhratly gündogar aşhanasy',
      url: 'https://hantagam.com',
      logo: '/images/han-tagam-logo.png',
      gradient: 'from-emerald-600 to-emerald-800',
      glowColor: 'emerald',
      features: ['Национальная кухня', 'Банкетный зал', 'VIP кабинеты']
    },
    {
      id: 'panda-burger',
      name: 'Panda Burger',
      nameRu: 'Панда Бургер',
      nameTk: 'Panda Burger',
      description: 'Сочные бургеры премиум класса',
      descriptionTk: 'Ýokary hilli burgerler',
      url: 'https://pandaburger.cloud',
      logo: '/panda_logo.png',
      gradient: 'from-red-600 to-red-800',
      glowColor: 'red',
      features: ['Авторские бургеры', 'Быстрая доставка', 'Fresh напитки']
    }
  ]

  const handleRestaurantClick = (url: string) => {
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-7xl"
        >
          {/* Заголовок */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-red-500 rounded-full blur-xl opacity-50"></div>
                <Store className="w-20 h-20 text-white relative z-10" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight"
            >
              Выберите <span className="bg-gradient-to-r from-emerald-400 to-red-400 bg-clip-text text-transparent">ресторан</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-xl max-w-2xl mx-auto"
            >
              Два уникальных заведения • Одно качество • Незабываемый вкус
            </motion.p>
          </div>

          {/* Карточки ресторанов */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, x: index === 0 ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                onClick={() => handleRestaurantClick(restaurant.url)}
                className="group cursor-pointer"
              >
                <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${restaurant.gradient} p-1 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-${restaurant.glowColor}-500/50`}>
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${restaurant.gradient} opacity-0 group-hover:opacity-50 blur-2xl transition-opacity duration-500`}></div>
                  
                  <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 h-full">
                    {/* Логотип */}
                    <div className="relative h-64 mb-8 rounded-2xl overflow-hidden bg-gray-800/50 flex items-center justify-center border border-gray-700/50">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50"></div>
                      <Image
                        src={restaurant.logo}
                        alt={restaurant.name}
                        width={200}
                        height={200}
                        className="relative z-10 object-contain max-h-48 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Название */}
                    <h2 className="text-4xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all">
                      {restaurant.nameRu}
                    </h2>
                    <p className="text-sm text-gray-400 mb-4">{restaurant.nameTk}</p>

                    {/* Описание */}
                    <p className="text-gray-300 mb-6 text-lg">
                      {restaurant.description}
                    </p>

                    {/* Фичи */}
                    <div className="space-y-2 mb-8">
                      {restaurant.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-gray-400">
                          <div className={`w-1.5 h-1.5 rounded-full bg-${restaurant.glowColor}-500`}></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Кнопка */}
                    <div className={`flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r ${restaurant.gradient} text-white font-semibold group-hover:shadow-2xl group-hover:shadow-${restaurant.glowColor}-500/50 transition-all duration-300`}>
                      <span className="text-lg">Перейти к меню</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Информация */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center space-y-6"
          >
            <div className="flex flex-wrap justify-center gap-8 text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <span>Ежедневно 10:00 - 23:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-red-400" />
                <span>Доставка по городу</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span>Бронирование столов</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm">
              © 2025 Han Tagam & Panda Burger. Все права защищены.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
