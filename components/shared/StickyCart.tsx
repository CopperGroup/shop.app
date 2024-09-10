'use client'

import Image from "next/image"
import { Button } from "../ui/button"
import { useAppContext } from '@/app/(root)/context'
import { useEffect, useRef, useState } from "react"
import CartPage from "./CartPage"

const StickyCart = () => {
  const [ isOpened, setIsOpened ] = useState(false);
  const { cartData} = useAppContext();
  const cartRef = useRef<HTMLDivElement>(null);
  const cartButtonRef = useRef<HTMLDivElement>(null);

  function showCart(){
    setIsOpened(!isOpened);

    if(cartRef.current) {
      cartRef.current.style.right = "0";
      document.body.style.overflow = "hidden";
    }
  }

  useEffect(() => {
    if(cartButtonRef.current) {
      if(isOpened) {
        cartButtonRef.current.style.display = "none";
      }

      if(!isOpened) {
        cartButtonRef.current.style.display = "block";
      }
    }
  }, [isOpened])

  return (
    <>
    <div ref={cartButtonRef} className="fixed bottom-8 right-8 z-[100] max-sm:bottom-4 max-sm:right-4 transition-all">
        <Button onClick={showCart} className="size-16 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-white hover:bg-white hover:border-black hover:size-[4.2rem] transition-all max-sm:size-14">
            <div className="bg-black rounded-full absolute top-[-5px] right-2 w-6">{cartData.length>0?cartData.length:''}</div>
            <Image src="/assets/cart.svg" width={32} height={32} alt="cart-icon" className="drop-shadow-text-blue"/>
        </Button>
    </div>

    <div ref={cartRef} className="fixed duration-700 transition-all h-full right-[-100%] bg-gradient-to-r from-gray-50 to-white max-w-[400px] w-full  mx-auto z-50 rounded-sm  top-0 shadow-2xl">
      <CartPage cartRef={cartRef} setIsOpened={setIsOpened}/>
    </div>
    
    </>
  )
}

export default StickyCart;