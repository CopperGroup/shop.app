import Dashboard from "@/components/admin-components/Dashboard"
import { getDashboardData } from "@/lib/actions/order.actions";

const Page = async () => {
    const dashboardData = await getDashboardData();

    return (
        <section className="w-full px-10 py-20 h-screen"> 
            <h1 className="w-full text-heading1-bold drop-shadow-text-blue mb-6">Dashboard</h1>
            <Dashboard stringifiedData={JSON.stringify(dashboardData)}/>
        </section>
    )
}

export default Page;