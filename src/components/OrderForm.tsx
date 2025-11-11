'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useTheme } from '@/hooks/useTheme'
import { useLanguage } from '@/hooks/useLanguage'
import { getText } from '@/i18n/translations'
import { db } from '@/lib/database'
import { Phone, X } from 'lucide-react'

interface OrderFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (orderId: string) => void
}

export default function OrderForm({ isOpen, onClose, onSuccess }: OrderFormProps) {
  const { state, clearCart } = useCart()
  const { currentRestaurant } = useTheme()
  const { currentLanguage } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    email: '',
    address: '',
    notes: ''
  })

  const isDark = currentRestaurant === 'panda-burger' || currentRestaurant === '1'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Сохраняем телефон клиента в базе
      const contactResponse = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: formData.phone,
          name: formData.name || undefined,
          email: formData.email || undefined
        })
      });
      
      if (!contactResponse.ok) {
        throw new Error('Ошибка при сохранении контакта');
      }
      
      const contactData = await contactResponse.json();

      // Создаем заказ в БД через API
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: contactData.id,
          phoneNumber: formData.phone,
          items: state.items.map(item => ({
            mealId: item.id,
            price: item.price,
            amount: item.quantity
          })),
          address: formData.address,
          notes: formData.notes,
          totalAmount: state.totalAmount
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Ошибка при создании заказа');
      }
      
      const orderData = await orderResponse.json();

      // Для совместимости со старым кодом сохраняем заказ и в локальной базе
      const localOrderId = db.createOrder(
        formData.phone,
        state.items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        {
          name: formData.name,
          email: formData.email,
          address: formData.address,
          notes: formData.notes
        }
      )

      clearCart()
      setFormData({
        phone: '',
        name: '',
        email: '',
        address: '',
        notes: ''
      })
      
      // Используем ID заказа из БД, если доступен
      onSuccess(orderData.id || localOrderId)
    } catch (error) {
      console.error('Ошибка при создании заказа:', error)
      alert('Произошла ошибка при оформлении заказа. Попробуйте еще раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className={`rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-[#282828]' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-6 border-b ${
          isDark ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {getText('orderFormTitle', currentLanguage)}
          </h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <X className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className={`p-6 border-b ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
          <h3 className={`font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {getText('yourOrder', currentLanguage)}:
          </h3>
          <div className="space-y-2">
            {state.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                  {item.name} × {item.quantity}
                </span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  {item.price * item.quantity} ТМТ
                </span>
              </div>
            ))}
            <div className={`flex justify-between font-semibold pt-2 border-t ${
              isDark ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>{getText('total', currentLanguage)}:</span>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>
                {state.totalAmount} ТМТ
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {getText('phoneNumber', currentLanguage)} *
            </label>
            <div className="relative">
              <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 ${
                  isDark ? 'focus:ring-red-500' : 'focus:ring-yellow-500'
                } focus:border-transparent transition-colors ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="+993 XX XXX XXX"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {getText('orderComments', currentLanguage)}
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 ${
                isDark ? 'focus:ring-red-500' : 'focus:ring-yellow-500'
              } focus:border-transparent transition-colors resize-none ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder={getText('orderCommentsPlaceholder', currentLanguage)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.phone.trim()}
            className={`w-full text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 ${
              isDark 
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' 
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{getText('submittingOrder', currentLanguage)}...</span>
              </div>
            ) : (
              getText('confirmOrder', currentLanguage)
            )}
          </button>
        </form>
      </div>
    </div>
  )
}