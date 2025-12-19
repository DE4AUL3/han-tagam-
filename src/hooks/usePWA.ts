'use client'

import { useState, useEffect } from 'react'

interface PWAState {
  isInstallable: boolean
  isInstalled: boolean
  isOnline: boolean
  isUpdateAvailable: boolean
  cacheSize: number
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWA() {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: true,
    isUpdateAvailable: false,
    cacheSize: 0
  })

  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('✅ Service Worker registered:', reg)
          setRegistration(reg)

          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setState(prev => ({ ...prev, isUpdateAvailable: true }))
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error)
        })
    }
  }, [])

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setState(prev => ({ ...prev, isInstallable: true }))
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // Check if app is installed
  useEffect(() => {
    const checkInstalled = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone ||
                         document.referrer.includes('android-app://')
      
      setState(prev => ({ ...prev, isInstalled }))
    }

    checkInstalled()
    window.addEventListener('appinstalled', checkInstalled)

    return () => {
      window.removeEventListener('appinstalled', checkInstalled)
    }
  }, [])

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }))
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }))

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Get cache size
  useEffect(() => {
    const getCacheSize = async () => {
      if (registration) {
        try {
          const messageChannel = new MessageChannel()
          messageChannel.port1.onmessage = (event) => {
            const { size } = event.data
            setState(prev => ({ ...prev, cacheSize: size }))
          }

          registration.active?.postMessage(
            { type: 'GET_CACHE_SIZE' },
            [messageChannel.port2]
          )
        } catch (error) {
          console.error('Failed to get cache size:', error)
        }
      }
    }

    getCacheSize()
  }, [registration])

  // Install PWA
  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice

      if (choiceResult.outcome === 'accepted') {
        console.log('✅ PWA installed')
        setState(prev => ({ ...prev, isInstallable: false, isInstalled: true }))
        setDeferredPrompt(null)
        return true
      } else {
        console.log('❌ PWA installation declined')
        return false
      }
    } catch (error) {
      console.error('PWA installation failed:', error)
      return false
    }
  }

  // Update service worker
  const update = async (): Promise<void> => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      
      registration.waiting.addEventListener('statechange', () => {
        if (registration.waiting?.state === 'activated') {
          window.location.reload()
        }
      })
    }
  }

  // Clear cache
  const clearCache = async (): Promise<boolean> => {
    if (!registration) return false

    try {
      const messageChannel = new MessageChannel()
      
      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.success)
        }

        registration.active?.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        )
      })
    } catch (error) {
      console.error('Failed to clear cache:', error)
      return false
    }
  }

  // Share content
  const share = async (data: ShareData): Promise<boolean> => {
    if (navigator.share) {
      try {
        await navigator.share(data)
        return true
      } catch (error) {
        console.error('Sharing failed:', error)
        return false
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(data.url || data.text || '')
        return true
      } catch (error) {
        console.error('Clipboard write failed:', error)
        return false
      }
    }
  }

  // Request notification permission
  const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission
    }

    return Notification.permission
  }

  // Send notification
  const sendNotification = (title: string, options?: NotificationOptions): void => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/han_logo.jpg',
        badge: '/han_logo.jpg',
        ...options
      })
    }
  }

  // Format cache size
  const formatCacheSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    ...state,
    install,
    update,
    clearCache,
    share,
    requestNotificationPermission,
    sendNotification,
    formatCacheSize: () => formatCacheSize(state.cacheSize),
    registration
  }
}

// Offline storage hook
export function useOfflineStorage() {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported('indexedDB' in window)
  }, [])

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('CatalogCafeDB', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = () => {
        const db = request.result
        
        // Create stores
        if (!db.objectStoreNames.contains('orders')) {
          const ordersStore = db.createObjectStore('orders', { keyPath: 'id' })
          ordersStore.createIndex('timestamp', 'timestamp', { unique: false })
          ordersStore.createIndex('status', 'status', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('favorites')) {
          const favoritesStore = db.createObjectStore('favorites', { keyPath: 'id' })
          favoritesStore.createIndex('restaurantId', 'restaurantId', { unique: false })
        }

        if (!db.objectStoreNames.contains('cart')) {
          const cartStore = db.createObjectStore('cart', { keyPath: 'id' })
          cartStore.createIndex('restaurantId', 'restaurantId', { unique: false })
        }
      }
    })
  }

  const saveOrder = async (order: any): Promise<void> => {
    if (!isSupported) return

    const db = await openDB()
    const transaction = db.transaction(['orders'], 'readwrite')
    const store = transaction.objectStore('orders')
    
    await store.put({
      ...order,
      id: order.id || Date.now().toString(),
      timestamp: Date.now(),
      status: 'pending'
    })
  }

  const getOrders = async (): Promise<any[]> => {
    if (!isSupported) return []

    const db = await openDB()
    const transaction = db.transaction(['orders'], 'readonly')
    const store = transaction.objectStore('orders')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  const saveFavorite = async (item: any): Promise<void> => {
    if (!isSupported) return

    const db = await openDB()
    const transaction = db.transaction(['favorites'], 'readwrite')
    const store = transaction.objectStore('favorites')
    
    await store.put(item)
  }

  const removeFavorite = async (id: string): Promise<void> => {
    if (!isSupported) return

    const db = await openDB()
    const transaction = db.transaction(['favorites'], 'readwrite')
    const store = transaction.objectStore('favorites')
    
    await store.delete(id)
  }

  const getFavorites = async (): Promise<any[]> => {
    if (!isSupported) return []

    const db = await openDB()
    const transaction = db.transaction(['favorites'], 'readonly')
    const store = transaction.objectStore('favorites')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  const saveCart = async (cart: any[]): Promise<void> => {
    if (!isSupported) return

    const db = await openDB()
    const transaction = db.transaction(['cart'], 'readwrite')
    const store = transaction.objectStore('cart')
    
    // Clear existing cart
    await store.clear()
    
    // Save new cart items
    for (const item of cart) {
      await store.put(item)
    }
  }

  const getCart = async (): Promise<any[]> => {
    if (!isSupported) return []

    const db = await openDB()
    const transaction = db.transaction(['cart'], 'readonly')
    const store = transaction.objectStore('cart')
    
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  return {
    isSupported,
    saveOrder,
    getOrders,
    saveFavorite,
    removeFavorite,
    getFavorites,
    saveCart,
    getCart
  }
}