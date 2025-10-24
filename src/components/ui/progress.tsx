"use client"

import * as React from "react"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

export function Progress({ value = 0, className = "" }: ProgressProps) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className={`h-2 w-full rounded-full bg-gray-200 ${className}`}>
      <div
        className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 transition-all"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export default Progress


