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
  name: string
  longName: string
  description: string
  min: number
  max: number
  products: ModifierProducts
  plu: string
  categoryIds: string[]
  productIds: string[]
}

export type Modifiers = {
  order: string[]
  modifier: {
    [index: string]: Modifier
  }
}
