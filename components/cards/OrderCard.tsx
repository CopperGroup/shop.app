import { totalProducts } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface Props {
    id: string,
    products: {
        product: {
            id: string;
            images: string[];
            name: string;
            priceToShow: number;
            price: number;
        },
        amount: number;
    } [],
    user: {
        _id: string;
        email: string;
    },
    value: number,
    name: string,
    surname: string,
    phoneNumber: string,
    email: string,
    paymentType: string,
    deliveryMethod: string,
    city: string,
    adress: string,
    postalCode: string,
    data: string,
    paymentStatus: string,
    deliveryStatus: string,
    url:string
}

const OrderCard = ({ id, products, user, value, name, surname, phoneNumber, email, paymentType, deliveryMethod, city, adress, postalCode, data, paymentStatus, deliveryStatus, url }: Props) => {
    

    

    return (
        <article className="h-72 flex flex-col border rounded-3xl shadow-xl min-[1851px]:w-[31rem] max-[440px]:h-60 max-[375px]:h-fit">
            <div className="w-full h-[15%] flex justify-center items-center bg-green-500 rounded-t-3xl">
                <p className="text-heading4-medium tracking-widest text-dark-4">{id}</p>
            </div>
            <div className="w-full h-90% flex flex-1 flex-col">
                <div className="w-full h-full pt-2 px-5">
                    <h4 className="w-full text-center text-heading4-medium font-medium max-[375px]:hidden">{name} {surname}</h4>
                    <div className="w-full flex flex-col items-baseline">
                        <div className="flex mt-3">
                            <Image
                                src="/assets/clock.svg"
                                height={24}
                                width={24}
                                alt="Created at"
                            />
                            <p className="text-body-normal ml-2">{data}</p>
                        </div>
                        <div className="flex mt-3">
                            <Image
                                src="/assets/cube-transparent.svg"
                                height={24}
                                width={24}
                                alt="Amount of products"
                            />
                        <p className="text-body-normal ml-2">Замовлено товару: {totalProducts(products)}</p>
                        </div>
                        <div className="flex mt-3">
                            <Image
                                src="/assets/cash.svg"
                                height={24}
                                width={24}
                                alt="Total value"
                            />
                            <p className="text-body-normal ml-2">Загальна вартість: <span className="text-green-500 font-medium">{value}</span> гривень</p>
                        </div>
                        {/* <div className="flex mt-3">
                            <Image
                                src="/assets/at-symbol.svg"
                                height={24}
                                width={24}
                                alt="Email"
                            />
                            <div className="flex gap-3 text-body-normal ml-2">
                                <p>Email:</p>
                                <Link href={`mailto:${email}`} className="text-primary-experimental hover:underline">
                                    {email}
                                </Link>
                            </div>
                        </div> */}
                        <div className="flex mt-3 max-[440px]:hidden">
                            <Image
                                src="/assets/call.svg"
                                height={24}
                                width={24}
                                alt="call"
                            />
                            <div className="flex gap-3 text-body-normal ml-2">
                                <p>Телефон:</p>
                                <Link href={`tel:${phoneNumber}`} className="text-primary-experimental hover:underline">
                                    {phoneNumber}
                                </Link>
                            </div>
                        </div>
                        <div className="w-full flex gap-5 pl-8 max-grid1:pl-0 max-[440px]:hidden">
                            <div className="w-full flex gap-1 items-center mt-3 text-subtle-medium">
                                <p>Payment</p>
                                {paymentStatus === "Pending" ? (
                                    <>
                                        <p className="lowercase">{paymentStatus}</p>
                                        <div className="size-3 rounded-full bg-gray-500"></div>
                                    </>
                                ): paymentStatus === "Declined" ? (
                                    <>
                                        <p className="lowercase">{paymentStatus}</p>
                                        <div className="size-3 rounded-full bg-red-500"></div>
                                    </>
                                ): paymentStatus === "Success" && (
                                    <>
                                        <p className="lowercase">{paymentStatus}</p>
                                        <div className="size-3 rounded-full bg-green-500"></div>
                                    </>
                                )}
                            </div>
                            <div className="w-full flex gap-1 items-center mt-3 text-subtle-medium">
                                <p>Delivery</p>
                                {deliveryStatus === "Proceeding"? (
                                    <>
                                        <p className="lowercase">{deliveryStatus}</p>
                                        <div className="size-3 rounded-full bg-gray-500"></div>
                                    </>
                                ): deliveryStatus === "Canceled"? (
                                    <>
                                        <p className="lowercase">{deliveryStatus}</p>
                                        <div className="size-3 rounded-full bg-red-500"></div>
                                    </>
                                ): deliveryStatus === "Fulfilled" && (
                                    <>
                                        <p className="lowercase">{deliveryStatus}</p>
                                        <div className="size-3 rounded-full bg-green-500"></div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-fit flex px-3 pb-2 justify-end items-start">
                    <Link href={`${url}${id}`} className="w-full h-full text-right text-small-medium text-primary-experimental hover:underline underline-offset-2">Деталі</Link>
                </div>
            </div>
        </article>
    )
}

export default OrderCard;