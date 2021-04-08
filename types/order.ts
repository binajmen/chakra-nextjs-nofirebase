import firebase from '@/lib/firebase/client'

import type { Address } from './shared'

export type Method = "onsite" | "collect" | "delivery" | "geolocation" | string

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

export type OrderClient = {
  id: string
  name: string
  email: string
  phone: string
  address?: Address
}

export type Order = {
  placeId: string
  method: string
  timing?: {
    date: string
    time: string
  }
  client: OrderClient
  deliverer?: {
    id: string
    name: string
    phone: string
  }
  items: BasketItem[]
  total: number
  comment: string
  utensils: boolean,
  payment: any
  orderStatus: string
  deliveryStatus?: string
  log: {
    [index: string]: firebase.firestore.Timestamp
  }
}
