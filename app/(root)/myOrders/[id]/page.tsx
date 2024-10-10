
import OrderedProductCard from "@/components/cards/OrderedProductCard";
import OrderPage from "@/components/shared/OrderPage";
import { fetchOrder } from "@/lib/actions/order.actions";
import { fetchUserById } from "@/lib/actions/user.actions";
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

    console.log("Order", order);
    
    return (
        <section className="-mt-32 px-10 py-20 w-full max-[1100px]:pb-5 max-[425px]:px-0">
            <OrderPage orderJson={JSON.stringify(order)}/>
        </section>
    )
}

export default Page;