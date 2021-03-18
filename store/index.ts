import { useMemo } from 'react'
import { createStore, persist, Store } from 'easy-peasy'

import * as ui from './ui'
import * as geolocation from './geolocation'
import * as basket from './basket'
// import * as categories from './categories'
// import * as products from './products'

let store: Store | undefined = undefined

export type State = {
  ui: ui.State
  geolocation: geolocation.State
  basket: basket.State
}

const initialState: State = {
  ui: ui.state,
  geolocation: geolocation.state,
  basket: basket.state,
}

export type StoreModel = {
  ui: ui.Model
  geolocation: geolocation.Model
  basket: basket.Model
}

const model: StoreModel = {
  ui: ui.model,
  geolocation: geolocation.model,
  basket: basket.model,
}

function initStore(preloadedState = initialState) {
  return createStore<StoreModel, State>(
    persist(
      model,
      {
        allow: [
          'basket'
        ]
      }
    ),
    { initialState: preloadedState }
  )
}

export function initializeStore(preloadedState: State) {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState: State) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}
