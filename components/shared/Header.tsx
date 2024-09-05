"use client";

import Link from "next/link"
import Auth from "./Auth"
import Image from "next/image"
import AdminLink from "./AdminLink"
import { fetchUserByEmail } from "@/lib/actions/user.actions"
import  {InfoLinks}  from "./InfoLinks"
import { TransitionLink } from "../interface/TransitionLink"
import Logo from "../svg/Logo"
import { usePathname } from "next/navigation"


const Header = ({ email, user }: { email: string, user: string }) => {
  
  const pathname = usePathname();
  
  const userInfo = JSON.parse(user);

  const Links = [
    {
      label: "Головна",
      href: "/"
    }, 
    {
      label: "Каталог",
      href: "/catalog"
    }, 
    {
      label: "Уподобані",
      href: `/liked/${userInfo._id}`
    }, 
    {
      label: "Мої замовлення",
      href: "/myOrders"
    }
  ]

  console.log(email);
  
  return (
    <header className="absolute w-full h-20 flex justify-center items-center z-20">
      <div className="w-full max-w-[1680px] h-full flex justify-between items-center bg-black rounded-b-full px-12">
        <div className="w-fit flex gap-2 justify-center items-center">
          <Logo/>
          <p className="text-base-semibold text-white">SANTEHVAN</p>
        </div>
        <nav className="w-fit h-11 flex gap-1 justify-center items-center rounded-full bg-[#1f1f1f] px-2">
          <AdminLink></AdminLink>
          {Links.map(({ label, href }) => { 
            const isActive = (pathname.includes(href) && href.length > 1) || pathname === href;

            return (
              <div className={`w-fit h-8 text-neutral-400  flex justify-center items-center border-neutral-400 rounded-full px-[0.885rem] ${isActive && "bg-glass text-white border"}`}>
                {["Уподобані", "Мої замовлення"].includes(label) ? email && (
                  <TransitionLink key={label} href={href} className={`text-small-medium font-normal hover:text-white transition-all ${isActive && "text-white"}`}>{label}</TransitionLink>
                ): (
                  <TransitionLink key={label} href={href} className={`text-small-medium font-normal hover:text-white transition-all ${isActive && "text-white"}`}>{label}</TransitionLink>
                )
                }
              </div>
          )})}
          {/* <AdminLink></AdminLink> */}
          {/* <TransitionLink href='/catalog' className="Underline">Каталог</TransitionLink> */}
          {/* {email && <TransitionLink href={`/liked/${user?._id}`} className="Underline">Уподобані</TransitionLink>}
          {email &&<TransitionLink href='/myOrders' className="Underline">Мої замовлення</TransitionLink>} */}
          {/* <InfoLinks /> */}
        </nav>
        <div>
          <Auth email={email} user={JSON.stringify(user)}></Auth>
        </div>
      </div>
      {/* <p className="font-bold text-[18px]">SANTEHVAN</p> */}
      {/* <div className="flex gap-10">
      <nav className="items-center gap-10 hidden lg:flex">
          <AdminLink></AdminLink>
          <TransitionLink href='/' className="Underline">Головна</TransitionLink>
          <TransitionLink href='/catalog' className="Underline">Каталог</TransitionLink>
          {email && <TransitionLink href={`/liked/${user?._id}`} className="Underline">Уподобані</TransitionLink>}
          {email &&<TransitionLink href='/myOrders' className="Underline">Мої замовлення</TransitionLink>}
          <InfoLinks />
      </nav>
      <div className="flex items-center gap-5">
        <Auth email={email} user={JSON.stringify(user)}></Auth>
      </div>
      </div> */}
    </header>
  )
} 

export default Header;