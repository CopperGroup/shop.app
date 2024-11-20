import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChartIcon } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

interface EventActivityProps {
  data: { name: string; value: number }[]
}

export function EventActivity({ data }: EventActivityProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-small-semibold">Event Activity</CardTitle>
        <BarChartIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="value" fill="#3b82f6" name="Event Count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}