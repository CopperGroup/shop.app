"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function ClearFilterButton() {
  const [isClicked, setIsClicked] = useState(false)

  const router = useRouter();

  const handleClear = () => {
    setIsClicked(true);

    setTimeout(() => router.push('/catalog?page=1&sort=default'), 200)
  }

  return (
    <motion.button
      className="w-full relative overflow-hidden bg-white text-gray-800 font-semibold py-2 px-4 rounded-full border border-gray-300 shadow-sm"
      whileHover="hover"
      whileTap="tap"
      onClick={handleClear}
      onAnimationComplete={() => setIsClicked(false)}
      initial="initial"
    >
      <motion.div
        className="absolute inset-0 bg-gray-100"
        initial={{ opacity: 0 }}
        variants={{
          hover: { opacity: 1 },
          tap: { opacity: 1, scale: 0.98 },
        }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
      />
      
      <motion.div 
        className="relative flex items-center space-x-2"
        variants={{
          initial: { color: "#1f2937" },
          hover: { color: "#111827" },
          tap: { scale: 0.95 },
        }}
      >
        <X className="w-4 h-4" />
        <span>Clear Filters</span>
      </motion.div>

      <motion.div
        className="absolute inset-0 border border-transparent rounded-full"
        initial={{ opacity: 0 }}
        variants={{
          hover: { 
            opacity: 1,
            scale: 1.05,
            transition: { duration: 0.2 }
          },
          tap: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.1 }
          }
        }}
        style={{ boxShadow: "0 0 8px rgba(59, 130, 246, 0.3)" }}
      />

      {isClicked && (
        <motion.div
          className="absolute inset-0 bg-blue-50"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}
    </motion.button>
  )
}

