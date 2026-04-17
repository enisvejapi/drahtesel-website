'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface CartItem {
  bikeId: string
  bikeName: string
  slug: string
  image: string
  pricePerDay: number
  quantity: number
  days: number
  startDate?: string   // ISO date string e.g. "2026-03-30"
  endDate?: string     // ISO date string e.g. "2026-04-05"
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity' | 'days'>, quantity: number, days: number) => void
  updateItem: (bikeId: string, quantity: number, days: number) => void
  removeItem: (bikeId: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('drahtesel-cart')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('drahtesel-cart', JSON.stringify(items))
  }, [items])

  const addItem = useCallback((bike: Omit<CartItem, 'quantity' | 'days'>, quantity: number, days: number) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.bikeId === bike.bikeId)
      if (exists) {
        return prev.map((i) => i.bikeId === bike.bikeId ? { ...i, ...bike, quantity, days } : i)
      }
      return [...prev, { ...bike, quantity, days }]
    })
  }, [])

  const updateItem = useCallback((bikeId: string, quantity: number, days: number) => {
    setItems((prev) => prev.map((i) => i.bikeId === bikeId ? { ...i, quantity, days } : i))
  }, [])

  const removeItem = useCallback((bikeId: string) => {
    setItems((prev) => prev.filter((i) => i.bikeId !== bikeId))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.pricePerDay * i.days * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, updateItem, removeItem, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
