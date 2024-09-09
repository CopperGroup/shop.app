import Link from "next/link"
import Image from "next/image"

const categories = [
  { name: "Меблі для ванної", image: "/tymba.png", href: "/catalog?category=Меблі_для_ванної_кімнати" },
  { name: "Житлові меблі", image: "/komod.png", href: "/catalog?category=Житлові_меблі" },
  { name: "Дитячі меблі", image: "/krovatka.png", href: "/catalog?category=Дитячі_меблі" },
]

const Categories = () => {
return (
  <section className="w-full pt-10 pb-32">
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-[1680px] px-12 max-lg:px-9 max-[500px]:px-7">
        <h2 className="text-heading1-bold text-black mb-4 text-center">Категорії продуктів</h2>
        <p className="text-body-medium text-light-4 mb-16 text-center max-w-2xl mx-auto">
          Знайдіть ідеальні рішення для вашого дому серед наших категорій
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group perspective">
              <div className="relative w-full h-[400px] rounded-3xl overflow-hidden transform transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:rotate-y-12 shadow-lg max-[425px]:h-[300px] max-[380px]:h-[250px]">
                <Image
                  src={category.image}
                  alt={category.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-1 via-transparent to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                  <h3 className="text-heading3-bold text-light-1 text-center mb-2 transform transition-transform duration-300 group-hover:translate-y-[-10px]">{category.name}</h3>
                  <span className="text-base-medium text-light-2 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">Переглянути</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    <div className="w-full flex justify-end pt-7 px-14 max-[425px]:justify-center">
      <Link href="/catalog" className="text-small-medium drop-shadow-text-blue">Переглянути всі</Link>
    </div>
  </section>
  )
}

export default Categories