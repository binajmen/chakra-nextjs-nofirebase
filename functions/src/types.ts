// eslint-disable-next-line no-unused-vars
import * as firebase from "firebase-admin"

/**
 * Menu
 */

export type Catalog = {
  name: string
  description: string
  method: Method
  categories: string[]
}

export type Method = "onsite" | "collect" | "delivery"

/**
 * Category
 */

export type Category = {
  available: boolean
  name: string
  description: string
  products: string[]
  events: Events
  modifiers: Modifiers
  catalogIds: string[]
}

export type Categories = {
  [index: string]: Category
}

/**
 * Product
 */

export type Product = {
  available: boolean
  type: ProductType
  code: string
  imageUrl: string
  name: string
  description: string
  price: number
  tax: number
  tags: string[]
  events: Events
  modifiers: Modifiers
  // copy refs
  categoryIds: string[]
  modifierIds: string[]
  // "choiceIds": [],
  // "comboIds": [],
}

export type ProductType = "product" | "combo" | "choice"

export type Products = {
  [index: string]: Product
}

/**
 * Event
 */

export type Event = {
  name: string
  description: string
  days: string[]
  start: string
  end: string
  type: EventType
  value: number
  // copy refs
  categoryIds: string[]
  productIds: string[]
}

export type EventType = "hide" | "show" | "price"

export type Events = {
  order: string[]
  event: {
    [index: string]: Event
  }
}

/**
 * Modifier
 */

export type Modifier = {
  name: string
  description: string
  min: number
  max: number
  products: ModifierProducts
  // copy refs
  categoryIds: string[]
  productIds: string[]
}

export type ModifierProducts = {
  order: string[]
  product: {
    [index: string]: Product
  }
  price: {
    [index: string]: number
  }
}

export type Modifiers = {
  order: string[]
  modifier: {
    [index: string]: Modifier
  }
}

/**
 * Order
 */

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

export type Address = {
  address: string
  addressId: string
  lat: number
  lng: number
  geohash: string
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
  timing: {
    delay: number
    expectedAt: firebase.firestore.Timestamp
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
