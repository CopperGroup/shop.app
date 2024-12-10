"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useEffect, useState } from "react"
import { DatePickerWithRange } from "../ui/date-range-picker"
import { Calendar } from "../ui/calendar"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel"
import Link from "next/link"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

interface Order {
  products: {
    product: string,
    amount: number
  } [],
  userId: string;
  value: number;
  name: string;
  surname: string;
  phoneNumber: string;
  email: string;
  paymentType: string;
  deliveryMethod: string;
  city: string;
  adress: string;
  postalCode: string;
  comment: string | undefined;
  paymentStatus: string;
  deliveryStatus: string;
  data: Date;
}

interface TimePeriod {
  dateName: string;
  orders: Order[];
  totalValue: number;
  totalOrders: number;
}

interface Stats{
  data: TimePeriod[],
  totalValue: number;
  totalOrders: number;
  totalProductsSold: number;
  averageOrderValue: number;
  mostPopularProduct: {
    name: string,
    id: string,
    searchParam: string,
    quantity: number
  },
  percentageStats: {
    totalValue: number;
    totalOrders: number;
    totalProductsSold: number;
    averageOrderValue: number;
  },
  numericStats: {
    totalValue: number;
    totalOrders: number;
    totalProductsSold: number;
    averageOrderValue: number;
  }
}

interface Data {
  dayStats: Stats;
  weekStats: Stats;
  monthStats: Stats;
  threeMonthsStats: Stats;
  sixMonthsStats: Stats;
  yearStats: Stats;
}

