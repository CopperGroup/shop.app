"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LineChartIcon } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts"

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#06b6d4', '#eab308', '#d946ef', '#22c55e', '#f43f5e'
]

interface EventTrendsProps {
  data: any[]
  eventOptions: { value: string; label: string }[]
}

export function EventTrends({ data, eventOptions }: EventTrendsProps) {
  const [selectedEvents, setSelectedEvents] = useState(['pageView', 'addToCart', 'purchase'])

  const handleEventSelection = (event: string) => {
    setSelectedEvents(prev => 
      prev.includes(event) 
        ? prev.filter(e => e !== event)
        : [...prev, event]
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Event Trends</CardTitle>
        <LineChartIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-4/5">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                {selectedEvents.map((event, index) => (
                  <Line
                    key={event}
                    type="monotone"
                    dataKey={event}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    name={eventOptions.find(e => e.value === event)?.label}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full md:w-1/5">
            <h4 className="text-sm font-medium mb-2">Select Events</h4>
            <ScrollArea className="h-[250px] w-full rounded-md border">
              <div className="p-2">
                {eventOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      id={option.value}
                      checked={selectedEvents.includes(option.value)}
                      onCheckedChange={() => handleEventSelection(option.value)}
                    />
                    <label
                      htmlFor={option.value}
                      className="text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}