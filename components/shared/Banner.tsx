'use client'


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"



const Banner = () => {

  const images = [1,2,3,4]

  return (
    <section className="w-full rounded-sm max-h-96">
      <div className="w-full flex justify-center items-center  ">
          {/* <Image src="/bannergh.png" width={768} height={504} alt="Hero" priority/> */}
          <section className=''>
      <div className='container'>
      <Carousel className="w-4/5 mx-auto max-md:w-full max-h-96">
      <CarouselContent>
        
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
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
      </div>
    </section>
      </div>
    </section>
  )
}

export default Banner;