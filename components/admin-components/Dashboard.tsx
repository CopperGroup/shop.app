"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
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
    <div className="w-full h-full py-10">
        <div className="w-full h-fit flex items-end justify-between">
          <div className="w-fit h-fit flex items-start">
            <h2 className="text-[64px] font-semibold">₴{timePeriod.totalValue.toFixed(2)}</h2>
            <Image
              src={previewMode === "Percentage" ? (timePeriod.percentageStats.totalValue >= 0 ? "/assets/arrow-right-up-zig-zag.svg" : "/assets/arrow-right-down-zig-zag-red.svg"): timePeriod.numericStats.totalValue >= 0 ? "/assets/arrow-right-up-zig-zag.svg" : "/assets/arrow-right-down-zig-zag-red.svg"}
              height={24}
              width={24}
              alt="Total value"
              className="mt-3 ml-2"
            />
            <p className={`text-subtle-semibold font-extrabold ${previewMode === "Percentage" ? (timePeriod.percentageStats.totalValue >= 0 ? "text-green-500" : "text-red-500"): timePeriod.numericStats.totalValue >= 0 ? "text-green-500" : "text-red-500"} mt-4 ml-1`}>
              {previewMode === "Percentage" ? 
                `${timePeriod.percentageStats.totalValue.toFixed(0)}%` :
                timePeriod.numericStats.totalValue >= 0 ? `+${timePeriod.numericStats.totalValue.toFixed(2)}` : `${timePeriod.numericStats.totalValue.toFixed(2)}`
              }
            </p>
          </div>
          <div className="w-1/2 flex justify-end gap-7">
            <Select onValueChange={(element) => selectTimePeriod(element)} defaultValue="day">
              <SelectTrigger className="w-1/4 mb-3 border-0 border-b-2 border-black rounded-none font-semibold px-1 focus:ring-0 max-[1283px]:w-1/3 max-[1080px]:w-2/5">
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
              <SelectTrigger className="w-1/5 mb-3 border-0 border-b-2 border-black rounded-none font-semibold px-1 focus:ring-0 max-[1283px]:w-1/4 max-[1130px]:w-2/5">
                <SelectValue placeholder="Preview mode"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage">Відсотки</SelectItem>
                <SelectItem value="Numeric">Числа</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="w-full h-1/2 flex border-red-500">
          <div className="w-full h-4/5 rounded-xl mt-3 pb-5 pt-12 px-2">
            <div className="w-full flex justify-end">
            </div>
            <ChartContainer config={chartConfig} className="w-full h-full text-small-medium">
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
                <Bar dataKey="totalOrders" fill="var(--color-desktop)" radius={[36, 36, 0, 0]}/>
              </BarChart>
            </ChartContainer>
          </div>
        </div>
        <div className="w-full h-1/3 border-red-500 mt-5">
          <Carousel className="w-full h-full border-green-500">
            <CarouselContent className="pr-5">
              <CarouselItem className="basis-1/3 flex justify-center items-center border-violet-500 cursor-grab active:cursor-grabbing max-[1352px]:basis-2/5 max-[1216px]:basis-1/2">
                  <article className="w-full h-40 text-white shadow-xl rounded-2xl gradient-1 border-orange-500 py-4 px-4">
                    <div className="w-full h-2/5 flex justify-between items-end border-indigo-500 px-2 max-[1352px]:items-start max-[1352px]:mt-3">
                      <p className="text-body-semibold">Всього замовлень</p>
                      <Image
                        src="/assets/arrow-right-up-white.svg"
                        height={24}
                        width={24}
                        alt="arrow-right-up"
                        className={previewMode === "Percentage" ? (timePeriod.percentageStats.totalOrders >= 0 ? "" : "rotate-90"): timePeriod.numericStats.totalOrders >= 0 ? "" : "rotate-90"}
                      />
                    </div>
                    <div className="w-full h-3/5 flex justify-between items-center border-indigo-500 px-2">
                      <p className="text-heading1-bold">{timePeriod.totalOrders}</p>
                      <div className="min-w-14 h-6 flex justify-between items-center bg-white/40 rounded-full px-2">
                        <Image
                          src={previewMode === "Percentage" ? (timePeriod.percentageStats.totalOrders >= 0 ? "/assets/arrow-up-white.svg" : "/assets/arrow-down-white.svg"): timePeriod.numericStats.totalOrders >= 0 ? "/assets/arrow-up-white.svg": "/assets/arrow-down-white.svg"}
                          height={12}
                          width={12}
                          alt="arrow-up-white"
                        />
                        <p className="text-subtle-medium font-regular">
                          {previewMode === "Percentage" ? 
                            `${timePeriod.percentageStats.totalOrders.toFixed(0)}%` :
                             timePeriod.numericStats.totalOrders >= 0 ? `+${timePeriod.numericStats.totalOrders}` : `${timePeriod.numericStats.totalOrders}`
                          }
                        </p>
                      </div>
                    </div>
                  </article>
              </CarouselItem>
              <CarouselItem className="basis-1/3 h-64 flex justify-center items-center border-violet-500 cursor-grab active:cursor-grabbing max-[1352px]:basis-2/5 max-[1216px]:basis-1/2">
                  <article className="w-full h-40 shadow-xl rounded-2xl border py-4 px-4">
                    <div className="w-full h-2/5 flex justify-between items-end border-indigo-500 px-2 max-[1352px]:items-start max-[1352px]:mt-3">
                      <p className="text-body-semibold">Всього продано продукції</p>
                      <Image
                        src="/assets/arrow-right-up.svg"
                        height={24}
                        width={24}
                        alt="arrow-right-up"
                        className={previewMode === "Percentage" ? (timePeriod.percentageStats.totalProductsSold >= 0 ? "" : "rotate-90"): timePeriod.numericStats.totalProductsSold >= 0 ? "" : "rotate-90"}
                      />
                    </div>
                    <div className="w-full h-3/5 flex justify-between items-center  border-indigo-500 px-2">
                      <p className="text-heading1-bold">{timePeriod.totalProductsSold}</p>
                      <div className={`min-w-14 h-6 ${previewMode === "Percentage" ? (timePeriod.percentageStats.totalProductsSold >= 0 ? "text-green-500" : "text-red-500"): (timePeriod.numericStats.totalProductsSold >= 0 ? "text-green-500" : "text-red-500")} flex justify-between items-center bg-black/10 rounded-full px-2`}>
                        <Image
                          src={previewMode === "Percentage" ? (timePeriod.percentageStats.totalProductsSold >= 0 ? "/assets/arrow-up-green.svg" : "/assets/arrow-down-red.svg"): timePeriod.numericStats.totalProductsSold >= 0 ? "/assets/arrow-up-green.svg" : "/assets/arrow-down-red.svg"}
                          height={12}
                          width={12}
                          alt="arrow-up-white"
                        />
                        <p className="text-subtle-medium font-regular">
                          {previewMode === "Percentage" ? 
                            `${timePeriod.percentageStats.totalProductsSold.toFixed(0)}%` :
                            timePeriod.numericStats.totalProductsSold >= 0 ? `+${timePeriod.numericStats.totalProductsSold.toFixed(2)}` : `${timePeriod.numericStats.totalProductsSold.toFixed(2)}`
                          }
                        </p>
                      </div>
                    </div>
                  </article>
              </CarouselItem>
              <CarouselItem className="basis-1/3 h-64 flex justify-center items-center border-violet-500 cursor-grab active:cursor-grabbing max-[1352px]:basis-2/5 max-[1216px]:basis-1/2">
                  <article className="w-full h-40 shadow-xl rounded-2xl border py-4 px-4">
                    <div className="w-full h-2/5 flex justify-between items-end border-indigo-500 px-2 max-[1352px]:items-start max-[1352px]:mt-3">
                      <p className="text-body-semibold">Середня ціна замовлення</p>
                      <Image
                        src="/assets/arrow-right-up.svg"
                        height={24}
                        width={24}
                        alt="arrow-right-up"
                        className={previewMode === "Percentage" ? (timePeriod.percentageStats.averageOrderValue >= 0 ? "" : "rotate-90"): timePeriod.numericStats.averageOrderValue >= 0 ? "" : "rotate-90"}
                      />
                    </div>
                    <div className="w-full h-3/5 flex justify-between items-center  border-indigo-500 px-2">
                      <p className="text-heading1-bold">{timePeriod.averageOrderValue.toFixed(2)}</p>
                      <div className={`min-w-14 h-6 ${previewMode === "Percentage" ? (timePeriod.percentageStats.averageOrderValue >= 0 ? "text-green-500" : "text-red-500"): (timePeriod.numericStats.averageOrderValue >= 0 ? "text-green-500" : "text-red-500")} flex justify-between items-center bg-black/10 rounded-full px-2`}>
                        <Image
                          src={previewMode === "Percentage" ? (timePeriod.percentageStats.averageOrderValue >= 0 ? "/assets/arrow-up-green.svg" : "/assets/arrow-down-red.svg"): timePeriod.numericStats.averageOrderValue >= 0 ? "/assets/arrow-up-green.svg" : "/assets/arrow-down-red.svg"}
                          height={12}
                          width={12}
                          alt="arrow-up-white"
                        />
                        <p className="text-subtle-medium font-regular">
                          {previewMode === "Percentage" ? 
                            `${timePeriod.percentageStats.averageOrderValue.toFixed(0)}%` :
                            timePeriod.numericStats.averageOrderValue >= 0 ? `+${timePeriod.numericStats.averageOrderValue.toFixed(2)}` : `${timePeriod.numericStats.averageOrderValue.toFixed(2)}`
                          }
                        </p>
                      </div>
                    </div>
                  </article>
              </CarouselItem>
              <CarouselItem className="basis-1/3 h-64 flex justify-center items-center border-violet-500 cursor-grab active:cursor-grabbing max-[1352px]:basis-2/5 max-[1216px]:basis-1/2">
                  <article className="w-full h-40 shadow-2xl rounded-2xl border py-4 px-4">
                    <div className="w-full h-2/5 flex justify-between items-end border-indigo-500 px-2 max-[1352px]:items-start max-[1352px]:mt-3">
                      <p className="text-body-semibold">Найпопулярніший продукт</p>
                      <Image
                        src="/assets/arrow-right-up.svg"
                        height={24}
                        width={24}
                        alt="arrow-right-up"
                      />
                    </div>
                    <div className="w-full h-3/5 flex justify-between items-center  border-indigo-500 px-2">
                      {timePeriod.mostPopularProduct.searchParam !== "" ? (
                        <Link href={`/catalog/${timePeriod.mostPopularProduct.searchParam}`} target="_blank" className="text-heading3-bold">{timePeriod.mostPopularProduct.name}</Link>
                      ): (
                        <p className="text-heading3-bold">{timePeriod.mostPopularProduct.name}</p>
                      )}
                      <div className="min-w-14 h-6 text-green-500 flex justify-center items-center bg-black/10 rounded-full px-2">
                        <p className="text-subtle-medium font-regular">{timePeriod.mostPopularProduct.quantity}</p>
                      </div>
                    </div>
                  </article>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <p className="w-full text-subtle-semibold text-end px-10 mt-7 max-[1061px]:text-center max-[1061px]:px-5"><span className="text-small-semibold text-green-500">{previewMode === "Percentage" ? "% ": "+ "}</span>Порівняння з минулим відповідним періодом | Враховуються тільки оплачені і доставлені замовлення</p>
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
