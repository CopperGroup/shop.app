'use client'

import Image from "next/image"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Facebook, Instagram, Linkedin } from "lucide-react"
import { useRef } from "react"

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <footer ref={ref} className="bg-gradient-to-b from-dark-4 to-black text-white z-40 pt-16 pb-8 w-full min-w-[320px]">
      <motion.div
        className="max-w-screen-2xl mx-auto px-4 lg:px-8 w-full"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-lg font-semibold mb-4">Фіз. особам</h3>
            <ul className="space-y-2">
              <li><Link href='info/contacts' className="hover:text-blue-400 transition-colors">Контакти</Link></li>
              <li><Link href='info/delivery-payment' className="hover:text-blue-400 transition-colors">Доставка та оплата</Link></li>
              <li><Link href='info/warranty-services' className="hover:text-blue-400 transition-colors">Гарантія та сервіс</Link></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-lg font-semibold mb-4">Дизайн</h3>
            <ul className="space-y-2">
              <li><Link href='/presentations' className="hover:text-blue-400 transition-colors">Презентації</Link></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-lg font-semibold mb-4">Каталоги</h3>
            <ul className="space-y-2">
              <li><Link href='/catalog?category=Меблі_для_ванної_кімнати' className="hover:text-blue-400 transition-colors">Меблі для ванної</Link></li>
              <li><Link href='/catalog?category=Житлові_меблі' className="hover:text-blue-400 transition-colors">Житлові меблі</Link></li>
              <li><Link href='/catalog?category=Дитячі_меблі' className="hover:text-blue-400 transition-colors">Дитячі меблі</Link></li>
            </ul>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <h3 className="text-lg font-semibold mb-4">Контакти</h3>
            <p className="mb-2">Телефон: (066) 017-81-70, (068) 842-81-98</p>
            <p className="mb-4">Email: santehvan@gmail.com</p>
            <h4 className="text-lg font-semibold mb-2">Ми в соцмережах</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-400 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-white hover:text-pink-400 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-white hover:text-blue-600 transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="border-t border-gray-700 pt-8 mt-8 w-full"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 lg:mb-0 text-center lg:text-left">
              © {currentYear} Меблі для ванної інтернет магазин <span className="font-semibold">SANTEHVAN</span>. Всі права захищені.
            </p>
            <div className="flex flex-col items-center lg:items-end space-y-2 lg:space-y-0">
              <span className="text-sm text-gray-400 text-center lg:text-right">Представник українських виробників меблів для ванної:</span>
              <div className="flex space-x-2 mt-2 lg:mt-1">
                <Image className="h-6 w-auto" width={88} height={18} src='/assets/botticelli.png' alt='Botticelli logo' />
                <Image className="h-6 w-auto" width={55} height={18} src='/assets/juventa.png' alt='Juventa logo' />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}

export default Footer