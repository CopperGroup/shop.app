"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, Rectangle, XAxis, YAxis } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { findTotalOrders } from "@/lib/actions/order.actions"

const chartConfig = {
  desktop: {
    label: "Added to cart",
    color: "#2563eb",
  },
} satisfies ChartConfig

interface Data {
  dateName: string,
  value: number,
}

export function TotalOrders() {
  const [ data, setData ] = React.useState<Data[]>();
  const [ date, setDate ] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: undefined
  });
  const [ chartType, setChartType ] = React.useState("BarChart");
  const [ totalOrders, setTotalOrders ] = React.useState(0);
  const [ screenWidth, setScreenWidth ] = React.useState(0);


  React.useEffect(() => {
    const fetchTotalOrders = async () => {
      const {data, overall} = await findTotalOrders(date?.from, date?.to);

      setData(data);
      setTotalOrders(overall);
    }
    fetchTotalOrders();
  }, [date])
  

  React.useEffect(() => {
    const screenWidth = window.screen.width;

    setScreenWidth(screenWidth);
  }, [screenWidth])

  return (
    <section className="w-full h-[25rem] mt-10">
      <div className="w-full h-full">
        <div className="w-full h-fit flex gap-2 justify-end max-[1300px]:flex-col">
          <div className="w-full h-full">
            <h3 className="text-heading3-bold font-semibold">Всього замовлень <span className="text-green-500 text-heading4-medium">+{totalOrders}</span></h3>
          </div>
          <div className="flex gap-1 max-[1300px]:mt-2 max-[460px]:flex-col">
            <div className={cn("grid gap-2 justify-items-end max-[460px]:justify-items-start")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal max-[460px]:w-full",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-lg" align={screenWidth <= 1300 ? "start" : 'center'}>
                  <Calendar
                    className="bg-white shadow-lg rounded-lg"
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Select defaultValue={"BarChart"} onValueChange={(value) => setChartType(value)}>
              <SelectTrigger className="w-72 border-0 border-b border-black appearance-none rounded-none mb-1 max-[460px]:w-full">
                <SelectValue className="cursor-poiner flex gap-2"/>
              </SelectTrigger>
              <SelectContent className="cursor-poiner">
                <SelectItem value="BarChart" className="w-full cursor-poiner">Стовбці</SelectItem>
                <SelectItem value="LineChart" className="cursor-poiner">Графік</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full h-[90%] overflow-visible mt-3">
          <ChartContainer config={chartConfig} className="w-full h-full text-subtle-medium overflow-visible pt-1">
            {chartType === "BarChart" ? (
              <BarChart
                accessibilityLayer
                data={data}
                margin={{
                  left: 5,
                  right: 5,
                }}
                >
                <CartesianGrid vertical={true} horizontal={true} syncWithTicks strokeDasharray="4 4 4 4"/>
                <XAxis
                  dataKey="dateName"
                  tickLine={true}
                  axisLine={true}
                  tickMargin={6}
                  minTickGap={0}
                />
                <ChartTooltip
                  content={
                    <CustomTooltip timePeriod={data} />
                  }
                />
                <Bar dataKey="value" fill="#2563eb" radius={[36, 36, 0, 0]} minPointSize={2}></Bar>
              </BarChart>
            ): (
              <LineChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                  dataKey="dateName"
                  tickLine={true}
                  axisLine={true}
                  tickMargin={6}
                  minTickGap={0}
                />
                <ChartTooltip
                  content={
                    <CustomTooltip timePeriod={data} />
                  }
                />
              <Line type="monotone" dataKey="value" stroke="#2563eb" activeDot={{ r: 4 }} />
            </LineChart>
            )}
          </ChartContainer>
        </div>
      </div>
    </section>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {

  if (active && payload && payload.length) {
    return (
      <div className={`bg-white/70 rounded-xl shadow-lg p-3`}>
        <p className="text-small-semibold">{label}</p>
        <p className="text-subtle-medium mt-1">Всього замовлень: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};