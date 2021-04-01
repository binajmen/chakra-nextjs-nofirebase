import dayjs from 'dayjs'

import type { OpeningHours } from '@/types/place'

export function isOpen(method: string, opening: OpeningHours) {
  const dow = dayjs().format('ddd').toLowerCase()
  const time = dayjs().format('HH:mm')

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

export function createTimeInterval(schedule: string[], interval: number, today: boolean = false) {
  let intervals = [];
  let firstInterval = nextInterval(interval);

  if (schedule === undefined || schedule.length === 0) {
    console.log("undefined or 0", schedule)
    return [];
  } else if (schedule.length % 2 !== 0) {
    console.error("wrong format");
    return [];
  }

  for (let i = 0; i < schedule.length; i = i + 2) {
    let start = dayjs()
      .hour(parseInt(schedule[i].slice(0, 2), 10))
      .minute(parseInt(schedule[i].slice(2), 10));
    const end = dayjs()
      .hour(parseInt(schedule[i + 1].slice(0, 2), 10))
      .minute(parseInt(schedule[i + 1].slice(2), 10));

    console.log(start.toString(), end.toString())

    if (today) {
      console.log("today", today)
      if (end < firstInterval) continue;
      else start = firstInterval
    }

    while (start < end) {
      console.log("one interval", start.format("HH:mm"))
      intervals.push(start.format("HH:mm"));
      start = start.add(interval, "minute");
    }
  }

  return intervals;
}
