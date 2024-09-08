'use client'


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import { ReactNode } from "react"
import { Button } from "../ui/button"
import Link from "next/link"



const BannerHero = ({ children }: { children?: ReactNode }) => {

  const images = [1,2,3,4]

  return (
    <section className="w-full flex justify-center items-center bg-black rounded-3xl py-20">
      <div className="w-full max-w-[1680px] flex flex-col lg:flex-row justify-between items-center px-12 max-lg:px-9 max-[500px]:px-7">
        <div className="flex flex-col items-start space-y-6 lg:w-1/2">
          <h1 className="font-bold text-white max-[1380px]:text-[72px] max-[1380px]:leading-[81px] max-[1260px]:text-[64px] max-[1260px]:leading-[72px] max-[1130px]:text-[60px] max-[1130px]:leading-[67px] max-[1070px]:text-[56px] max-[1070px]:leading-[63px] max-[425px]:text-[40px] max-[425px]:leading-[45px] max-[335px]:text-[36px] max-[335px]:leading-[40px]">
            Якісна сантехніка для вашого дому
          </h1>
          <p className="text-xl text-neutral-400">
            Широкий вибір сучасних та надійних сантехнічних рішень для вашої оселі
          </p>
          <Link href="/catalog" className="bg-white text-black font-medium border border-black rounded-xl py-3 px-4 hover:border-white hover:text-white hover:bg-black">
            Переглянути каталог
          </Link>
        </div>
        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <div className="relative w-full h-[450px] max-[1260px]:pt-5 max-[1130px]:pt-12 max-[1024px]:pt-0 max-[768px]:h-fit max-[768px]:max-h-[400px]">
            <div className="w-full h-full rounded-3xl overflow-hidden">

              <Carousel 
                className="w-full mx-auto max-md:w-full max-h-96 rounded-3xl"
              >
                <CarouselContent >
                  
                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/brooklyn.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/bronx.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/luton.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/luton.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/livorno.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/manhattan.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/arizona.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/vanessa.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/levanto.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/domus.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/agora.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/classic.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>

                    <CarouselItem >
                      <video width="100%"  controls>
                        <source src="/video/luna.mp4" type="video/mp4" />
                      </video>
                    </CarouselItem>
              
                </CarouselContent>
                <div className="flex border-red-500">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BannerHero;