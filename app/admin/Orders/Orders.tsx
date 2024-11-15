'use client'


import React from 'react'
import { useState, useEffect } from 'react'
import { formatDateString } from '@/lib/utils'
import OrderCard from '@/components/cards/OrderCard'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { Button } from '@/components/ui/button'

interface Order{
  _id:string,
  id:string,
  products:{
    product:{
      id:string,
      images:string[],
      name:string,
      priceToShow:number,
      price:number,
    },
    amount:number,
  }[],
  user:{
    _id:string,
    email:string,
  },
  value:number,
  name:string,
  surname:string,
  phoneNumber:string,
  email:string,
  paymentType:string,
  deliveryMethod:string,
  city:string,
  adress:string,
  postalCode:string,
  comment:string,
  paymentStatus: "Pending" | "Success" | "Declined";
  deliveryStatus: "Proceeding" | "Fulfilled" | "Canceled";
  data:string

 
}


const Orders = ({orders}:{orders:string}) => {

    const [filtredOrders, setFiltredOrders] = useState([]);

    const Orders = JSON.parse(orders)
    //console.log('fd',orders)
    

    const payment = Array.from(new Set (Orders.map((item:Order) => item.paymentStatus))).filter(function(item) {return item !== '';});
    const delivery = Array.from(new Set (Orders.map((item:Order) => item.deliveryStatus))).filter(function(item) {return item !== '';});

    const [p, setP] = useState('');
    const [d, setD] = useState('');


    useEffect(()=>{
        setFiltredOrders(Orders);
   },[])

    //console.log('ff',filtredOrders)


    useEffect(()=>{
      if(p=='all'){
        setFiltredOrders(Orders.filter((obj:Order) => obj.deliveryStatus?.includes(d)));
      }else if(d=='all'){
        setFiltredOrders(Orders.filter((obj:Order) => obj.paymentStatus?.includes(p)));
      }else{
        setFiltredOrders(Orders.filter((obj:Order) => obj.paymentStatus?.includes(p) && obj.deliveryStatus?.includes(d)));
      }
      
    },[p,d])


    
    //setFiltredOrders(orders.filter((obj:Order) => obj.paymentStatus?.includes(oplata)))

  return (
    <div>

        <div className='flex justify-end gap-5 mt-10 max-md:justify-start max-[425px]:flex-col'>


        


        <Select onValueChange={(element)=>setP(element)}>
            <SelectTrigger className="w-[180px] max-[425px]:w-full">
                <SelectValue placeholder="Стан оплати" />
            </SelectTrigger>
            <SelectContent className='w-[180px]'>
                <SelectItem value='all'>All</SelectItem>
                <SelectGroup className='w-full'>
                {payment?.map((payment)=>(
                    //@ts-ignore
                    <SelectItem value={payment as string} className='w-[180px]' key={delivery}>
                        <div className='flex items-center justify-between w-28'>
                        {payment === "Pending" ? (
                                    <>
                                        <p >{payment}</p>
                                        <div className="size-3 rounded-full bg-gray-500"></div>
                                    </>
                                ): payment === "Declined" ? (
                                    <>
                                        <p >{payment}</p>
                                        <div className="size-3 rounded-full bg-red-500"></div>
                                    </>
                                ): payment === "Success" && (
                                    <>
                                        <p >{payment}</p>
                                        <div className="size-3 rounded-full bg-green-500"></div>
                                    </>
                                )}
                        
                        </div>
                    
                    </SelectItem>
                ))}    
                </SelectGroup>
            </SelectContent>
        </Select>


        <Select onValueChange={(element)=>setD(element)}>
            <SelectTrigger className="w-[180px] max-[425px]:w-full">
                <SelectValue placeholder="Стан доставки " />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectItem value='all'>All</SelectItem>
                {delivery?.map((delivery)=>(
                    //@ts-ignore
                    <SelectItem value={delivery as string} key={delivery}>

                  <div className='flex items-center justify-between w-28'>
                    {delivery === "Proceeding"? (
                                      <>
                                          <p>{delivery}</p>
                                          <div className="size-3 rounded-full bg-gray-500"></div>
                                      </>
                                  ): delivery === "Canceled"? (
                                      <>
                                          <p>{delivery}</p>
                                          <div className="size-3 rounded-full bg-red-500"></div>
                                      </>
                                  ): delivery === "Fulfilled" && (
                                      <>
                                          <p>{delivery}</p>
                                          <div className="size-3 rounded-full bg-green-500"></div>
                                      </>
                            )}   
                  </div>
                    
                    </SelectItem>
                 
                ))}   
                </SelectGroup>
            </SelectContent>
        </Select>




        </div>



        {filtredOrders.length > 0 ? (
        <div className="w-full gap-16 grid grid-cols-3 mt-16 max-[1900px]:gap-10 max-[1850px]:grid-cols-2 max-[1250px]:grid-cols-1">
          {filtredOrders.map((order:Order) => (
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
              postalCode={order.postalCode}
              data={formatDateString(order.data)}
              paymentStatus={order.paymentStatus}
              deliveryStatus={order.deliveryStatus}
              url='/admin/Orders/'
            />
          ))}
        </div>
      ): (
        <p className='text-center text-gray-700 font-medium text-[30px] mt-36'>Поки що замовлень немає :(</p>
      )}
    </div>
  )
}

export default Orders