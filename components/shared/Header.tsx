"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Auth from "./Auth";
import AdminLink from "./AdminLink";
import { TransitionLink } from "../interface/TransitionLink";
import Logo from "../svg/Logo";
import { usePathname } from "next/navigation";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import BurgerMenu from "./BurgerMenu";

const Links = [
  { label: "Головна", href: "/" },
  { label: "Каталог", href: "/catalog" },
  { label: "Уподобані", href: "/liked" },
  { label: "Мої замовлення", href: "/myOrders" },
  { label: "Інформація", href: "/info" },
];

export default function Header({ email, user }: { email: string; user: string }) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const isInView = useInView(headerRef, { once: true });
  
  const userInfo = JSON.parse(user);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const linkVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.header
      ref={headerRef}
      className="w-full h-20 flex justify-center items-center"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={headerVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-[1680px] h-full flex justify-between items-center bg-black rounded-b-full px-12 max-lg:rounded-none max-[600px]:px-9 max-[500px]:px-7">
        <div className="size-5 hidden max-lg:flex"></div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link href="/" className="w-fit flex gap-2 justify-center items-center">
            <Logo />
            <p className="text-base-semibold text-white">SANTEHVAN</p>
          </Link>
        </motion.div>
        <nav className="w-fit h-11 flex gap-1 justify-center items-center rounded-full bg-[#1f1f1f] px-2 max-lg:hidden">
          <AdminLink />
          {Links.map(({ label, href }, index) => {
            const isActive = (pathname.includes(href) && href.length > 1) || pathname === href;

            return (
              <motion.div
                key={label}
                variants={linkVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              >
                {["Уподобані", "Мої замовлення"].includes(label) ? (
                  email && (
                    <div className={`w-fit h-8 text-neutral-400 flex justify-center items-center border-neutral-400 rounded-full px-[0.885rem] ${isActive && "bg-glass text-white border"}`}>
                      <TransitionLink href={`${href}/${userInfo?._id}`} className={`text-small-medium font-normal hover:text-white transition-all ${isActive && "text-white"}`}>
                        {label}
                      </TransitionLink>
                    </div>
                  )
                ) : label === "Інформація" ? (
                  <Menubar className="h-8 border-0 p-0 space-x-0">
                    <MenubarMenu>
                      <MenubarTrigger className={`w-fit h-8 text-neutral-400 flex justify-center items-center border-neutral-400 rounded-full cursor-pointer px-[0.885rem] ${isActive && "bg-glass text-white border"}`}>
                        <p className={`text-small-medium font-normal hover:text-white transition-all ${isActive && "text-white"}`}>{label}</p>
                      </MenubarTrigger>
                      <MenubarContent className="min-w-[9rem] bg-[#1f1f1f] text-neutral-400 border-0 rounded-2xl">
                        {["contacts", "delivery-payment", "warranty-services", "presentations"].map((subItem) => (
                          <MenubarItem key={subItem} className="text-small-medium font-normal cursor-pointer hover:text-white transition-all">
                            <TransitionLink href={`/info/${subItem}`}>
                              {subItem.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </TransitionLink>
                          </MenubarItem>
                        ))}
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                ) : (
                  <div className={`w-fit h-8 text-neutral-400 flex justify-center items-center border-neutral-400 rounded-full px-[0.885rem] ${isActive && "bg-glass text-white border"}`}>
                    <TransitionLink href={href} className={`text-small-medium font-normal hover:text-white transition-all ${isActive && "text-white"}`}>
                      {label}
                    </TransitionLink>
                  </div>
                )}
              </motion.div>
            );
          })}
        </nav>
        <motion.div
          className="w-fit flex justify-center items-center max-lg:hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Auth email={email} user={user} />
        </motion.div>
        <motion.div
          className="w-fit h-8 hidden mt-1 max-lg:flex"
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <BurgerMenu email={email} user={user} />
        </motion.div>
      </div>
    </motion.header>
  );
}