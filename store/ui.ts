import { Action, action, Computed, computed } from 'easy-peasy'

type Filters = {
  open: boolean
  favorites: boolean
  cuisines: string[]
  keywords: string[]
}

type State = {
  filters: Filters
}

const state: State = {
  filters: {
    open: true,
    favorites: false,
    cuisines: [],
    keywords: [],
  },
}

type Model = State & {
  filtersCount: Computed<Model, number>

  setFilters: Action<Model, Partial<Filters>>
  addCuisine: Action<Model, string>
  delCuisine: Action<Model, string>
  addKeyword: Action<Model, string>
  delKeyword: Action<Model, string>
}

const model: Model = {
  ...state,

  filtersCount: computed((state) => {
    let count = 0

    if (state.filters.open) count++
    if (state.filters.favorites) count++
    if (state.filters.cuisines.length > 0) count++
    if (state.filters.keywords.length > 0) count++

    return count
  }),

  setFilters: action((state, filters) => {
    state.filters = { ...state.filters, ...filters }
  }),

  addCuisine: action((state, cuisine) => {
    state.filters.cuisines = [...state.filters.cuisines, cuisine]
  }),
  delCuisine: action((state, cuisine) => {
    state.filters.cuisines = state.filters.cuisines.filter(c => c !== cuisine)
  }),

  addKeyword: action((state, keyword) => {
    state.filters.keywords = [...state.filters.keywords, keyword]
  }),
  delKeyword: action((state, keyword) => {
    state.filters.keywords = state.filters.keywords.filter(k => k !== keyword)
  }),
}

export type { State, Model }
export { state, model }