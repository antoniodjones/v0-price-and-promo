"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

interface MiniChartProps {
  data: Array<{ value: number; timestamp?: string }>
  color?: string
  height?: number
}

export function MiniChart({ data, color = "hsl(var(--chart-1))", height = 60 }: MiniChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="text-sm font-medium">{payload[0].value?.toFixed(2)}</div>
                </div>
              )
            }
            return null
          }}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
