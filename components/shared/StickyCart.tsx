'use client'

import Image from "next/image"
import { Button } from "../ui/button"
import { useAppContext } from '@/app/(root)/context'
import { useEffect, useRef } from "react"
import CartPage from "./CartPage"

const StickyCart = () => {
  
  
  
  const { cartData} = useAppContext();

  const cartRef = useRef(null);

  
  function showCart(){
   
    //@ts-ignore
    cartRef.current.style.right = "0";
    document.body.style.overflow = "hidden";
  }

  return (
    <>
    <div className="fixed bottom-8 right-8 z-[100] max-sm:bottom-4 max-sm:right-4">
        <Button onClick={showCart} className="size-16 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-white hover:bg-white hover:border-black hover:size-[4.2rem] transition-all max-sm:size-14">
            <div className="bg-black rounded-full absolute top-[-5px] right-2 w-6">{cartData.length>0?cartData.length:''}</div>
            <Image src="/assets/cart.svg" width={32} height={32} alt="cart-icon" className="drop-shadow-text-blue"/>
        </Button>
    </div>

    <div ref={cartRef} className="fixed duration-700 transition-all h-full right-[-100%] bg-white max-w-[400px] w-full  mx-auto z-50 rounded-sm  top-0 border-l-2 border-l-gray-700">
      <CartPage cartRef={cartRef}/>
    </div>
    
    </>
  )
}

export default StickyCart;