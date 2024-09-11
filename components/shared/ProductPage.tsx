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
    <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            <Button className="inline-flex items-center font-normal text-sky-600 hover:text-sky-800 mb-6" variant="destructive" onClick={() => router.back()}>
                <ArrowLeft className="mr-2" size={20} />
                Назад до каталогу
            </Button>
        </motion.div>
      
      <div className="grid md:grid-cols-2 gap-12">
        <ProdactPage images={product.images} />
        
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold">{product.name}</h1>
          
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-bold text-blue-600">₴{product.priceToShow}</span>
            <span className="text-xl text-gray-500 line-through">₴{product.price}</span>
            <Badge variant="destructive">Sale</Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <CreditCard className="mr-2" size={20} />
              <span>Оплата: готівка / безготівковий розрахунок</span>
            </div>
            <div className="flex items-center">
              <Shield className="mr-2" size={20} />
              <span>Гарантія: {product.params.find((param: { name: string, value: string }) => param.name === "Гарантія")?.value}</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-3">Колір</h2>
            <div className="flex space-x-4">
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
                            className="rounded-full border-2 border-gray-300 hover:border-blue-500 cursor-pointer"
                        />
                    </TransitionLink>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <AddToCart id={product._id} name={product.name} image={product.images[0]} price={product.price} priceWithoutDiscount={product.priceToShow} variant="full"/>
            <Button className="py-5" variant="outline">Купити зараз</Button>
          </div>
        </motion.div>
      </div>
      
      <Separator className="my-12" />
      
      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Опис</h2>
          <p className="text-gray-700 leading-relaxed">{product.description.replace(/[^а-щьюяґєіїА-ЩЬЮЯҐЄІЇ0-9. ]/g, '')}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Параметри</h2>
          <table className="w-full">
            <tbody>
              {product.params.map((param: { name: string, value: string }) => (
                <tr key={param.name} className="border-b">
                  <td className="py-2 font-medium">{param.name}</td>
                  <td className="py-2 text-gray-700">{param.value.replaceAll("_", " ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  )
}