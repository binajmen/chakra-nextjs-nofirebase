import type { Product } from './product'

export type ModifierProducts = {
  order: string[]
  product: {
    [index: string]: Product
  }
  price: {
    [index: string]: number
  }
}

export type Modifier = {
  // info
  name: string
  description: string
  code: string
  min: number
  max: number
  products: ModifierProducts
  // where is it used ?
  categoryIds: string[]
  productIds: string[]
}

export type Modifiers = {
  // order of appearance
  order: string[]
  // copy of the modifiers
  modifier: {
    [index: string]: Modifier
  }
}
