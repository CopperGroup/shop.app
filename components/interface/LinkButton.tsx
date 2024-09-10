import Link, { LinkProps } from 'next/link';
import React, { ReactNode, useState } from 'react'
import { motion } from "framer-motion";
import { cn } from '@/lib/utils';

interface Props extends LinkProps {
    children: ReactNode;
    href: string;
    className?: string;
    type?: string | "right" | "left"
}

const LinkButton = ({ children, href, className, type, ...props }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href} {...props}>
      <motion.div
        className={cn(`relative w-fit h-fit flex justify-center items-center font-medium gap-2 border border-black rounded-full px-4 py-2 overflow-hidden ${type === "white" ? "border-white bg-white" : "border-black"}`, className)}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <motion.div
          className={`absolute inset-0 bg-black`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ originX: 0 }}
        />
        <motion.p
          className="relative z-10"
          animate={{ 
            color: isHovered ? `#ffffff` : `#000000`,
            transform: isHovered ? "translateX(30px)" : "translateX(0px)" 
          }}
        >
          {children}
        </motion.p>
        <motion.div
          className="relative z-10 flex items-center max-[330px]:hidden"
          initial={false}
          animate={{
            x: isHovered ? "calc(100% + 0.5rem)" : 0,
            opacity: isHovered ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={"#000000"}className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute z-10 left-4 flex items-center"
          initial={{ x: "-calc(100% + 1rem)", opacity: 0 }}
          animate={{
            x: isHovered ? 0 : "-calc(100% + 1rem)",
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3}}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke={"#ffffff"} className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </motion.div>
      </motion.div>
    </Link>
  )
}

export default LinkButton


