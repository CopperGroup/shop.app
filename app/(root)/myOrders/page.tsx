

import React from 'react'
import { getSession } from '@/lib/getServerSession';
import Order from '@/lib/models/order.model';
import Image from 'next/image';
import { fetchUsersOrders } from '@/lib/actions/order.actions';
import OrderCard from '@/components/cards/OrderCard';
import { formatDateString } from '@/lib/utils';
import { redirect } from 'next/navigation';

const myOrders = async() => {


  const email = await getSession();
    
  if(!email){
    redirect('/login')
  }
  
  console.log(email);
  
  const orders = await fetchUsersOrders(email);
  console.log('fsdfsd',orders);

  
  return (
    <section className="max-grid1:px-2  w-full">
    <h1 className="text-heading1-bold drop-shadow-text-blue">Мої замовлення</h1>
    {orders.length > 0 ? (
      <div className="w-full gap-16 grid grid-cols-3 mt-16 max-[1900px]:gap-10 max-[1850px]:grid-cols-2 max-[1250px]:grid-cols-1">
        {orders.map((order) => (
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
    ): (
      <p className='text-center text-gray-700 font-medium text-[30px] mt-36'>Поки що замовлень немає :(</p>
    )}
 
</section> 
  )
} 

export default myOrders