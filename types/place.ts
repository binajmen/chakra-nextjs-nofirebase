import type { Geolocation, Address } from './shared'

export type OpeningHours = {
  [index: string]: {              // now, collect, delivery
    [index: string]: string[]   // mon - sun
  }
}

export type PaymentMethods = {
  [index: string]: string[]   // mon - sun
}

export type Place = {
  id?: string
  location: Address
  cover: string
  logo: string
  geo: Geolocation
  name: string
  phone: string
  slug: string
  web: string
  methods: string[]        // now, collect, delivery
  opening: OpeningHours
  payment: PaymentMethods
}
