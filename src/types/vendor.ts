
export type Geolocation = {
    hash: string
    lat: number
    lng: number
}

export type OpeningHours = {
    [index: string]: {              // now, takeaway, delivery
        [index: string]: string[]   // mon - sun
    }
}

export type Vendor = {
    address?: string
    cover?: string
    geo?: Geolocation
    name?: string
    phone?: string
    slug?: string
    web?: string
    types?: string[]        // now, takeaway, delivery
    opening?: OpeningHours
}