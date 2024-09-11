'use client'

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"

interface DividerProps {
  iconUrl: string
  width: number
  height: number
  mt: number
  mb: number
  type: "default" | "icon-only"
}

export default function Divider({ iconUrl, width, height, mt, mb, type }: DividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(dividerRef, { once: true, amount: 0.5 })

  const dividerVariants = {
    hidden: { opacity: 0, scaleX: 0 },
    visible: { opacity: 1, scaleX: 1 }
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 }
  }

  return (
    <motion.div
      ref={dividerRef}
      className={`mt-${mt} mb-${mb} ${type === "default" ? 'w-full h-0.5 bg-black' : 'flex justify-center'}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.5 }}
      variants={type === "default" ? dividerVariants : {}}
    >
      {type === "icon-only" && (
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ duration: 0.5, delay: 0.2 }}
          variants={iconVariants}
        >
          <Image src={iconUrl} width={width} height={height} alt="dividing icon" />
        </motion.div>
      )}
    </motion.div>
  )
}