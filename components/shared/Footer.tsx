
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="min-h-80 bg-black mt-20 text-white relative z-40">
       <div className="max-w-screen-2xl mx-auto px-4 flex flex-col w-full">
            <div className="flex flex-col lg:flex-row pt-10 justify-between mx-auto w-full max-w-2xl lg:max-w-full"> 
                <div className="flex gap-2 lg:gap-20 justify-between w-full lg:w-fit">
                    <ul>
                        <li className="mb-3">Фіз. особам</li>
                        <li className="text-md font-thin my-1 underline"><Link href='/contacts'>Контакти</Link></li>
                        <li className="text-md font-thin my-1 underline"><Link href='/delivery-payment'>Доставка та оплата</Link></li>
                        <li className="text-md font-thin my-1 underline"><Link href='/warranty-services'>Гарантія та сервіс</Link></li>
                    </ul>
                    <ul>
                        <li>Дизайн</li>
                        <li className="text-md font-thin my-1 underline"><Link href='/presentations'>Презентації</Link></li>
                    </ul>
                    <ul>
                        <li>Каталоги</li>
                        <li className="text-md font-thin my-1 underline"><Link href='/catalog?category=Меблі_для_ванної_кімнати'>Меблі для ванної</Link></li>
                        <li className="text-md font-thin my-1 underline"><Link href='/catalog?category=Житлові_меблі'>Житлові меблі</Link></li>
                        <li className="text-md font-thin my-1 underline"><Link href='/catalog?category=Дитячі_меблі'>Дитячі меблі</Link></li>
                    </ul>
                </div>

                <div className="flex lg:gap-20 mt-10 lg:mt-0 lg:w-fit flex-col sm:flex-row mx-auto lg:mx-0 w-fit sm:w-full justify-between">
                    <div className="font-thin">
                        <p>Телефон:(066) 017-81-70,<br></br>(068) 842-81-98</p>
                        <br />
                        <p>Email:santehvan@gmail.com</p>
                        <br />
                   
                    </div>
                    <div>
                        <p className="text-center mt-5 sm:mt-0">Ми в соцмережах</p>
                        <div className="flex gap-5 mt-10 sm:mt-20 mx-auto w-fit">
                            <div className="relative cursor-pointer text-transparent hover:text-white transition-all"><p className="transition-all absolute top-[-25px] left-[-100%]">0660178170</p><Image alt="" width={30} height={30} src="/icons8-telegram-app.svg"></Image></div>
                            <div className="relative cursor-pointer text-transparent hover:text-white transition-all"><p className="transition-all absolute top-[-25px] left-[-100%]">0991488074</p><Image alt="" width={30} height={30} src="/icons8-viber.svg"></Image></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-10 lg:mt-16 flex justify-between font-thin flex-col lg:flex-row mx-auto max-w-screen-2xl lg:w-full mb-5">
                <div>Меблі для ванної інтернет магазин <span className="font-normal">SANTEHVAN</span> ©2024</div>
                <div className="flex items-center">Представник українських виробників меблів для ванної:<Image className="h-[18px]" width={88} height={18} src='/assets/botticelli.png' alt='' /><Image className="h-[18px]" width={55} height={18} src='/assets/juventa.png' alt='' /></div>
            </div>
        </div>
    </footer>
  )
}

export default Footer