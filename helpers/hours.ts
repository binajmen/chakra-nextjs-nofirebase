import dayjs from 'dayjs'

import type { OpeningHours } from '@/types/place'

export function isOpen(method: string, opening: OpeningHours) {
  const dow = dayjs().format('ddd').toLowerCase()
  const time = dayjs().format('HHmm')

  for (let i = 0; i < opening[method][dow].length; i = i + 2) {
    if (time > opening[method][dow][i] && time < opening[method][dow][i + 1])
      return true
  }

  return false
}

export function nextInterval(interval: number = 30) {
  const now = dayjs()
  const tillNextInterval = interval - (now.minute() % interval)
  const delay = tillNextInterval < (interval / 2) ? interval : 0
  return now.add(tillNextInterval + delay, "minutes")
}

export function buildIntervals(start: dayjs.Dayjs, stop: dayjs.Dayjs, interval: number) {
  let intervals: string[] = []

  let current = start

  while (current < stop) {
    intervals.push(current.format("HH:mm"))
    current = current.add(interval, "minutes")
  }

  return intervals
}
