import firebase from '@/lib/firebase/client'

export type Method = "now" | "collect" | "delivery" | null

export type BasketItem = {
  id: string
  longName: string
  price: number
  tax: number
  subtotal: number
  quantity: number
  total: number
  method: string[]
}

export type Order = {
  placeId: string
  userId: string
  method: string
  payment: any
  status: string
  progress: string
  total: number
  items: BasketItem[]
  createdAt: firebase.firestore.Timestamp
}
