import OrderCard from "@/components/cards/OrderCard";
import { fetchUsersOrdersById } from "@/lib/actions/order.actions";
import { fetchUserById } from "@/lib/actions/user.actions";
import { formatDateString } from "@/lib/utils";
import Link from "next/link";

const Page = async ({ params }: { params: { id: string } }) => {
    if(!params.id) {
        return (
            <section className="w-full px-10 py-20 h-screen overflow-hidden"> 
                <h1 className="w-full text-heading1-bold drop-shadow-text-blue max-[440px]:text-center">Сторінки не існує</h1>
            </section>
        )
    }

    const user = await fetchUserById(params.id);

    const usersOrders = await fetchUsersOrdersById(params.id);

    return (
        <section className="w-full px-10 py-20 h-screen max-[360px]:px-4 "> 
            <h1 className="w-full text-heading1-bold drop-shadow-text-blue">Користувач {user.username}</h1>
            <div className="w-full border-red-500 pt-3 px-1">
                <div className="w-full mt-20 border-green-500">
                    <h2 className="text-heading2-semibold">Особиста інформація</h2>
                    {user.name && <p className="text-body-medium mt-5 ml-1">Ім&apos;я: {user.name}</p>}
                    {user.surname && <p className="text-body-medium mt-5 ml-1">Прізвище: {user.surname}</p>}
                    <Link href={`mailto:${user.email}`}>
                        <p className="text-body-medium mt-5 ml-1">Email: <span className="text-primary-experimental hover:underline">{user.email}</span></p>
                    </Link>
                    {user.phoneNumber && (
                        <Link href={`tel:${user.phoneNumber}`}>
                            <p className="text-body-medium mt-5 ml-1">Номер телефону: <span className="text-primary-experimental hover:underline">{user.phoneNumber}</span></p>
                        </Link>
                    )}
                </div>
                <div className="w-full mt-20 border-green-500 mb-20 pb-16">
                    <h2 className="text-heading2-semibold mb-5">Замовлення</h2>
                    {usersOrders.length > 0 ? (
                        <div className="w-full gap-16 grid grid-cols-3 mt-16max-[1900px]:gap-10 max-[1850px]:grid-cols-2 max-[1250px]:grid-cols-1">
                            {usersOrders.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    id={order.id}
                                    products={order.products}
                                    user={order.user}
                                    value={order.value}
                                    name={order.name}
                                    surname={order.surname}
                                    phoneNumber={order.phoneNumber}
                                    email={order.email}
                                    paymentType={order.paymentType}
                                    deliveryMethod={order.deliveryMethod}
                                    city={order.city}
                                    adress={order.adress}
                                    postalCode={order.potsalCode}
                                    data={formatDateString(order.data)}
                                    paymentStatus={order.paymentStatus}
                                    deliveryStatus={order.deliveryStatus}
                                    url = '/myOrders/'
                                />
                            ))}
                        </div>
                    ) :
                        <p className="text-body-medium mt-5 ml-1">Замовлень немає</p>}
                </div>
            </div>
        </section>
    )
}

export default Page;