/**
 * Menu
 */

export type Catalog = {
  name: string
  description: string
  method: Method
  categories: string[]
}

export type Method = "now" | "collect" | "delivery"

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