const Dashboard = ({ stringifiedData }: { stringifiedData: string }) => {
  const data: Data = JSON.parse(stringifiedData);
  const [ timePeriod, setTimePeriod ] = useState(data.dayStats);
  const [ previewMode, setPreviewMode ] = useState("Percentage");
  
  const selectTimePeriod = (element: string) => {
    if(element === "day") {
      setTimePeriod(data.dayStats);
    } else if(element === "week") {
      setTimePeriod(data.weekStats)
    } else if(element === "month") {
      setTimePeriod(data.monthStats)
    } else if(element === "threeMonths") {
      setTimePeriod(data.threeMonthsStats)
    } else if(element === "sixMonths") {
      setTimePeriod(data.sixMonthsStats)
    } else if(element === "year") {
      setTimePeriod(data.yearStats)
    }
  }

  return (
    <div className="w-full h-full py-5 px-2 sm:py-10 sm:px-4 pb-20 max-[425px]:px-0">
      <div className="w-full h-fit flex justify-between items-end max-lg:flex-col max-lg:items-start max-lg:justify-center">
        <div className="w-fit h-fit flex items-start mb-4 sm:mb-0">
          <h2 className="text-[48px] lg:text-[64px] font-semibold max-md:text-[40px] max-[425px]:text-[36px]">₴{timePeriod.totalValue.toFixed(2)}</h2>
          <Image
            src={previewMode === "Percentage" ? (timePeriod.percentageStats.totalValue >= 0 ? "/assets/arrow-right-up-zig-zag.svg" : "/assets/arrow-right-down-zig-zag-red.svg"): timePeriod.numericStats.totalValue >= 0 ? "/assets/arrow-right-up-zig-zag.svg" : "/assets/arrow-right-down-zig-zag-red.svg"}
            height={24}
            width={24}
            alt="Total value"
            className="mt-3 ml-2 max-md:mt-0"
          />
          <p className={`text-subtle-medium sm:text-small-semibold md:text-subtle-semibold font-extrabold ${previewMode === "Percentage" ? (timePeriod.percentageStats.totalValue >= 0 ? "text-green-500" : "text-red-500"): timePeriod.numericStats.totalValue >= 0 ? "text-green-500" : "text-red-500"} mt-4 ml-1 max-md:mt-0`}>
            {previewMode === "Percentage" ? 
              `${timePeriod.percentageStats.totalValue.toFixed(0)}%` :
              timePeriod.numericStats.totalValue >= 0 ? `+${timePeriod.numericStats.totalValue.toFixed(2)}` : `${timePeriod.numericStats.totalValue.toFixed(2)}`
            }
          </p>
        </div>
        <div className="w-full flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-7">
          <Select onValueChange={(element) => selectTimePeriod(element)} defaultValue="day">
            <SelectTrigger className="w-full min-w-32 max-w-40 mb-3 border-0 border-b-2 border-black rounded-none font-semibold px-1 focus:ring-0 text-small-semibold">
              <SelectValue placeholder="Time period"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">За сьогодні</SelectItem>
              <SelectItem value="week">Останній тиждень</SelectItem>
              <SelectItem value="month">Місяць</SelectItem>
              <SelectItem value="threeMonths">Три місяці</SelectItem>
              <SelectItem value="sixMonths">Шість місяців</SelectItem>
              <SelectItem value="year">Цього року</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(element) => setPreviewMode(element)} defaultValue="Percentage">
            <SelectTrigger className="w-full min-w-32 max-w-40 mb-3 border-0 border-b-2 border-black rounded-none font-semibold px-1 focus:ring-0 text-small-semibold">
              <SelectValue placeholder="Preview mode"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Percentage">Відсотки</SelectItem>
              <SelectItem value="Numeric">Числа</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="w-full h-64 sm:h-1/2 flex border-red-500">
        <div className="w-full h-full rounded-xl mt-3 pb-5 pt-12 px-2">
          <div className="w-full flex justify-end">
          </div>
          <ResponsiveContainer>
            <ChartContainer config={chartConfig} className="w-full h-full text-subtle-medium sm:text-small-medium">
              <BarChart
                accessibilityLayer
                data={timePeriod.data}
                margin={{
                  left: 5,
                  right: 5,
                }}
                >
                <CartesianGrid vertical={false} horizontal={false} syncWithTicks/>
                <XAxis
                  dataKey="dateName"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  minTickGap={30}
                />
                <ChartTooltip
                  content={
                    <CustomTooltip timePeriod={timePeriod} />
                  }
                />
                <Bar dataKey="totalOrders" fill="var(--color-desktop)" radius={[36, 36, 0, 0]} minPointSize={2}/>
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="w-full h-auto sm:h-1/3 border-red-500 mt-5">
        <Carousel className="w-full h-full border-green-500">
          <CarouselContent className="pr-5">
            {[
              { title: "Всього замовлень", value: timePeriod.totalOrders, stat: timePeriod.percentageStats.totalOrders, numericStat: timePeriod.numericStats.totalOrders, gradient: "gradient-1" },
              { title: "Всього продано продукції", value: timePeriod.totalProductsSold, stat: timePeriod.percentageStats.totalProductsSold, numericStat: timePeriod.numericStats.totalProductsSold },
              { title: "Середня ціна замовлення", value: timePeriod.averageOrderValue.toFixed(2), stat: timePeriod.percentageStats.averageOrderValue, numericStat: timePeriod.numericStats.averageOrderValue },
              { title: "Найпопулярніший продукт", value: timePeriod.mostPopularProduct.name, quantity: timePeriod.mostPopularProduct.quantity, searchParam: timePeriod.mostPopularProduct.searchParam }
            ].map((item, index) => (
              <CarouselItem key={index} className="basis-1/4 h-40 flex justify-center items-center border-violet-500 cursor-grab active:cursor-grabbing max-[1650px]:basis-1/3 max-[1450px]:basis-1/2 max-[1250px]:basis-3/5 max-[890px]:basis-4/5 max-[480px]:basis-full">
                <article className={`w-full h-full text-${item.gradient ? 'white' : 'black'} shadow-xl rounded-2xl ${item.gradient || 'border'} py-4 px-4`}>
                  <div className="w-full h-2/5 flex justify-between items-end border-indigo-500 px-2">
                    <p className="text-base-semibold font-bold sm:text-body-semibold">{item.title}</p>
                    <Image
                      src={item.gradient ? "/assets/arrow-right-up-white.svg" : "/assets/arrow-right-up.svg"}
                      height={24}
                      width={24}
                      alt="arrow-right-up"
                      className={previewMode === "Percentage" ? (item.stat && item.stat >= 0 ? "" : "rotate-90") : item.numericStat && item.numericStat >= 0 ? "" : "rotate-90"}
                    />
                  </div>
                  <div className="w-full h-3/5 flex justify-between items-center border-indigo-500 px-2">
                    {item.searchParam !== undefined ? (
                      <Link href={`/catalog/${item.searchParam}`} target="_blank" className="text-body-semibold md:text-heading3-bold font-bold max-[425px]:text-base-semibold">{item.value}</Link>
                    ) : (
                      <p className="text-body-semibold sm:text-heading3-bold md:text-heading2-bold">{item.value}</p>
                    )}
                    {item.quantity !== undefined ? (
                      <div className="min-w-14 h-6 text-green-500 flex justify-center items-center bg-black/10 rounded-full px-2">
                        <p className="text-subtle-medium sm:text-small-medium font-regular">{item.quantity}</p>
                      </div>
                    ) : (
                      <div className={`min-w-14 h-6 ${previewMode === "Percentage" ? (item.stat >= 0 ? "text-green-500" : "text-red-500") : (item.numericStat >= 0 ? "text-green-500" : "text-red-500")} flex justify-between items-center bg-black/10 rounded-full px-2`}>
                        <Image
                          src={previewMode === "Percentage" ? (item.stat >= 0 ? "/assets/arrow-up-green.svg" : "/assets/arrow-down-red.svg") : item.numericStat >= 0 ? "/assets/arrow-up-green.svg" : "/assets/arrow-down-red.svg"}
                          height={12}
                          width={12}
                          alt="arrow-up-white"
                        />
                        <p className="text-subtle-medium sm:text-small-medium font-regular">
                          {previewMode === "Percentage" ? 
                            `${item.stat.toFixed(0)}%` :
                            item.numericStat >= 0 ? `+${item.numericStat.toFixed(2)}` : `${item.numericStat.toFixed(2)}`
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <p className="w-full text-subtle-medium sm:text-small-semibold text-center sm:text-end px-2 sm:px-10 mt-4 sm:mt-7 max-md:pb-20"><span className="text-small-semibold sm:text-base-semibold text-green-500">{previewMode === "Percentage" ? "% ": "+ "}</span>Порівняння з минулим відповідним періодом | Враховуються тільки оплачені і доставлені замовлення</p>
      </div>
    </div>
  )
}

export default Dashboard;

const CustomTooltip = ({ active, payload, label }: any) => {

  let totalProductsSold = 0;

  if (active && payload && payload.length) {
    payload[0].payload.orders.forEach((order: Order) => {
      order.products.forEach((product) => {
        totalProductsSold += product.amount;
    })});

    const averageOrderValue = payload[0].payload.totalValue > 0 ? payload[0].payload.totalValue / payload[0].value : 0;
    return (
      <div className="bg-white/70 rounded-xl shadow-lg p-3">
        <p className="text-small-semibold">{label}</p>
        <p className="text-subtle-medium">Всього замовлень: {payload[0].value}</p>
        <p className="text-subtle-medium">Загальна ціна: <span className="font-semibold text-green-500">{payload[0].payload.totalValue.toFixed(2)}</span></p>
        <p className="text-subtle-medium">Продано товару: {totalProductsSold}</p>
        <p className="text-subtle-medium">Середня вартість: <span className="text-green-500">{averageOrderValue.toFixed(2)}</span></p>
      </div>
    );
  }
  return null;
};