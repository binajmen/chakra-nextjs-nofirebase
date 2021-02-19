import { useMemo } from 'react'
import {
    createStore,
    persist,
    Action, action,
} from 'easy-peasy'

import * as session from './session'

let store = undefined

export type State =
    session.State

const initialState: State = {
    ...session.state
}

export type StoreType = {
    session: session.Model
}

const model: StoreType = {
    session: session.model,
}

function initStore(preloadedState: State = initialState) {
    return createStore(
        persist(
            model,
            { allow: [] }
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