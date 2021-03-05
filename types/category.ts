
export type Order = string[]

export type Category = {
    available: boolean
    name: string
    desc: string
    items: string[],
    // TOFIX: Event and Modifier types
    events: any,
    modifiers: any
}

export type Categories = {
    [index: string]: Category
}