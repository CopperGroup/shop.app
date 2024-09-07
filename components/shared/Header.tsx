"use client";

import Link from "next/link";
import Auth from "./Auth";
import Image from "next/image";
import AdminLink from "./AdminLink";
import { TransitionLink } from "../interface/TransitionLink";
import Logo from "../svg/Logo";
import { usePathname } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import BurgerMenu from "./BurgerMenu";


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
      href: `/liked/${userInfo?._id}`
    }, 
    {
      label: "Мої замовлення",
      href: "/myOrders"
    },
    {
      label: "Інформація",
      href: "/info"
    }
  ]

  console.log(email);
  
  return (
    <header className="w-full h-20 flex justify-center items-center">
      <div className="w-full max-w-[1680px] h-full flex justify-between items-center bg-black rounded-b-full px-12 max-lg:rounded-none max-[600px]:px-9 max-[500px]:px-7">
        <div className="size-5 hidden max-lg:flex"></div>
        <Link href="/" className="w-fit flex gap-2 justify-center items-center">
          <Logo/>
          <p className="text-base-semibold text-white">SANTEHVAN</p>
        </Link>
        <nav className="w-fit h-11 flex gap-1 justify-center items-center rounded-full bg-[#1f1f1f] px-2 max-lg:hidden">
          <AdminLink></AdminLink>
          {Links.map(({ label, href }) => { 
            const isActive = (pathname.includes(href) && href.length > 1) || pathname === href;

            return (
              <>
                {["Уподобані", "Мої замовлення"].includes(label) ? email && (
                  <div  key={label} className={`w-fit h-8 text-neutral-400  flex justify-center items-center border-neutral-400 rounded-full px-[0.885rem] ${isActive && "bg-glass text-white border"}`}>
                    <TransitionLink href={href} className={`text-small-medium font-normal hover:text-white transition-all ${isActive && "text-white"}`}>{label}</TransitionLink>
                  </div>
                ): label === "Інформація" ? (
                  <Menubar className="h-8 border-0 p-0 space-x-0">
                    <MenubarMenu>
                      <MenubarTrigger className={`w-fit h-8 text-neutral-400  flex justify-center items-center border-neutral-400 rounded-full cursor-pointer px-[0.885rem] ${isActive && "bg-glass text-white border"}`}><p className={`text-small-medium font-normal hover:text-white transition-all ${isActive && "text-white"}`}>{label}</p></MenubarTrigger>
                      <MenubarContent className="min-w-[9rem] bg-[#1f1f1f] text-neutral-400 border-0 rounded-2xl">
                        <MenubarItem className="text-small-medium font-normal cursor-pointer hover:text-white transition-all">
                          <TransitionLink href="/info/contacts">Контакти</TransitionLink>
                        </MenubarItem>
                        <MenubarItem className="text-small-medium font-normal cursor-pointer hover:text-white transition-all">
                          <TransitionLink href="/info/delivery-payment">Доставка та оплата</TransitionLink>
                        </MenubarItem>
                        <MenubarItem className="text-small-medium font-normal cursor-pointer hover:text-white transition-all">
                          <TransitionLink href="/info/warranty-services">Гарантія та сервіси</TransitionLink>
                        </MenubarItem>
                        <MenubarItem className="text-small-medium font-normal cursor-pointer hover:text-white transition-all">
                          <TransitionLink href="/info/presentations">Презентації</TransitionLink>
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                ) : (
                  <div  key={label} className={`w-fit h-8 text-neutral-400  flex justify-center items-center border-neutral-400 rounded-full px-[0.885rem] ${isActive && "bg-glass text-white border"}`}>
                    <TransitionLink href={href} className={`text-small-medium font-normal hover:text-white transition-all ${isActive && "text-white"}`}>{label}</TransitionLink>
                  </div>
                )
                }
              </>
          )})}
          {/* <AdminLink></AdminLink> */}
          {/* <TransitionLink href='/catalog' className="Underline">Каталог</TransitionLink> */}
          {/* {email && <TransitionLink href={`/liked/${user?._id}`} className="Underline">Уподобані</TransitionLink>}
          {email &&<TransitionLink href='/myOrders' className="Underline">Мої замовлення</TransitionLink>} */}
          {/* <InfoLinks /> */}
        </nav>
        <div className="w-fit flex justify-center items-center max-lg:hidden">
          <Auth email={email} user={user}></Auth>
        </div>
        <div className="w-fit h-8 hidden mt-1 max-lg:flex">
          <BurgerMenu email={email} user={user}/>
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