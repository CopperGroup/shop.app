'use client'


import React from 'react'

import { useParams, useSearchParams } from 'next/navigation';
import ProdactPage from '@/components/shared/ProdactPage';
import { motion } from "framer-motion";
import Product from '@/lib/models/product.model'
import { Divide } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import EmblaCarousel from '../ui/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel'

const Prodact =  (images:any) => {
  
  const OPTIONS: EmblaOptionsType = {}
  const SLIDE_COUNT = images.images.length
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
  const Images = images.images 


  

  
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <EmblaCarousel images={images.images} slides={SLIDES} options={OPTIONS} />
    </motion.div>
  )
}

export default Prodact