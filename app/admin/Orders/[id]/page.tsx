import OrderedProductCard from "@/components/cards/OrderedProductCard";
import ChangeOrdersStatuses from "@/components/interface/ChangeOrdersStatuses";
import DeleteOrderButton from "@/components/interface/DeleteOrderButton";
import OrderPage from "@/components/shared/OrderPage";
import { fetchOrder } from "@/lib/actions/order.actions";
import Image from "next/image";
import Link from "next/link";

interface Product {
    product: {
        id: string;
        name: string;
        images: string[];
        priceToShow: number;
        params: {
            name: string;
            value: string;
        } []
    },
    amount: number
}
const Page = async ({ params }: { params: { id: string } }) => {
    if(!params.id) return null;

    const order = await fetchOrder(params.id);

    console.log(order.products);

    return (
        <section className="px-10 py-20 w-full max-[1100px]:pb-5 max-[360px]:px-5">
            <OrderPage orderJson={JSON.stringify(order)}/>
        </section>
    )
}

export default Page;