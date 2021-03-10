import { Action, action, Computed, computed } from 'easy-peasy'

import type { Method, BasketItem } from '@/types/basket'

type Address = {
  street: string
  postcode: string
  city: string
}

type State = {
  place: string
  method: Method
  items: BasketItem[]
  name: string
  email: string
  date: string
  time: string
  address: Address
}

const state: State = {
  place: "",
  method: null,
  items: [],
  name: "",
  email: "",
  date: "",
  time: "",
  address: {
    street: "",
    postcode: "",
    city: ""
  }
}

type Model = State & {
  size: Computed<Model, number>
  total: Computed<Model, number>

  setPlace: Action<Model, string>
  setMethod: Action<Model, Method>
  setName: Action<Model, string>
  setEmail: Action<Model, string>
  setDate: Action<Model, string>
  setTime: Action<Model, string>
  setAddress: Action<Model, Address>

  addItem: Action<Model, BasketItem>
  increaseItem: Action<Model, number>
  decreaseItem: Action<Model, number>
  deleteItem: Action<Model, number>
  clearBasket: Action<Model>
}

const model: Model = {
  ...state,

  size: computed(state => { return state.items.reduce((a, c) => a + c.quantity, 0) }),
  total: computed(state => state.items.reduce((a, c) => a + c.total, 0)),

  setPlace: action((state, place) => {
    if (state.place !== place) {
      state.items = []
      state.place = place
    } else {
      state.place = place
    }
  }),

  setMethod: action((state, method) => {
    state.method = method
  }),

  setName: action((state, name) => {
    state.name = name
  }),

  setEmail: action((state, email) => {
    state.email = email
  }),

  setDate: action((state, date) => {
    state.date = date
  }),

  setTime: action((state, time) => {
    state.time = time
  }),

  setAddress: action((state, address) => {
    state.address = address
  }),

  addItem: action((state, item) => {
    const index = state.items.findIndex(e => {
      if (e.id === item.id)
        // e.options.length === item.options.length &&
        // e.options.every(o => item.options.find(p => p.id === o.id)) &&
        // e.choices.length === item.choices.length &&
        // e.choices.every(o => item.choices.find(p => p.id === o.id)))
        // item.options.every(o => e.options.find(p => p.id === o.id)))
        return true
      else
        return false
    })

    if (index !== -1) {
      state.items[index].total *= ((state.items[index].quantity + 1) / state.items[index].quantity)
      state.items[index].quantity += 1
    } else {
      state.items.push(item)
    }
  }),

  increaseItem: action((state, index) => {
    // increase total & quantity
    state.items[index].quantity += 1
    state.items[index].total = state.items[index].price * state.items[index].quantity
  }),

  decreaseItem: action((state, index) => {
    if (state.items[index].quantity > 1) {
      // decrease total & quantity
      state.items[index].quantity -= 1
      state.items[index].total = state.items[index].price * state.items[index].quantity
    } else {
      // delete item
      state.items = state.items.filter((_, idx) => idx !== index)
    }
  }),

  deleteItem: action((state, index) => {
    // delete item
    state.items = state.items.filter((_, idx) => idx !== index)
  }),

  clearBasket: action((state) => {
    state.items = []
  }),
}

export type { State, Model }
export { state, model }
