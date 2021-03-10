
export type Method = "now" | "collect" | "delivery" | null

export type BasketItem = {
  id: string
  longName: string
  price: number
  tax: number
  subtotal: number
  quantity: number
  total: number
}
