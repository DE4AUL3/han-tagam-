'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Smartphone, 
  Bell, 
  Trash2, 
  RefreshCw, 
  Share2,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

import { usePWA, useOfflineStorage } from '@/hooks/usePWA'
import Button from '@/components/ui/Button'
import { Card } from '@/components/ui/PremiumCard'

export default function PWAStatus() {
  const [showNotificationTest, setShowNotificationTest] = useState(false)
  const [testOrder, setTestOrder] = useState<any>(null)
  
  const {
    isInstallable,
    isInstalled,
    isOnline,
    isUpdateAvailable,
    cacheSize,
    install,
    update,
    clearCache,
    share,
    requestNotificationPermission,
    sendNotification,
    formatCacheSize
  } = usePWA()

  const {
    isSupported: isOfflineSupported,
    saveOrder,
    getOrders,
    saveFavorite,
    getFavorites,
    saveCart,
    getCart
  } = useOfflineStorage()

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      sendNotification('Приложение установлено!', {
        body: 'Catalog Cafe теперь доступен на вашем устройстве',
        icon: '/han_logo.jpg'
      })
    }
  }

  const handleUpdate = async () => {
    await update()
  }

  const handleClearCache = async () => {
    const success = await clearCache()
    if (success) {
      sendNotification('Кэш очищен', {
        body: 'Данные приложения обновлены'
      })
    }
  }

  const handleShare = async () => {
    await share({
      title: 'Catalog Cafe',
      text: 'Премиум каталог ресторанов с заказом онлайн',
      url: window.location.origin
    })
  }

  const handleNotificationTest = async () => {
    const permission = await requestNotificationPermission()
    if (permission === 'granted') {
      // Вибрация отдельно от уведомления
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100])
      }
      
      sendNotification('Тестовое уведомление', {
        body: 'Push уведомления работают!',
        icon: '/han_logo.jpg',
        badge: '/han_logo.jpg'
      })
      setShowNotificationTest(true)
    }
  }

  const handleTestOfflineOrder = async () => {
    const order = {
      id: Date.now().toString(),
      items: [
        { id: 1, name: 'Panda Burger', price: 899, quantity: 1 },
        { id: 2, name: 'Sweet Dessert', price: 599, quantity: 2 }
      ],
      total: 2097,
      restaurant: 'Panda Express',
      timestamp: Date.now()
    }

    await saveOrder(order)
    setTestOrder(order)
    
    sendNotification('Заказ сохранён офлайн', {
      body: 'Заказ будет отправлен при восстановлении соединения'
    })
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card variant="default" className="relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Статус подключения</h3>
          <motion.div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              isOnline 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            }`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
            {isOnline ? 'Онлайн' : 'Офлайн'}
          </motion.div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {isOnline 
            ? 'Соединение установлено. Все функции доступны.'
            : 'Нет соединения. Работает офлайн режим.'}
        </p>

        {/* Offline banner */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                <AlertCircle size={16} />
                <span className="text-sm font-medium">
                  Офлайн режим активен. Заказы будут синхронизированы при восстановлении соединения.
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Background animation */}
        <motion.div
          className={`absolute -top-4 -right-4 w-20 h-20 rounded-full blur-xl ${
            isOnline ? 'bg-green-400/20' : 'bg-red-400/20'
          }`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </Card>

      {/* PWA Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Installation */}
        <Card variant="hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Smartphone size={20} />
              Установка приложения
            </h3>
            {isInstalled ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : (
              <XCircle className="text-gray-400" size={20} />
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {isInstalled
              ? 'Приложение установлено на устройство'
              : 'Установите приложение для лучшего опыта'}
          </p>

          {isInstallable && !isInstalled && (
            <Button
              variant="primary"
              onClick={handleInstall}
              leftIcon={<Download size={16} />}
              fullWidth
            >
              Установить приложение
            </Button>
          )}
        </Card>

        {/* Updates */}
        <Card variant="hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <RefreshCw size={20} />
              Обновления
            </h3>
            {isUpdateAvailable ? (
              <motion.div
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded text-xs font-medium"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Доступно
              </motion.div>
            ) : (
              <CheckCircle className="text-green-500" size={20} />
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {isUpdateAvailable
              ? 'Доступна новая версия приложения'
              : 'У вас последняя версия приложения'}
          </p>

          {isUpdateAvailable && (
            <Button
              variant="gradient"
              onClick={handleUpdate}
              leftIcon={<RefreshCw size={16} />}
              fullWidth
            >
              Обновить
            </Button>
          )}
        </Card>

        {/* Notifications */}
        <Card variant="hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Bell size={20} />
              Уведомления
            </h3>
            {Notification.permission === 'granted' ? (
              <CheckCircle className="text-green-500" size={20} />
            ) : (
              <XCircle className="text-gray-400" size={20} />
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {Notification.permission === 'granted'
              ? 'Push уведомления включены'
              : 'Включите уведомления для получения обновлений'}
          </p>

          <div className="space-y-2">
            <Button
              variant="primary"
              onClick={handleNotificationTest}
              leftIcon={<Bell size={16} />}
              fullWidth
            >
              Тест уведомлений
            </Button>
          </div>

          <AnimatePresence>
            {showNotificationTest && (
              <motion.div
                className="mt-3 p-3 bg-green-100 dark:bg-green-900/20 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-sm text-green-800 dark:text-green-300">
                  ✅ Уведомление отправлено!
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Cache Management */}
        <Card variant="hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings size={20} />
              Управление кэшем
            </h3>
            <span className="text-sm text-gray-500">
              {formatCacheSize()}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Кэшированные данные для работы офлайн
          </p>

          <Button
            variant="outline"
            onClick={handleClearCache}
            leftIcon={<Trash2 size={16} />}
            fullWidth
          >
            Очистить кэш
          </Button>
        </Card>

      </div>

      {/* Offline Storage Test */}
      <Card variant="gradient">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <WifiOff size={20} />
          Тест офлайн функций
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Протестируйте сохранение данных в офлайн режиме
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="secondary"
            onClick={handleTestOfflineOrder}
            disabled={!isOfflineSupported}
            fullWidth
          >
            Создать тестовый заказ
          </Button>

          <Button
            variant="outline"
            onClick={handleShare}
            leftIcon={<Share2 size={16} />}
            fullWidth
          >
            Поделиться приложением
          </Button>
        </div>

        {testOrder && (
          <motion.div
            className="mt-4 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Заказ сохранён офлайн:
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              ID: {testOrder.id}<br />
              Сумма: {testOrder.total} ₽<br />
              Ресторан: {testOrder.restaurant}
            </p>
          </motion.div>
        )}

        {!isOfflineSupported && (
          <motion.div
            className="mt-4 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-red-800 dark:text-red-300">
              ⚠️ IndexedDB не поддерживается в этом браузере
            </p>
          </motion.div>
        )}
      </Card>

      {/* PWA Info */}
      <Card variant="glass">
        <h3 className="text-lg font-semibold mb-4">PWA Возможности</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isInstalled ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
              <span>Установка на устройство</span>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? <CheckCircle size={16} className="text-green-500" /> : <AlertCircle size={16} className="text-yellow-500" />}
              <span>Офлайн работа</span>
            </div>
            <div className="flex items-center gap-2">
              {Notification.permission === 'granted' ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
              <span>Push уведомления</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Кэширование данных</span>
            </div>
            <div className="flex items-center gap-2">
              {isOfflineSupported ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
              <span>Локальное хранилище</span>
            </div>
            <div className="flex items-center gap-2">
              {'share' in navigator ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-gray-400" />}
              <span>Web Share API</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}