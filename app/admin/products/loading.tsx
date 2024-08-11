
import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'


const loading = () => {
  return (
    <section className="px-10 py-20 w-full"> 
    <h1 className="w-full text-heading1-bold drop-shadow-text-blue max-[440px]:text-center">Товар</h1>
    <div className="w-full h-[2px] bg-gray-400 mt-20 rounded-lg"></div>
    
    <div className='flex justify-between my-5 gap-5'>
    <Skeleton className='w-full h-10'/>
    <Skeleton className='w-[150px] h-10'/>
    </div>

    <Skeleton className='w-full h-[591px]'/>


  </section>
  )
}

export default loading