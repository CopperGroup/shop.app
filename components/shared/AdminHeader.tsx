"use client"

import { Store } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

export default function AdminHeader() {
  const handleVisitStore = () => {
    // In a real application, this would navigate to the store page
    //console.log("Navigating to store...")
  }

  return (
    <header className="w-full p-4 bg-white text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.h1 
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Hello, Admin! 👋
        </motion.h1>
        <div className="flex items-center">
          <Button 
            onClick={handleVisitStore}
            className="flex items-center space-x-2"
          >
            <Store className="h-5 w-5" />
            <span>Visit Store</span>
          </Button>
        </div>
      </div>
    </header>
  )
}