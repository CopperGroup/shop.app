import { DataTable } from "./data-table";
import { columns } from "./columns";
import { fetchOrdersPayments } from "@/lib/actions/order.actions";

const Page = async () => {

    const payments = await fetchOrdersPayments();

    return (
        <section className="px-10 py-20 w-full max-[360px]:px-4">
            <h1 className="text-heading1-bold drop-shadow-text-blue">Оплати</h1>
            <DataTable columns={columns} data={payments}/>
        </section>
    )
}

export default Page;