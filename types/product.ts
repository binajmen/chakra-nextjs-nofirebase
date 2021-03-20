
export type Product = {
  id: string
  available: boolean
  name: string
  longName: string
  desc: string
  price: number
  tax: number
  size: string
  categoryIds: string[]
  type: string
  method: string[]
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