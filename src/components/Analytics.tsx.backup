'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
    ym: (...args: any[]) => void
  }
}

interface AnalyticsProps {
  googleAnalyticsId?: string
  yandexMetricaId?: string
}

export default function Analytics({ 
  googleAnalyticsId = 'G-XXXXXXXXXX', 
  yandexMetricaId = '12345678' 
}: AnalyticsProps) {
  const pathname = usePathname()

  // Google Analytics
  useEffect(() => {
    if (!googleAnalyticsId) return

    // Загружаем Google Analytics
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`
    script.async = true
    document.head.appendChild(script)

    // Инициализируем gtag
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      ;(window as any).dataLayer.push(arguments)
    }
    ;(window as any).dataLayer = (window as any).dataLayer || []
    window.gtag('js', new Date())
    window.gtag('config', googleAnalyticsId)

    return () => {
      document.head.removeChild(script)
    }
  }, [googleAnalyticsId])

  // Yandex Metrica
  useEffect(() => {
    if (!yandexMetricaId) return

    // Загружаем Yandex Metrica
    const script = document.createElement('script')
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

      ym(${yandexMetricaId}, "init", {
           clickmap:true,
           trackLinks:true,
           accurateTrackBounce:true,
           webvisor:true
      });
    `
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [yandexMetricaId])

  // Отслеживание переходов между страницами
  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', googleAnalyticsId, {
        page_path: pathname,
      })
    }

    if (typeof window.ym !== 'undefined') {
      window.ym(parseInt(yandexMetricaId), 'hit', pathname)
    }
  }, [pathname, googleAnalyticsId, yandexMetricaId])

  return (
    <>
      {/* Noscript для Yandex Metrica */}
      <noscript>
        <div>
          <img 
            src={`https://mc.yandex.ru/watch/${yandexMetricaId}`} 
            style={{ position: 'absolute', left: '-9999px' }} 
            alt="" 
          />
        </div>
      </noscript>
    </>
  )
}

// Утилиты для отслеживания событий
export const trackEvent = {
  // Отслеживание добавления в корзину
  addToCart: (dishName: string, price: number, quantity: number) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'add_to_cart', {
        currency: 'TMT',
        value: price * quantity,
        items: [{
          item_name: dishName,
          quantity: quantity,
          price: price
        }]
      })
    }

    if (typeof window.ym !== 'undefined') {
      window.ym(parseInt('12345678'), 'reachGoal', 'add_to_cart', {
        dish: dishName,
        price: price,
        quantity: quantity
      })
    }
  },

  // Отслеживание оформления заказа
  purchase: (orderId: string, totalAmount: number, items: any[]) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        currency: 'TMT',
        value: totalAmount,
        items: items
      })
    }

    if (typeof window.ym !== 'undefined') {
      window.ym(parseInt('12345678'), 'reachGoal', 'purchase', {
        order_id: orderId,
        amount: totalAmount
      })
    }
  },

  // Отслеживание просмотра категории
  viewCategory: (categoryName: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'view_category', {
        category: categoryName
      })
    }

    if (typeof window.ym !== 'undefined') {
      window.ym(parseInt('12345678'), 'reachGoal', 'view_category', {
        category: categoryName
      })
    }
  },

  // Отслеживание звонка
  phoneCall: (phoneNumber: string) => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', 'phone_call', {
        phone: phoneNumber
      })
    }

    if (typeof window.ym !== 'undefined') {
      window.ym(parseInt('12345678'), 'reachGoal', 'phone_call', {
        phone: phoneNumber
      })
    }
  }
}