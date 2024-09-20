'use server'

import React from 'react'
import Order from '@/lib/models/order.model'
import axios from 'axios'
import { number } from 'zod'
import Image from 'next/image'
import DelOrderButton from '@/components/shared/DelOrderButton'
import { fetchOrders } from '@/lib/actions/order.actions'
import OrderCard from '@/components/cards/OrderCard'
import { formatDateString } from '@/lib/utils'
import Orders from './Orders'

const Page = async () => {

  const orders = await fetchOrders();

  return (
    <section className="px-10 py-20 w-full max-[360px]:px-4">
      <h1 className="text-heading1-bold drop-shadow-text-blue">Замовлення</h1>
      
      <Orders orders={JSON.stringify(orders)} />
  </section>
  )
}

export default Page;