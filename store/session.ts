import { Action, action, Computed, computed } from 'easy-peasy'
import { geohashForLocation } from 'geofire-common'

import type { GeoLocationSensorState } from '@/hooks/useGeolocation'

export type Method = "now" | "collect" | "delivery" | null

type State = {
    method: Method
}

const state: State = {
    method: null,
}

type Model = State & {
    setMethod: Action<Model, Method>
}

const model: Model = {
    ...state,
    setMethod: action((state, method) => {
        state.method = method
    })
}

export type { State, Model }
export { state, model }