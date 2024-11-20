import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from 'lucide-react'

interface ConversionChartProps {
  data: { name: string; value: number; color: string }[]
}

export function ConversionChart({ data }: ConversionChartProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-small-semibold">Conversion Funnel</CardTitle>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-8">
          <div className="relative w-48 h-48">
            {data.map((item, index) => (
              <div
                key={index}
                className="absolute inset-0 rounded-full"
                style={{
                  border: `8px solid ${item.color}`,
                  borderRadius: '50%',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                  transform: `scale(${1 - index * 0.15}) rotate(${-90 + item.value * 3.6}deg)`,
                  transition: 'all 0.5s ease-out',
                }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-base-semibold">{`${data[data.length - 1].value}%`}</span>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-small-regular">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}