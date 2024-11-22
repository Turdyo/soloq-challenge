"use client"

import dayjs, { Dayjs } from "dayjs"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"

function formatHour(time: number) {
  return `${time}`.length === 1 ? `0${time}` : `${time}`
}

function component() {
  const [today, setToday] = useState<Dayjs>(dayjs())
  const fin = useMemo<Dayjs>(() => dayjs("2025-01-09-00:45"), [])

  const remaningDays = useMemo<string>(() => formatHour(fin.diff(today, "d")), [today])
  const remaningHours = useMemo<string>(() => formatHour(fin.diff(today, "hours") % 24), [today])
  const remaningMinutes = useMemo<string>(() => formatHour(fin.diff(today, "m") % 60), [today])
  const remaningSeconds = useMemo<string>(() => formatHour(fin.diff(today, "s") % 60), [today])

  useEffect(() => {
    const interval = setInterval(() => setToday(dayjs()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <p className="text-xl font-semibold">
      {remaningDays} jour(s) {remaningHours}:{remaningMinutes}:{remaningSeconds}
    </p>
  )
}

export const Countdown = dynamic(() => Promise.resolve(component), { ssr: false })
