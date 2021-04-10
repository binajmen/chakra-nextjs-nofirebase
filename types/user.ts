import type { Address } from './shared'

export type UserInfo = {
  firstName: string
  lastName: string
  phone: string
  email: string
  locations: Address[]
}

export type UserProfile = UserInfo & {
  newsletter: boolean
  favorites: string[]
}

export type Claims = {
  admin: boolean
  manager: boolean
  managerOf: string[]
}
