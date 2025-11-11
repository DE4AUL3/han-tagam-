'use client'

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'
import { CartItem } from '@/types/menu'
import { saveToStorage, loadFromStorage } from '@/lib/utils'

interface CartState {
  items: CartItem[]
  totalAmount: number
  isLoading: boolean
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'HYDRATE_CART'; payload: CartItem[] }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getGrandTotal: () => number
} | null>(null)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      let newItems: CartItem[]
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
      } else {
        newItems = [...state.items, action.payload]
      }
      
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        ...state,
        items: newItems,
        totalAmount
      }
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== action.payload.id)
        const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        return {
          ...state,
          items: newItems,
          totalAmount
        }
      }
      
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        ...state,
        items: newItems,
        totalAmount
      }
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id)
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        ...state,
        items: newItems,
        totalAmount
      }
    }
    
    case 'CLEAR_CART':
      return {
        items: [],
        totalAmount: 0,
        isLoading: false
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'HYDRATE_CART': {
      const totalAmount = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      return {
        ...state,
        items: action.payload,
        totalAmount,
        isLoading: false
      }
    }
    
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalAmount: 0,
    isLoading: true
  })

  // Гидратация из localStorage при инициализации
  useEffect(() => {
    const savedCart = loadFromStorage<CartItem[]>('cart-items', [])
    dispatch({ type: 'HYDRATE_CART', payload: savedCart })
  }, [])

  // Сохранение в localStorage при изменении корзины
  useEffect(() => {
    if (!state.isLoading) {
      saveToStorage('cart-items', state.items)
    }
  }, [state.items, state.isLoading])



  // Удобные методы
  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item })
  }

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const getTotalItems = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const getGrandTotal = () => {
    return state.totalAmount
  }

  return (
    <CartContext.Provider value={{ 
      state, 
      dispatch, 
      addItem, 
      updateQuantity, 
      removeItem, 
      clearCart,
      getTotalItems,
      getGrandTotal
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
