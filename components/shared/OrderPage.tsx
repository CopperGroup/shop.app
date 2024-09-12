'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, MapPin, Phone, Mail, MessageSquare, CreditCard, Truck } from 'lucide-react'
import OrderedProductCard from "@/components/cards/OrderedProductCard"

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

  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'Proceeding':
        return 'bg-gray-500';
      case 'Declined':
      case 'Canceled':
        return 'bg-red-500';
      case 'Success':
      case 'Fulfilled':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-full overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button className="inline-flex items-center font-normal text-sky-600 hover:text-sky-800 max-lg:-ml-3 mb-2 sm:mb-4 text-sm sm:text-base" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-1 sm:mr-2" size={16} />
          Назад до замовлень
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4 sm:space-y-6"
      >
        <div className="flex items-center gap-2">
          <h1 className="text-heading2-bold">Замовлення №{order.id}</h1>
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
            <div className="flex items-center gap-2">
              <span className="font-semibold">Статус оплати:</span>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(order.paymentStatus)}`}></div>
              <span>{order.paymentStatus}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Статус доставки:</span>
              <div className={`w-3 h-3 rounded-full ${getStatusColor(order.deliveryStatus)}`}></div>
              <span>{order.deliveryStatus}</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      <Separator className="my-6 sm:my-12" />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Замовлена продукція</h2>
        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
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
          <p className="text-xl font-semibold">Загальна вартість: <span className="text-green-600">{order.value}₴</span></p>
        </div>
      </motion.div>
    </div>
  )
}