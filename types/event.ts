export type Event = {
  days: number[]
  from: string
  to: string
  name: string
  longName: string
  description: string
  type: "hide" | "show" | "price" | string
  value: 0 | 1 | number
  categoryIds: string[]
  productIds: string[]
}

export type Events = {
  order: string[]
  event: {
    [index: string]: Event
  }
}
