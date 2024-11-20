"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Construction, Hammer, Axe } from 'lucide-react'
import { cn } from "@/lib/utils"

interface InDevelopmentProps {
  children: React.ReactNode
  className?: string
}

const DustParticle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute bg-gray-300 rounded-full"
    style={{
      width: Math.random() * 4 + 1,
      height: Math.random() * 4 + 1,
    }}
    animate={{
      y: [0, -20],
      x: [0, Math.random() * 20 - 10],
      opacity: [0, 1, 0],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay: delay,
    }}
  />
)

export function InDevelopment({ children, className }: InDevelopmentProps) {
  return (
    <div className={cn("relative group", className)}>
      <motion.div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          <motion.div
            className="relative w-32 h-32 mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute top-0 left-0"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Construction className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.div
              className="absolute top-0 right-0"
              animate={{ rotate: [0, -45, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
              <Hammer className="w-10 h-10 text-primary" />
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0"
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <Axe className="w-10 h-10 text-primary" />
            </motion.div>
            {[...Array(10)].map((_, i) => (
              <DustParticle key={i} delay={i * 0.2} />
            ))}
          </motion.div>
          <p className="text-base-semibold text-primary mt-5">In development</p>
        </div>
      </motion.div>
      <motion.div
        className="filter blur-[2px] p-3"
        whileHover={{ filter: "blur(4px)" }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  )
}