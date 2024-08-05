import { AverageOrderValue } from "@/components/statistics/AverageOrderValue";
import { LeastSellingProduct } from "@/components/statistics/LeastSellingProduct";
import { TopSellingProduct } from "@/components/statistics/TopSellingProduct";
import { TotalOrders } from "@/components/statistics/TotalOrders";
import { TotalRevenue } from "@/components/statistics/TotalRevenue";


const Page = () => {
  return (
    <section className="px-10 py-20 w-full h-screen"> 
        <h1 className="w-full text-heading1-bold drop-shadow-text-blue max-[440px]:text-center">Statistics</h1>
        <div className="w-full h-full flex flex-col gap-2">
          <AverageOrderValue/>
          <TotalOrders/>
          <TotalRevenue/>
          <TopSellingProduct/>
          <LeastSellingProduct/>
        </div>
    </section>
  )
}

export default Page;