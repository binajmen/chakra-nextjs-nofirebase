import { Action, action, Computed, computed } from "easy-peasy"

import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday"
import isTomorrow from "dayjs/plugin/isTomorrow"
dayjs.extend(isToday)
dayjs.extend(isTomorrow)

import { nextInterval } from "@/helpers/datetime"

import type { Method } from "@/types/order"

type State = {
  method: Method
  date: string
  time: string
}

const state: State = {
  method: "collect",
  date: dayjs().format("YYYY-MM-DD"),
  time: nextInterval(30).format("HH:mm"),
}

type Model = State & {
  humanReadableDateTime: Computed<Model, { date: string, time?: string }>
  setMethod: Action<Model, Method>
  setDate: Action<Model, string>
  setTime: Action<Model, string>
}

const model: Model = {
  ...state,

  humanReadableDateTime: computed(state => {
    if (state.method === "onsite") {
      return { date: "now" }
    } else {
      if (dayjs(state.date).isToday()) {
        return { date: "today", time: state.time }
      } else if (dayjs(state.date).isTomorrow()) {
        return { date: "tomorrow", time: state.time }
      } else {
        return { date: dayjs(state.date).format("dddd"), time: state.time }
      }
    }
  }),

  setMethod: action((state, method) => { state.method = method }),
  setDate: action((state, date) => { state.date = date }),
  setTime: action((state, time) => { state.time = time }),
}

export type { State, Model }
export { state, model }