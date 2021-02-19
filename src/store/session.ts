import { Action, action } from 'easy-peasy'

export type Method = "now" | "takeaway" | "delivery" | null

type State = {
    method: Method
}

const state: State = {
    method: null
}

type Model = State & {
    setMethod: Action<Model, Method>
}

const model: Model = {
    ...state,
    setMethod: action((state, method) => {
        state.method = method
    }),
}

export type { State, Model }
export { state, model }