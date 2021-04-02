export type Address = {
  address: string
  addressId: string
  lat: number
  lng: number
  geohash: string
}

export type CustomerInfo = {
  firstName: string
  lastName: string
  phone: string
  email: string
  addresses: Address[]
}

export type CustomerProfile = CustomerInfo & {
  newsletter: boolean
  favorites: string[]
}
