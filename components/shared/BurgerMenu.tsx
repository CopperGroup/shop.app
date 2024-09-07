'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Transition } from '@headlessui/react'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { TransitionLink } from "../interface/TransitionLink"
import AdminLink from "./AdminLink"
import Auth from "./Auth"

export default function BurgerMenu({ email, user }: { email: string; user: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const userInfo = JSON.parse(user)

  const Links = [
    { label: "Головна", href: "/" },
    { label: "Каталог", href: "/catalog" },
    { label: "Уподобані", href: `/liked/${userInfo?._id}` },
    { label: "Мої замовлення", href: "/myOrders" },
    { label: "Контакти", href: "/info/contacts"},
    { label: "Доставка та оплата", href: "/info/delivery-payment"},
    { label: "Гарантія та сервіси", href: "/info/warranty-services"},
    { label: "Презентації", href: "/info/presentations"}
  ]

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white focus:outline-none relative w-6 h-6 z-50"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-500 ease-in-out ${isOpen ? 'rotate-45' : '-translate-y-2'}`} />
        <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-500 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
        <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-500 ease-in-out ${isOpen ? '-rotate-45' : 'translate-y-2'}`} />
      </button>

      <Transition
        show={isOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 -translate-y-full"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 -translate-y-full"
      >
        <div className="fixed inset-x-0 top-20 bottom-0 bg-black z-40">
          <div className="h-full overflow-y-auto py-6 px-4 flex flex-col items-center">
            <nav className="flex flex-col items-center space-y-4 w-full">
              <AdminLink className="pt-2 hover:bg-transparent hover:text-red-500" linkDecoration="text-base-regular"/>
              {Links.map(({ label, href }) => {
                const isActive = (pathname.includes(href) && href.length > 1) || pathname === href

                if (["Уподобані", "Мої замовлення"].includes(label) && !email) {
                  return null
                }

                if (label === "Інформація") {
                  return (
                    <Menubar key={label} className="border-0 p-0 w-full">
                      <MenubarMenu>
                        <MenubarTrigger className="w-full flex justify-center items-center text-neutral-400 hover:text-white focus:text-white">
                          <span className={`text-center ${isActive ? "text-white" : ""}`}>{label}</span>
                        </MenubarTrigger>
                        <MenubarContent className="bg-[#1f1f1f] text-neutral-400 border-0 rounded-2xl">
                          <MenubarItem>
                            <TransitionLink href="/info/contacts" className="block py-2 w-full text-center">Контакти</TransitionLink>
                          </MenubarItem>
                          <MenubarItem>
                            <TransitionLink href="/info/delivery-payment" className="block py-2 w-full text-center">Доставка та оплата</TransitionLink>
                          </MenubarItem>
                          <MenubarItem>
                            <TransitionLink href="/info/warranty-services" className="block py-2 w-full text-center">Гарантія та сервіси</TransitionLink>
                          </MenubarItem>
                          <MenubarItem>
                            <TransitionLink href="/info/presentations" className="block py-2 w-full text-center">Презентації</TransitionLink>
                          </MenubarItem>
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  )
                }

                return (
                  <TransitionLink
                    key={label}
                    href={href}
                    className={`text-neutral-400 ${isActive ? "text-white" : ""} w-full text-center`}
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </TransitionLink>
                )
              })}
            </nav>
            <div className="mt-6 w-full flex justify-center items-center">
              <div className="inline-block">
                <Auth email={email} user={user}/>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}