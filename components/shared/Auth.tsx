'use client'
import Link from "next/link"
import { Button } from "../ui/button"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useState } from "react"
import AdminLink from "./AdminLink"
import Image from "next/image"


const Auth = ({ email, user }: { email: string, user: string}) => {
  const { data:session, status} = useSession();
  const [burger, setBurger] = useState('burger-lines');
  const [bgBurger, setBgBurger] = useState('bg-burger');
  user = JSON.parse(user);

  
    const handleRouteChange= () =>{
      setBurger('burger-lines');
      setBgBurger('bg-burger')
      document.body.style.overflow = 'auto';
    }
  function burgerClass(){
    if(burger === 'burger-lines'){
      setBurger('burger-lines burger-button');
      setBgBurger('bg-burger bg-burger-active')
      document.body.style.overflow = 'hidden';
    }else{
      setBurger('burger-lines');
      setBgBurger('bg-burger')
      document.body.style.overflow = 'auto';
    }
  }
  return (
    <>
      
      {//@ts-ignore 
        status === "authenticated" ? (<Button onClick={signOut} className="h-8 space-x-1 bg-white text-[14px] font-semibold text-black border border-black rounded-full mt-[6px] px-5 transition-colors duration-300 hover:bg-white hover:text-black" size="sm"><Image src="/assets/logout.svg" height={20} width={20} alt="Log-out"/><p>Вийти</p></Button>)
        : (<Link href='/login'>
            <Button className="h-8 space-x-1 bg-white text-[14px] font-semibold text-black border border-black rounded-full mt-[6px] px-5 transition-colors duration-300 hover:bg-white hover:text-black" size="sm"><Image src="/assets/user.svg" height={22} width={22} alt="Log-in"/><p>Увійти</p></Button>
          </Link>
          )}
    </>
  )
}

export default Auth