'use client'

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const categories = [
  { name: "Меблі для ванної", image: "/tymba.png", href: "/catalog?category=Меблі_для_ванної_кімнати" },
  { name: "Житлові меблі", image: "/komod.png", href: "/catalog?category=Житлові_меблі" },
  { name: "Дитячі меблі", image: "/krovatka.png", href: "/catalog?category=Дитячі_меблі" },
]

export default function Categories() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })

  return (
    <motion.section 
      ref={sectionRef}
      className="w-full pt-10 pb-7"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full flex justify-center items-center">
        <div className="w-full max-w-[1680px] px-12 max-lg:px-9 max-[500px]:px-7">
          <motion.h2 
            className="text-heading1-bold text-black mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Категорії товару
          </motion.h2>
          <motion.p 
            className="text-body-medium text-light-4 mb-16 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Знайдіть ідеальні рішення для вашого дому серед наших категорій
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Link href={category.href} className="group perspective block">
                  <div className="relative w-full h-[400px] rounded-3xl overflow-hidden transform transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:rotate-y-12 shadow-lg max-[425px]:h-[300px] max-[380px]:h-[250px]">
                    <Image
                      src={category.image}
                      alt={category.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-1 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                      <h3 className="text-heading3-bold text-light-1 text-center mb-2 transform transition-transform duration-300 group-hover:translate-y-[-10px]">{category.name}</h3>
                      <span className="text-base-medium text-light-2 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">Переглянути</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <motion.div 
        className="w-full flex justify-end pt-7 px-14 max-[425px]:justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Link href="/catalog" className="text-small-medium drop-shadow-text-blue">Переглянути всі</Link>
      </motion.div>
    </motion.section>
  )
}