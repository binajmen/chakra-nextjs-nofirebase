import { Action, action, Thunk, thunk } from 'easy-peasy'
import { nanoid } from 'nanoid'

import firebase from '@/lib/firebase/client'

import type { CustomerProfile, Address } from '@/types/customer'

type State = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  addresses: Address[]
}

const state: State = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  addresses: []
}

type Model = State & {
  setId: Action<Model, string>
  setFirstName: Action<Model, string>
  setLastName: Action<Model, string>
  setEmail: Action<Model, string>
  setPhone: Action<Model, string>
  setAddresses: Action<Model, Address[]>

  clearState: Action<Model>

  onUser: Thunk<Model>
  // getUser: Thunk<Model>
  getUser: Action<Model>
}

const model: Model = {
  ...state,

  setId: action((state, value) => { state.id = value }),
  setFirstName: action((state, value) => { state.firstName = value }),
  setLastName: action((state, value) => { state.lastName = value }),
  setEmail: action((state, value) => { state.email = value }),
  setPhone: action((state, value) => { state.phone = value }),
  setAddresses: action((state, value) => { state.addresses = value }),

  clearState: action((state) => {
    state.id = ""
    state.firstName = ""
    state.lastName = ""
    state.email = ""
    state.phone = ""
    state.addresses = []
  }),

  onUser: thunk((actions) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.firestore().doc(`customers/${user.uid}`).get()
          .then(doc => {
            if (doc.exists) {
              const { firstName, lastName, email, phone, addresses } = doc.data() as CustomerProfile
              actions.setFirstName(firstName)
              actions.setLastName(lastName)
              actions.setEmail(email)
              actions.setPhone(phone)
              actions.setAddresses(addresses)
              actions.setId(user.uid)
            }
          })
          .catch(error => {
            console.error(error)
            actions.clearState()
            actions.setId(nanoid())
          })
      } else {
        actions.clearState()
        actions.setId(nanoid())
      }
    })

    return unsubscribe
  }),

  // getUser: thunk((_actions, _payload, helpers) => {
  //   const { getState } = helpers

  //   return {
  //     id: getState().id,
  //     firstName: getState().firstName,
  //     lastName: getState().lastName,
  //     email: getState().email,
  //     phone: getState().phone,
  //     addresses: getState().addresses,
  //   }
  // }),

  getUser: action((state) => {
    return {
      id: state.id,
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      phone: state.phone,
      addresses: state.addresses,
    }
  }),
}

export type { State, Model }
export { state, model }