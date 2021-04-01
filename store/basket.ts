import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { nanoid } from 'nanoid'

import type { Method, BasketItem } from '@/types/order'

type Client = {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

type State = {
  placeId: string
  method: Method
  client: Client
  items: BasketItem[]
  utensils: boolean
  comment: string
  date: string
  time: string
  payment: string
}

const state: State = {
  placeId: "",
  method: null,
  client: {
    id: "",
    name: "",
    email: "",
    phone: "",
    address: ""
  },
  items: [],
  utensils: false,
  comment: "",
  date: "",
  time: "",
  payment: "",
}

type ChangeMethodPayload = {
  method: string
  isConfirmed?: boolean
}

type Model = State & {
  size: Computed<Model, number>
  total: Computed<Model, number>

  setPlaceId: Action<Model, string>
  setClient: Action<Model, Client>
  setUtensils: Action<Model, boolean>
  setComment: Action<Model, string>
  setDate: Action<Model, string>
  setTime: Action<Model, string>
  setPayment: Action<Model, string>

  addItem: Action<Model, BasketItem>
  increaseItem: Action<Model, number>
  decreaseItem: Action<Model, number>
  deleteItem: Action<Model, number>
  clearBasket: Action<Model>

  _setMethod: Action<Model, Method>
  setMethod: Thunk<Model, string>
}

const model: Model = {
  ...state,

  size: computed(state => { return state.items.reduce((a, c) => a + c.quantity, 0) }),
  total: computed(state => state.items.reduce((a, c) => a + c.total, 0)),

  setPlaceId: action((state, placeId) => {
    if (state.placeId !== placeId) {
      state.items = []
      state.placeId = placeId
    }
  }),

  _setMethod: action((state, method) => {
    state.method = method
  }),

  setClient: action((state, client) => {
    state.client = client
  }),

  setDate: action((state, date) => {
    state.date = date
  }),

  setTime: action((state, time) => {
    state.time = time
  }),

  setPayment: action((state, payment) => {
    state.payment = payment
  }),

  setComment: action((state, comment) => {
    state.comment = comment
  }),

  setUtensils: action((state, utensils) => {
    state.utensils = utensils
  }),

  addItem: action((state, item) => {
    const index = state.items.findIndex(e => {
      if (e.id === item.id &&
        e.options.length === item.options.length &&
        e.options.every(o => item.options.find(p => p.id === o.id)))
        return true
      else
        return false
    })

    if (index !== -1) {
      state.items[index].quantity += item.quantity
      state.items[index].total = state.items[index].subtotal * state.items[index].quantity
    } else {
      state.items.push(item)
    }
  }),

  increaseItem: action((state, index) => {
    // increase total & quantity
    state.items[index].quantity += 1
    state.items[index].total = state.items[index].subtotal * state.items[index].quantity
  }),

  decreaseItem: action((state, index) => {
    if (state.items[index].quantity > 1) {
      // decrease total & quantity
      state.items[index].quantity -= 1
      state.items[index].total = state.items[index].subtotal * state.items[index].quantity
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
    state.placeId = ""
    // state.method = null
    state.items = []
    state.date = ""
    state.time = ""
    state.payment = ""
  }),

  setMethod: thunk((actions, method, helpers) => {
    const { getState } = helpers
    if (method !== getState().method) {
      actions.clearBasket()
      actions._setMethod(method as Method)
    }
    // const { getState } = helpers
    // const currentMethod = getState().method
    // const items = getState().items
    // const { method, isConfirmed = false } = payload

    // if (isConfirmed) {
    //   // remove items that doesn't belong in new method
    //   // items.forEach((item, index) => {
    //   //   if (!item.method.includes(method))
    //   //     actions.deleteItem(index)
    //   // })

    //   actions._setMethod(method as Method)
    //   return true
    // } else if (currentMethod !== method) {
    //   // every items belongs in the new method
    //   // const isOk = items.every(item => item.method.includes(method))
    //   const isOk = true

    //   if (isOk) {
    //     actions._setMethod(method as Method)
    //     return true
    //   } else {
    //     return false
    //   }
    // } else {
    //   return true
    // }
  })
}

export type { State, Model }
export { state, model }
