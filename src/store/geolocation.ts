import { Action, action, Computed, computed } from 'easy-peasy'
import { geohashForLocation } from 'geofire-common'

import type { GeoLocationSensorState } from '../hooks/useGeolocation'

type State = GeoLocationSensorState & {
    hash: string | null
}

const state: State = {
    // GeoLocationSensorState
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: undefined,
    // Geohash
    hash: null,
}

type Model = State & {
    // Computed
    hasError: Computed<Model, boolean>
    isLoading: Computed<Model, boolean>
    isReady: Computed<Model, boolean>
    isAccurate: Computed<Model, boolean>
    color: Computed<Model, string>
    // Action
    setGeolocation: Action<Model, GeoLocationSensorState>
}

const model: Model = {
    ...state,
    // Computed
    hasError: computed(state => !!state.error),
    isLoading: computed(state => state.loading),
    isReady: computed(state => !!state.hash),
    isAccurate: computed(state => (state.accuracy ?? Infinity) < 200),
    color: computed(state => state.hasError ? 'red.600' : (state.isLoading ? 'orange.400' : 'green.400')),
    // Action
    setGeolocation: action((state, geolocation) => {
        state.loading = geolocation.loading
        state.accuracy = geolocation.accuracy
        state.altitude = geolocation.altitude
        state.altitudeAccuracy = geolocation.altitudeAccuracy
        state.heading = geolocation.heading
        state.latitude = geolocation.latitude
        state.longitude = geolocation.longitude
        state.speed = geolocation.speed
        state.timestamp = geolocation.timestamp
        state.error = geolocation.error ?? undefined
        state.hash = (!geolocation.error && !geolocation.loading)
            ? geohashForLocation([geolocation.latitude!, geolocation.longitude!])
            : state.hash // keep the old hash if any
    })
}

export type { State, Model }
export { state, model }