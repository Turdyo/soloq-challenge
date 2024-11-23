"use client"

import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { useEffect, useState } from "react"

dayjs.extend(duration)

function formatHour(time: number) {
  return `${time}`.length === 1 ? `0${time}` : `${time}`
}

function formatDays(days: number) {
  if (days === 0) return null
  if (days === 1) return "1 jour"
  return `${days} jours`
}

const fin = dayjs("2025-01-09 00:45")

export function Countdown() {
  const [today, setToday] = useState(dayjs())

  const minSec = dayjs.duration(fin.diff(today)).format("mm:ss")
  const h = formatHour(fin.diff(today, "hours") % 24)
  const days = formatDays(fin.diff(today, "days"))

  useEffect(() => {
    const interval = setInterval(() => setToday(dayjs()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <p className="text-xl font-semibold">
      {days} {h}:{minSec}
    </p>
  )
}
