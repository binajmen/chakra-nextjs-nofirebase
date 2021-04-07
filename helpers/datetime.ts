import dayjs from "dayjs"
import minMax from "dayjs/plugin/minMax"
import isToday from "dayjs/plugin/isToday"
dayjs.extend(minMax)
dayjs.extend(isToday)

import type { OpeningHours } from "@/types/place"

export function isOpen(method: string, opening: OpeningHours) {
  const dow = dayjs().format("ddd").toLowerCase()
  const time = dayjs().format("HH:mm")

  for (let i = 0; i < opening[method][dow].length; i = i + 2) {
    if (time > opening[method][dow][i] && time < opening[method][dow][i + 1])
      return true
  }

  return false
}

export function nextInterval(interval: number) {
  const timeUntilNextInterval = interval - (dayjs().minute() % interval);
  const delay = timeUntilNextInterval < interval / 2 ? interval : 0;

  return dayjs().add(timeUntilNextInterval + delay, "minutes");
}

export function generateIntervals(date: string, schedule: string[], interval: number) {
  if (schedule === undefined || schedule.length === 0) {
    return []
  } else if (schedule.length % 2 !== 0) {
    console.error("wrong schedule format (odd entries)")
    return []
  }

  let intervals = []
  let firstInterval = nextInterval(interval)

  for (let i = 0; i < schedule.length; i = i + 2) {
    let iterator = dayjs(`${date} ${schedule[i]}`, "YYYY-MM-DD HH:mm")
    let end = dayjs(`${date} ${schedule[i + 1]}`, "YYYY-MM-DD HH:mm")

    if (iterator.isToday()) {
      if (end < firstInterval) continue
      else iterator = dayjs.max(iterator, firstInterval)
    }

    while (iterator < end) {
      intervals.push(iterator.format("HH:mm"))
      iterator = iterator.add(interval, "minute")
    }
  }

  return intervals
}

export function hasRemainingIntervalsToday(schedule: string[], interval: number) {
  const intervals = generateIntervals(dayjs().format("YYYY-MM-DD"), schedule, interval)
  return intervals.length > 0
}
