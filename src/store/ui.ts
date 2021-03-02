import * as React from "react"
import {
    Computed, computed,
    Action, action,
    Thunk, thunk
} from 'easy-peasy'

type State = {
    message: string
    status: "error" | "info" | "warning" | "success" | undefined
}

const state: State = {
    message: "",
    status: undefined,
}

type ToastPayload = {
    message: string
    status: "error" | "info" | "warning" | "success"
}

type Model = State & {
    hasNewToast: Computed<Model, boolean>

    setToast: Action<Model, ToastPayload>
    resetToast: Action<Model>

    toast: Thunk<Model, ToastPayload>
}

const model: Model = {
    ...state,

    hasNewToast: computed(state => state.message !== null && state.status !== undefined),

    setToast: action((state, { message, status }) => {
        state.message = message
        state.status = status
    }),

    resetToast: action((state) => {
        state.message = ""
        state.status = undefined
    }),

    toast: thunk((actions, payload) => {
        actions.setToast(payload)
    })
}

export type { State, Model }
export { state, model }
