'use client'

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, useInView } from "framer-motion"
import Beaker from "../svg/Beaker"
import Image from "next/image"
import Link from "next/link"
import LinkButton from "../interface/LinkButton"

const features = [
  { title: "Якість", description: "Меблі вищого ґатунку для вашого дому" },
  { title: "Дизайн", description: "Сучасні та класичні стилі для будь-якого інтер'єру" },
  { title: "Сервіс", description: "Професійна консультація та швидка доставка" },
]

export default function AboutUs() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const isInView = useInView(cardRef, { once: true, amount: 0.3 });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(cardRef.current !== null){
      const rect = cardRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setCursor({ x: x, y: y })
    }
  }

  return (
    <section className="w-full py-24 bg-white pb-56">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          className="relative overflow-hidden rounded-3xl bg-white shadow-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 z-0">
            <Beaker cursor={cursor} cardRef={cardRef}/>
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-8 md:p-12">
            <div className="space-y-6">
              <motion.h2 
                className="text-heading1-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Про Santehvan
              </motion.h2>
              <motion.p 
                className="text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Ми створюємо меблі, які перетворюють ваш дім на затишний простір для життя та відпочинку. Наша місія - поєднати функціональність, естетику та комфорт у кожному виробі.
              </motion.p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="size-3 min-w-3 rounded-full bg-black" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="w-full flex max-[340px]:justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <LinkButton href="/info/presentations" className="max-[340px]:hidden">Дізнатися більше</LinkButton>
                <Link href="/catalog" className="w-fit text-small-medium drop-shadow-text-blue min-[341px]:hidden">Дізнатися більше</Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}