import { Action, action, Computed, computed, Thunk, thunk } from 'easy-peasy'
import { nanoid } from 'nanoid'

import firebase from '@/lib/firebase/client'

import type { UserProfile } from '@/types/user'
import type { Address } from '@/types/shared'

type State = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  locations: Address[]
  addrIndex: number
}

const state: State = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  locations: [],
  addrIndex: -1
}

type Model = State & {
  isLogged: Computed<Model, boolean>
  currentAddress: Computed<Model, Address | null>

  setId: Action<Model, string>
  setFirstName: Action<Model, string>
  setLastName: Action<Model, string>
  setEmail: Action<Model, string>
  setPhone: Action<Model, string>
  setLocations: Action<Model, Address[]>
  setAddrIndex: Action<Model, number>

  clearState: Action<Model>

  onUser: Thunk<Model>
  getUser: Thunk<Model>
}

const model: Model = {
  ...state,

  isLogged: computed(state => state.id !== ""),
  currentAddress: computed(state => {
    if (state.locations.length === 0) return null

    const index = state.addrIndex !== -1 ? state.addrIndex : 0
    return state.locations[index]
  }),

  setId: action((state, value) => { state.id = value }),
  setFirstName: action((state, value) => { state.firstName = value }),
  setLastName: action((state, value) => { state.lastName = value }),
  setEmail: action((state, value) => { state.email = value }),
  setPhone: action((state, value) => { state.phone = value }),
  setLocations: action((state, value) => { state.locations = value }),
  setAddrIndex: action((state, value) => { state.addrIndex = value }),

  clearState: action((state) => {
    state.id = ""
    state.firstName = ""
    state.lastName = ""
    state.email = ""
    state.phone = ""
    state.locations = []
  }),

  onUser: thunk((actions) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.firestore().doc(`users/${user.uid}`).get()
          .then(doc => {
            if (doc.exists) {
              const { firstName, lastName, email, phone, locations } = doc.data() as UserProfile
              actions.setFirstName(firstName)
              actions.setLastName(lastName)
              actions.setEmail(email)
              actions.setPhone(phone)
              actions.setLocations(locations)
              actions.setId(user.uid)
            }
          })
          .catch(error => {
            console.error(error)
            actions.clearState()
            // actions.setId(nanoid())
          })
      } else {
        actions.clearState()
        // actions.setId(nanoid())
      }
    })

    return unsubscribe
  }),

  getUser: thunk((_actions, _payload, { getState }) => {
    const state = getState()

    return {
      id: state.id,
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      phone: state.phone,
      locations: state.locations,
      addrIndex: state.addrIndex
    }
  }),
}

export type { State, Model }
export { state, model }