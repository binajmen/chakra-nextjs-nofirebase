
import type { Geolocation } from './shared'

export type OpeningHours = {
    [index: string]: {              // now, collect, delivery
        [index: string]: string[]   // mon - sun
    }
}

export type Place = {
    id?: string
    address?: string
    cover?: string
    geo?: Geolocation
    name?: string
    phone?: string
    slug?: string
    web?: string
    methods: string[]        // now, collect, delivery
    opening?: OpeningHours
}
