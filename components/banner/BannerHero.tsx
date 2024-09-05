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



const BannerHero = ({ children }: { children?: ReactNode }) => {

  const images = [1,2,3,4]

  return (
    <section className="w-full max-h-[48rem] rounded-2xl overflow-hidden border border-red-500">
      {children}
      <Carousel className="w-full h-full mx-auto rounded-2xl max-md:w-full">
      <CarouselContent className="relative z-10">
          <CarouselItem className="w-full max-h-[48rem] flex justify-end items-end rounded-2xl pb-36 pr-16" style={{ backgroundImage: `url(/assets/bannerbackground.jpg)`, backgroundSize: 'cover', backgroundPosition: "50% 100%"}}>
            <h2 className="text-[56px] font-medium text-white max-[440px]:text-[48px] max-[370px]:text-[40px]">SANTEHVAN</h2>
          </CarouselItem>
          <CarouselItem >
            <video width="100%" height="100%" controls>
              <source src="/video/brooklyn.mp4" type="video/mp4" />
            </video>
          </CarouselItem>

          {/* <CarouselItem >
            <video width="100%">
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
          </CarouselItem> */}
    
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </section>
  )
}

export default BannerHero;