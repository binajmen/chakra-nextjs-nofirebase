import type { Events } from './event'
import type { Modifiers } from './modifier'

export type Order = string[]

export type CategoryMeta = {
  order: Order
}

export type Category = {
  available: boolean
  name: string
  description: string
  products: string[],
  events: Events,
  modifiers: Modifiers,
  method: string[]
}

export type Categories = {
  [index: string]: Category
}
