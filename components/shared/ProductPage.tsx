'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, Shield, CreditCard, ArrowLeft } from 'lucide-react'
import ProdactPage from '@/components/shared/ProdactPage'
import { useRouter } from 'next/navigation'
import { TransitionLink } from '../interface/TransitionLink'
import AddToCart from './AddToCart'

export default function ProductPage({ productJson, colorsJson }: { productJson: string, colorsJson: string }) {
    const product = JSON.parse(productJson);
    const colors = JSON.parse(colorsJson);
    const router = useRouter();

  return (
    <div className="px-2 sm:px-4 py-4 sm:py-8 max-w-full overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            <Button className="inline-flex items-center font-normal text-sky-600 hover:text-sky-800 max-lg:-ml-3 mb-2 sm:mb-4 text-sm sm:text-base" variant="destructive" onClick={() => router.back()}>
                <ArrowLeft className="mr-1 sm:mr-2" size={16} />
                Назад до каталогу
            </Button>
        </motion.div>
      
      <div className="grid lg:grid-cols-2 gap-6 sm:gap-12">
        <div className="max-lg:hidden">
          <ProdactPage images={product.images} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 sm:space-y-6 sm:mt-12"
        >
          <h1 className="text-heading1-bold sm:text-[42px] leading-tight sm:leading-[58px] font-bold">{product.name}</h1>
          
          <div className="lg:hidden">
            <ProdactPage images={product.images} />
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-wrap">
            <span className="text-xl sm:text-3xl font-bold text-blue-600">₴{product.priceToShow}</span>
            <span className="text-lg sm:text-xl text-gray-500 line-through">₴{product.price}</span>
            <Badge variant="destructive">Sale</Badge>
          </div>
          
          <div className="space-y-2 text-sm sm:text-base">
            <div className="flex items-center">
              <CreditCard className="mr-2 flex-shrink-0" size={16} />
              <span>Оплата: готівка / безготівковий розрахунок</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-2 flex-shrink-0" size={16} />
              <span>Гарантія: {product.params.find((param: { name: string, value: string }) => param.name === "Гарантія")?.value}</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Колір</h2>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {colors.map((color: { images: string[], params: {name: string, value: string}[] }, index: number) => (
                <motion.div
                  key={color.params[0].value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                    <TransitionLink href={color.params[0].value} className="w-full h-fit flex justify-center items-center">
                        <Image
                            src={color.images[0]}
                            width={60}
                            height={60}
                            alt={`Color ${color.params[0].value}`}
                            className="rounded-full border-2 border-gray-300 hover:border-blue-500 cursor-pointer max-[425px]:size-12 max-[380px]:size-10"
                        />
                    </TransitionLink>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <AddToCart id={product._id} name={product.name} image={product.images[0]} price={product.price} priceWithoutDiscount={product.priceToShow} variant="full"/>
            <Button className="py-3 sm:py-5 text-sm sm:text-base max-[425px]:w-full" variant="outline">Купити зараз</Button>
          </div>
        </motion.div>
      </div>
      
      <Separator className="my-6 sm:my-12" />
      
      <div className="grid md:grid-cols-2 gap-6 sm:gap-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Опис</h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4">Параметри</h2>
          <table className="w-full text-sm sm:text-base">
            <tbody>
              {product.params.map((param: { name: string, value: string }) => (
                <tr key={param.name} className="border-b">
                  <td className="py-1 sm:py-2 font-medium">{param.name}</td>
                  <td className="py-1 sm:py-2 text-gray-700">{param.value.replaceAll("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  )
}