'use client'

import React, { useRef, useState } from 'react';
import { useAppContext } from '@/app/(root)/context';
import Image from 'next/image';
import { Button } from '../ui/button';
import { useEffect } from 'react';
import Link from 'next/link';
import { ProductType } from '@/lib/types/types';
import ReactPixel from "react-facebook-pixel";
import { trackFacebookEvent } from '@/helpers/pixel';


const CartPage = ({setIsOpened }: {setIsOpened: (value: boolean) => void }) => {
//@ts-ignore
const {cartData, setCartData, priceToPay, setPriceToPay} = useAppContext();

function hideCart(){
    //@ts-ignore
    setIsOpened(false);
  }

let together = 0

const [toPay, setToPay] = useState(0);

useEffect(()=>{
 
    cartData.map((data:any)=>{
        together = together + (data.price * data.quantity)
    })
    setToPay(together);
    setPriceToPay(together.toFixed(2))
},[cartData])



function removeProduct(index:number){

    cartData.splice(index, 1);
    setCartData((prev:any)=>[...prev], cartData); 
}

function setCount(index: number, value: any) {
    value = Number(value);
    if (Number.isInteger(value)) { // Перевірка чи є цілим числом
      cartData[index].quantity = value;
      setCartData((prev: any) => [...prev], cartData);
    }else {
      // Якщо value не є цілим числом, присвоюємо йому значення 1
      
      cartData[index].quantity = 1;
      setCartData((prev: any) => [...prev], cartData);
    }

  }

function plus(index:number){
    if(cartData[index].quantity < 999){
        cartData[index].quantity ++;
        setCartData((prev: any) => [...prev], cartData);
    }
  }

function minus(index:number){
    if(cartData[index].quantity > 1){
        cartData[index].quantity--;
        setCartData((prev: any) => [...prev], cartData);
    }
  }


  function delProduct(index: number, value: any){
    value = Number(value);
    if(value<1){
        removeProduct(index);
   }
  }

  const handleCheckout = () => {
    hideCart();

    console.log(cartData);

    trackFacebookEvent('InitiateCheckout', {
      content_name: 'Cart Checkout',
      content_ids: cartData.map((product: ProductType) => product.id),
      value: priceToPay,
      currency: 'UAH',
      num_items: cartData.length,
    });
  }

  return (   
        < >
            <h2 className='text-[35px] m-10 font-medium'>Кошик</h2>
            <div className='w-full flex flex-col items-center gap-7 overflow-auto h-2/3 pb-20'>
              {cartData.map((data:any,index:number)=>(
                <article key={index} className="w-10/12 h-fit flex flex-col items-center">
                  <div className="w-full h-32 flex">
                    <div className="w-1/3 h-full flex justify-center items-center ">
                      <Image width={500} height={100} alt='' className='w-[100px] h-[100px]' src={data.image}  />
                    </div>
                    <div className="w-2/3 h-full px-2 py-3">
                      <div className="w-full h-fit flex">
                        <p className='text-[16px] mb-5 font-medium w-[180px]'>{data.name}</p>
                        <Image onClick={()=>removeProduct(index)} className='w-fit h-full ml-auto cursor-pointer' width={22} height={22} alt='' src='/assets/delete.svg'/>
                      </div>
                      <div className="w-full h-7 flex">
                        <div className='w-1/2 h-full flex gap-1 items-center'>
                          <Button onClick={()=>minus(index)} variant="ghost" className='w-5 h-5'>-</Button>
                          <input className='w-5 h-5 rounded-md shadow-2xl resize-none text-center pt-1 focus:outline-0'  value={data.quantity} 
                            onChange={(e)=>setCount(index,e.target.value)} 
                            onBlur={(e)=>delProduct(index,e.target.value)} 
                            maxLength={3}>
                          </input>
                          <Button onClick={()=>plus(index)} variant="ghost" className='w-5 h-5'>+</Button>
                        </div>
                        <div className="w-1/2 h-full flex flex-col items-end justify-end">
                          <p className="text-small-medium text-gray-700 line-through decoration-red-500 mr-3">₴{data.priceWithoutDiscount}</p>
                          <p className="w-full text-black h-full font-semibold text-end px-2">₴{data.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-[2px] rounded-full bg-neutral-500/30"></div>
                </article>
              ))}
            </div>

            <div className='w-full flex bg-neutral-100 rounded-2xl right-0 flex-col absolute bottom-0 pt-4 my-3 px-10'>
              <div className='text-body-semibold text-center border-black pb-5 text-nowrap'>Разом: <span className="font-medium">{toPay.toFixed(2)}грн.</span></div>
              <Button onClick={hideCart} variant='outline' className='mb-5'>Повернутись до кокупок</Button>
              <Link href="/order" className='w-full' ><Button onClick={handleCheckout} disabled={cartData.lenght == 0} className="w-full h-full">Замовити</Button></Link>
            </div>
        </>
 
  )
}

export default CartPage