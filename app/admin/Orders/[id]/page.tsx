import OrderedProductCard from "@/components/cards/OrderedProductCard";
import ChangeOrdersStatuses from "@/components/interface/ChangeOrdersStatuses";
import DeleteOrderButton from "@/components/interface/DeleteOrderButton";
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
        <section className="px-10 py-20 w-full max-[1100px]:pb-5">
            <div className="w-full flex gap-2 items-center">
                <h1 className="text-heading2-bold">Замовлення №{order.id}</h1>
                <Image
                    src="/assets/arrow-right-circle-black.svg"
                    height={32}
                    width={32}
                    alt="Arror-right-circle"
                />
                {order.paymentStatus === "Pending" ? (
                    <>
                        <div className="size-5 rounded-full bg-gray-500"></div>
                    </>
                ): order.paymentStatus === "Declined" ? (
                    <>
                        <div className="size-5 rounded-full bg-red-500"></div>
                    </>
                ): order.paymentStatus === "Success" && (
                    <>
                        <div className="size-5 rounded-full bg-green-500"></div>
                    </>
                )}
                {order.deliveryStatus === "Proceeding"? (
                    <>
                        <div className="size-5 rounded-full bg-gray-500"></div>
                    </>
                ): order.deliveryStatus === "Canceled"? (
                    <>
                        <div className="size-5 rounded-full bg-red-500"></div>
                    </>
                ): order.deliveryStatus === "Fulfilled" && (
                    <>
                        <div className="size-5 rounded-full bg-green-500"></div>
                    </>
                )}
            </div>
            <div className="w-full flex justify-end gap-2 mt-5 max-[1100px]:hidden">
                <ChangeOrdersStatuses id={params.id} paymentStatus={order.paymentStatus} deliveryStatus={order.deliveryStatus}/>
                <div className="w-full h-fit">
                    <DeleteOrderButton id={params.id}/>
                </div>
            </div>
            <h3 className="text-heading3-bold font-medium mt-10">Ім&apos;я: {order.name} {order.surname}</h3>
            <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.adress}, ${order.city}, ${order.postalCode}`)}`} target="_blank" rel="noopener noreferrer">
                <p className="text-body-medium mt-5">Адреса доставки: <span className="text-primary-experimental hover:underline">{order.city}, {order.adress}, {order.postalCode}</span>; {order.deliveryMethod}, <span className="lowercase">оплата: {order.paymentType}</span></p>
            </Link>
            <Link href={`tel:${order.phoneNumber}`}>
                <p className="text-body-medium mt-5">Номер телеіону клієнта: <span className="text-primary-experimental hover:underline">{order.phoneNumber}</span></p>
            </Link>
            <Link href={`mailto:${order.email}`}>
                <p className="text-body-medium mt-5">Email клієнта: <span className="text-primary-experimental hover:underline">{order.email}</span></p>
            </Link>
            {order.comment !== "" && (
                <p className="text-body-medium mt-5">Коментар клієнта: {order.comment}</p>
            )}
            <div className="w-full flex-col justify-end gap-2 mt-12 min-[1101px]:hidden">
                <ChangeOrdersStatuses id={params.id} paymentStatus={order.paymentStatus} deliveryStatus={order.deliveryStatus}/>
            </div>
            <p className="text-body-medium mt-20 max-[1100px]:mt-10">Замовлена продукція</p>
            <div className="w-full flex flex-col gap-7 mt-4 h-[700px] overflow-y-scroll px-2">
                {order.products.map((product: Product) => (
                    <OrderedProductCard
                        key={product.product?.id}
                        id={product.product?.id}
                        name={product.product?.name}
                        image={product.product?.images[0]}
                        priceToShow={product.product?.priceToShow}
                        model={product.product?.params[0].value}
                        amount={product?.amount}
                    />
                ))}
            </div>
            <div className="w-full flex justify-end items-center mt-7 pr-5">
                <p className="text-body-medium">Загальна вартість: <span className="text-body-semibold text-green-500">{order.value}₴</span></p>
            </div>
            <div className="w-full flex gap-7 pl-3">
                <div className="flex gap-1 items-center mt-3 text-small-medium">
                    <p>Payment</p>
                        {order.paymentStatus === "Pending" ? (
                            <>
                                <p className="lowercase">{order.paymentStatus}</p>
                                <div className="size-3 rounded-full bg-gray-500 mt-1"></div>
                            </>
                        ): order.paymentStatus === "Declined" ? (
                            <>
                                <p className="lowercase">{order.paymentStatus}</p>
                                <div className="size-3 rounded-full bg-red-500 mt-1"></div>
                            </>
                        ): order.paymentStatus === "Success" && (
                            <>
                                <p className="lowercase">{order.paymentStatus}</p>
                                <div className="size-3 rounded-full bg-green-500 mt-1"></div>
                            </>
                        )}
                </div>
                <div className="flex gap-1 items-center mt-3 text-small-medium">
                    <p>Delivery</p>
                        {order.deliveryStatus === "Proceeding"? (
                            <>
                                <p className="lowercase">{order.deliveryStatus}</p>
                                <div className="size-3 rounded-full bg-gray-500 mt-1"></div>
                            </>
                        ): order.deliveryStatus === "Canceled"? (
                            <>
                                <p className="lowercase">{order.deliveryStatus}</p>
                                <div className="size-3 rounded-full bg-red-500 mt-1"></div>
                            </>
                        ): order.deliveryStatus === "Fulfilled" && (
                            <>
                                <p className="lowercase">{order.deliveryStatus}</p>
                                <div className="size-3 rounded-full bg-green-500 mt-1"></div>
                            </>
                        )}
                </div>
            </div>
            <div className="w-full h-fit mt-20 min-[1101px]:hidden">
                <DeleteOrderButton id={params.id}/>
            </div>
        </section>
    )
}

export default Page;