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

    // const getOrders = async () => {
    //     try {
    //       const response = await axios.get("http://localhost:3000/api/getOrders");
    
    //       const data = response.data
          

    //       return data
    //     } catch (error:any) {
    //       if (error.response) {
    //         console.log('API Error Response:', error.response.data);
    //       } else {
    //         console.log('Error Message:', error.message);
    //       }
    //     } 
    // }  

    // const delOrder = async (id:string) =>{
    //   try {
    //     const response = await axios.post("http://localhost:3000/api/getOrders",id);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    const orders = await fetchOrders();

  
       
    // const orders = await getOrders();
    // console.log(orders);
  return (
    <section className="px-10 py-20 w-full">
      <h1 className="text-heading1-bold drop-shadow-text-blue">Замовлення</h1>
      
      <Orders orders={JSON.stringify(orders)} />





    {/* <h1 className="w-full text-heading1-bold drop-shadow-text-blue max-[440px]:text-center">Замовлення</h1>
    <div className="w-full h-[2px] bg-gray-400 mt-20 rounded-lg"></div>
    {orders.data.length>0?
      
      
      <div className="mt-16 border h-full menuShadow">  
       
        {orders.data.map((order:any, index:number)=>(
          <div key={order._id} className='py-10 ml-5 border-b border-dashed border-gray-700 relative w-fit'>
            
            <DelOrderButton id={order._id}/>
            <p><span className='font-semibold'>Ім'я:</span> {order.name}</p>
            <p><span className='font-semibold'>Прізвище:</span> {order.surname}</p>
            <p><span className='font-semibold'>Телефон:</span> {order.phoneNumber}</p>
            <p><span className='font-semibold'>Контактна пошта:</span> {order.contactEmail}</p>
            <p><span className='font-semibold'>Пошта акаунта:</span> {order.accountEmail}</p>
            <p><span className='font-semibold'>Спосіб оплати:</span> {order.wayToPay}</p>
            <p><span className='font-semibold'>Доставка:</span> {order.deliveryMethod}</p>
            <p><span className='font-semibold'>Місто:</span> {order.city}</p>
            <p><span className='font-semibold'>Адреса:</span> {order.adress}</p>
            <p><span className='font-semibold'>Час замовлення:</span> {order.data}</p>
            <div className=''>
            <span className='font-semibold'>Товари:</span>
              {order.products.map((product:string)=>(
                <div className='flex justify-between gap-5 items-center my-4' key={product[1]}>
                  <p>Назва товару: {product[1]}</p>
                  <div className='flex items-center gap-5'>Зображення:<Image src={product[2]} width={70} height={70} alt=''></Image></div>
                  <p>Ціна за штуку: {product[3]}грн</p>
                  <p>Кількість: {product[4]}</p>
                </div>
              ))}
            
            </div>
            <p><span className='font-semibold'>Коментар:</span> {order.coment}</p>
            <p><span className='font-semibold'>До сплати:</span> {order.toPay}грн</p>
          </div>
        ))}
    </div>
      :
        <div className='text-center text-gray-700 font-medium text-[30px] mt-36'>
          Поки що замовлень немає :(
        </div>
      }
        
     */}
  </section>
  )
}

export default Page;