

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'


const loading = () => {
  return (
    <div className="w-full h-full">
      <Skeleton className="w-full h-[240px]"></Skeleton>

      <div className='flex h-full mt-20'>
        <Skeleton className='w-[247px] h-[700px] max-md:hidden' />
        <div className='w-full'>
          <div className='flex w-4/5 max-md:w-full ml-auto justify-between'>
            <Skeleton className='w-3/5 flex mr-5 h-10' />
            <Skeleton className='w-[240px] h-10' />
          </div>

          <div className='grid  auto-cols-max gap-4 mt-8 grid-cols-4 px-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-grid1:grid-cols-1 '>

            <Skeleton className='w-[100%] h-96 rounded-2xl' />
            <Skeleton className='w-[100%] h-96 rounded-2xl' />
            <Skeleton className='w-[100%] h-96 rounded-2xl' />
            <Skeleton className='w-[100%] h-96 rounded-2xl' />
            <Skeleton className='w-[100%] h-96 rounded-2xl' />
            <Skeleton className='w-[100%] h-96 rounded-2xl' />
            <Skeleton className='w-[100%] h-96 rounded-2xl' />
            <Skeleton className='w-[100%] h-96 rounded-2xl' />



          </div>


        </div>
      </div>
    </div>
  )
}

export default loading