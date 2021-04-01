import firebase from '@/lib/firebase/client'

export type Method = "now" | "collect" | "delivery" | null

type Option = {
  id: string
  name: string
  price: number
  tax: number
}

export type BasketItem = {
  id: string
  name: string
  price: number
  tax: number
  options: Option[]
  subtotal: number
  quantity: number
  total: number
  comment: string
}

export type Order = {
  placeId: string
  method: string
  timing?: {
    date: string
    time: string
  }
  client: {
    id: string
    name: string
    email: string
    phone: string
    address?: string
  }
  deliverer?: {
    id: string
    name: string
    phone: string
  }
  items: BasketItem[]
  total: number
  utensils: boolean,
  payment: any
  orderStatus: string
  deliveryStatus?: string
  log: {
    [index: string]: firebase.firestore.Timestamp
  }
}
