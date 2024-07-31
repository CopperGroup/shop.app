import Image from "next/image"


const Map = () => {
  return (
    <section className="flex flex-1 justify-center items-center border-2 border-black rounded-2xl py-2 shadow-lg">
      <iframe  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2538.4862133725956!2d30.505280476918397!3d50.48790798466551!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce00958a574b%3A0x274acef97fa72371!2z0KLQoNCaIFBMQVpBIFNQT1JUIE9VVExFVA!5e0!3m2!1sua!2sua!4v1713206597803!5m2!1sua!2sua" width="1280" height="550"   loading="lazy"  className=" w-full flex z-10 rounded-2xl"></iframe>
      {/* <Image src="/assets/background-circles-1.svg" width={1560} height={600} alt="circles-background" className="-m-2 rounded-2xl"/> */}
    </section>
  )
}

export default Map