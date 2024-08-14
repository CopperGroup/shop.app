import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
  return (
    <main className="w-full h-screen flex flex-1">
        <div className="w-2/5 max-w-[40rem] h-full flex flex-col justify-center items-center max-[1640px]:max-w-[44rem] max-[1640px]:w-1/2 max-[1010px]:hidden">
        <div className="w-full flex items-center h-20 px-7">
            <h1 className="text-heading3-bold pl-3">LOADING...</h1>
        </div>
        <div className="w-full h-full flex justify-center items-center px-28 py-20 overflow-y-auto max-[1600px]:px-24 max-[1340px]:px-20 max-[1095px]:px-16">
            <div className="w-full h-full flex-col justify-center flex-1">
            <Skeleton className="w-full h-12 mt-5 mb-1"/>
            <Skeleton className="w-full h-5 mb-8"/>
            <Skeleton className="w-full h-14 rounded-lg pl-3 px-1"/>
            <Skeleton className="w-full h-7 my-12"></Skeleton>
            <div className="flex flex-col text-center">
                <Skeleton className="h-12 p-2 mb-4"/>
            </div>
            </div>
        </div>
        </div>
        <div className="relative w-4/5 h-full flex justify-center items-center rounded-l-[80px] overflow-hidden max-[1010px]:flex-col max-[1010px]:w-full max-[1010px]:rounded-none">
        <h1 className="text-[56px] font-medium text-black max-[1010px]:text-[48px] max-[390px]:text-[40px]">LOADING...</h1>
        <div className="w-full text-white justify-center items-center px-28 py-5 overflow-y-auto min-[1011px]:hidden max-[600px]:px-16 max-[455px]:px-12 max-[360px]:px-10 max-[340px]:px-7">
          <div className="w-full h-full flex-col justify-center flex-1">
            <Skeleton className="w-full h-12 mt-5 mb-1"/>
            <Skeleton className="w-full h-5 mb-8"/>
            <Skeleton className="w-full h-14 rounded-lg pl-3 px-1"/>
            <Skeleton className="w-full h-7 my-12"></Skeleton>
          <div className="flex flex-col text-center">
            <Skeleton className="h-12 p-2 mb-4"/>
          </div>
        </div>
        </div>
        </div>
    </main>
  )
}

export default Loading