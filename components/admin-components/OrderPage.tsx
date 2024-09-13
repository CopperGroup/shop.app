import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { MapPin, Phone, Mail, MessageSquare, CreditCard, Truck } from 'lucide-react'
import OrderedProductCard from "@/components/cards/OrderedProductCard"
import ChangeOrdersStatuses from '../interface/ChangeOrdersStatuses'

interface Product {
  product: {
    id: string;
    name: string;
    images: string[];
    priceToShow: number;
    params: {
      name: string;
      value: string;
    }[]
  },
  amount: number
}

interface OrderProps {
  order: {
    id: string;
    name: string;
    surname: string;
    adress: string;
    city: string;
    postalCode: string;
    deliveryMethod: string;
    paymentType: string;
    phoneNumber: string;
    email: string;
    comment: string;
    products: Product[];
    value: number;
    paymentStatus: 'Pending' | 'Declined' | 'Success';
    deliveryStatus: 'Proceeding' | 'Canceled' | 'Fulfilled';
  }
}

export default function OrderPage({ orderJson }: { orderJson: string}) {
    const order = JSON.parse(orderJson);

  return (
    <div className="max-w-full justify-center overflow-x-hidden">
      <div
        className="space-y-4 sm:space-y-6"
      >
        <div className="flex items-center gap-2">
          <h1 className="text-heading1-bold">Замовлення №{order.id}</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Інформація про клієнта</h2>
            <p className="flex items-center gap-2">
              <span className="font-semibold">Ім&apos;я:</span> {order.name} {order.surname}
            </p>
            <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.adress}, ${order.city}, ${order.postalCode}`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-600 hover:text-sky-800">
              <MapPin size={16} />
              <span>{order.city}, {order.adress}, {order.postalCode}</span>
            </Link>
            <Link href={`tel:${order.phoneNumber}`} className="flex items-center gap-2 text-sky-600 hover:text-sky-800">
              <Phone size={16} />
              <span>{order.phoneNumber}</span>
            </Link>
            <Link href={`mailto:${order.email}`} className="flex items-center gap-2 text-sky-600 hover:text-sky-800">
              <Mail size={16} />
              <span>{order.email}</span>
            </Link>
            {order.comment && (
              <div className="flex items-start gap-2">
                <MessageSquare size={16} className="mt-1 flex-shrink-0" />
                <p>{order.comment}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Деталі замовлення</h2>
            <p className="flex items-center gap-2">
              <Truck size={16} />
              <span>Метод доставки: {order.deliveryMethod}</span>
            </p>
            <p className="flex items-center gap-2">
              <CreditCard size={16} />
              <span>Метод оплати: {order.paymentType}</span>
            </p>
            <ChangeOrdersStatuses id={order.id} paymentStatus={order.paymentStatus} deliveryStatus={order.deliveryStatus}/>
          </div>
        </div>
      </div>
      
      <Separator className="my-6 sm:my-12" />
      
      <div
        className="w-full"
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Замовлена продукція</h2>
        <div className="w-full space-y-4 max-h-[700px] overflow-y-auto">
          {order.products.map((product: Product) => (
            <OrderedProductCard
              key={product.product.id}
              id={product.product.id}
              name={product.product.name}
              image={product.product.images[0]}
              priceToShow={product.product.priceToShow}
              model={product.product.params[0].value}
              amount={product.amount}
            />
          ))}
        </div>
        <div className="flex justify-end items-center mt-6">
          <p className="text-xl font-semibold">Загальна вартість: <span className="text-body-semibold text-green-600">{order.value}₴</span></p>
        </div>
      </div>
    </div>
  )
}