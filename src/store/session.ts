import { Action, action } from 'easy-peasy'

type State = {
    method: string
}

const state: State = {
    method: 'freeze'
}

type Model = State & {
    setMethod: Action<Model, string>
}

const model: Model = {
    ...state,
    setMethod: action((state, method) => {
        state.method = method
    }),
}

export type { State, Model }
export { state, model }