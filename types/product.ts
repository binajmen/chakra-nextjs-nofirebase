import type { Events } from './event'
import type { Modifiers } from './modifier'

export type Product = {
  available: boolean
  type: "product" | "combo" | "choice" | string
  code: string
  method: string[] // "now", "collect", "delivery"
  name: string
  description: string
  price: number
  tax: number
  events: Events
  modifiers: Modifiers
  // copy references:
  categoryIds: string[]
  modifierIds: string[]


  
  // "choiceIds": [],
  // "comboIds": [],
  // "modifierIds": [],
  // "devices": [],
  // "printers": [],
  // "tags": [],
  // "events": {},
  // "modifiers": {},
  // "siblings": {},
  // "plu": "",
}

export type Products = {
  [index: string]: Product
}
