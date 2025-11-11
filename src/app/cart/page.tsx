'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Minus, Trash2, CheckCircle2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/hooks/useLanguage'
import { useTheme } from '@/hooks/useTheme'
import OrderForm from '@/components/OrderForm'
import { getAppThemeClasses } from '@/styles/appTheme'
import { getText } from '@/i18n/translations'


export default function CartPage() {
  const router = useRouter()
  const { currentLanguage } = useLanguage()
  const { state: cartState, updateQuantity, removeItem } = useCart()
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [completedOrderId, setCompletedOrderId] = useState('')

  const handleOrderSuccess = (orderId: string) => {
    setCompletedOrderId(orderId)
    setShowOrderForm(false)
    setShowSuccessNotification(true)
    setTimeout(() => {
      setShowSuccessNotification(false)
      router.push('/select-restaurant')
    }, 3000)
  }

  // Используем gold-elegance тему
  const theme = getAppThemeClasses('panda-dark');

  if (cartState.items.length === 0 && !showSuccessNotification) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}> 
        <div className="text-center max-w-md mx-auto px-6">
          <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${theme.bgSecondary}`}>
            <span className="text-4xl">🛒</span>
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${theme.text}`}>
            {getText('cartEmpty', currentLanguage)}
          </h2>
          <p className={`mb-8 ${theme.textSecondary}`}>
            {getText('addDishesToOrder', currentLanguage)}
          </p>
          <button
            onClick={() => router.push('/menu')}
            className={`${theme.accent} text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}
          >
            {getText('backToMenu', currentLanguage)}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 backdrop-blur-lg border-b ${theme.bg} ${theme.border}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className={`p-2 transition-colors duration-200 ${theme.text}`}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className={`text-xl font-bold ${theme.text}`}>
                  {getText('cart', currentLanguage)}
                </h1>
                <p className={`text-sm ${theme.textSecondary}`}>
                  {cartState.items.reduce((sum, item) => sum + item.quantity, 0)} {getText('cartItems', currentLanguage)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Cart Items */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4 mb-8">
          {cartState.items.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl shadow-lg border p-6 ${theme.cardBg}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-1 ${theme.text}`}>{currentLanguage === 'tk' ? (item.nameTk || item.name) : item.name}</h3>
                  <p className={`text-sm mb-3 ${theme.textSecondary}`}>{item.price} ТМТ {getText('perItem', currentLanguage)}</p>
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 rounded-lg p-2 ${theme.bgSecondary}`}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${theme.bgSecondary} ${theme.text}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className={`font-semibold min-w-8 text-center ${theme.text}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${theme.bgSecondary} ${theme.text}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right ml-6">
                  <div className="text-xl font-bold text-[#d4af37]">
                    {item.price * item.quantity} ТМТ
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Order Summary */}
        <div className={`rounded-2xl shadow-lg border p-6 mb-6 ${theme.cardBg}`}>
          <h3 className={`text-lg font-bold mb-4 ${theme.text}`}>{getText('total', currentLanguage)}</h3>
          <div className="space-y-2 mb-4">
            <div className={`border-t pt-2 ${theme.border}`}>
              <div className={`flex justify-between text-xl font-bold ${theme.text}`}>
                <span>{getText('toPay', currentLanguage)}:</span>
                <span>{cartState.totalAmount} ТМТ</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowOrderForm(true)}
            className={`w-full text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${theme.accent}`}
          >
            {getText('checkout', currentLanguage)}
          </button>
        </div>
      </main>
      {/* Order Form */}
      <OrderForm
        isOpen={showOrderForm}
        onClose={() => setShowOrderForm(false)}
        onSuccess={handleOrderSuccess}
      />
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed inset-0 bg-green-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-2xl max-w-md w-full p-8 text-center bg-white`}>
            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${theme.text}`}>
              {currentLanguage === 'tk' ? 'Sargyt kabul edildi!' : 'Заказ принят!'}
            </h3>
            <p className={`mb-2 ${theme.textSecondary}`}>
              {currentLanguage === 'tk' ? 'Sargyt belgisi:' : 'Номер заказа:'} <span className="font-mono font-bold text-green-600">#{completedOrderId}</span>
            </p>
            <p className={`mb-6 ${theme.textSecondary}`}>
              {currentLanguage === 'tk' 
                ? 'Operator sargydyň tassyklanmagy üçin we eltip bermegiň jikme-jikliklerini aýtmagy üçin ýakyn wagtda siziň bilen habarlaşar.'
                : 'Оператор свяжется с вами в ближайшее время для подтверждения заказа и уточнения деталей доставки.'
              }
            </p>
            <div className={`w-full rounded-full h-2 ${theme.bgSecondary}`}>
              <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
            <p className={`text-sm mt-2 ${theme.textMuted}`}>Перенаправление через несколько секунд...</p>
          </div>
        </div>
      )}
    </div>
  )
}