"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {

    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [loaded, setLoaded]=useState(false);
    

    const router = useRouter();

    const verifyUserEmail = async () => {
        try {
            await axios.post('../api/users/verifyemail', {token})
            setVerified(true);
        } catch (error:any) {
            setError(true);
            console.log(error);
            
        }finally{
            setLoaded(true);
        }

    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);


    useEffect(() => {
        if(token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return(
        <main className="w-full h-screen flex flex-1">
        <div className="w-2/5 max-w-[40rem] h-full flex flex-col justify-center items-center max-[1640px]:max-w-[44rem] max-[1640px]:w-1/2 max-[1010px]:hidden">
          <div className="w-full flex items-center h-20 px-7">
            <Link href="/" className="text-heading3-bold pl-3">SANTEHVAN</Link>
          </div>
          <div className="w-full h-full flex justify-center items-center px-28 py-20 overflow-y-auto max-[1600px]:px-24 max-[1340px]:px-20 max-[1150px]:px-16 max-[1065px]:px-12">
            <div className="w-full h-full flex-col justify-center flex-1">
            {loaded
                 ?
                    <>
                        {verified && (
                            <div>
                                <h2 className="text-heading1-semibold text-dark-3 font-[550] mt-5 mb-1">Вітаємо! Ви успішно створили акаунт.</h2>
                                <button className="w-full mx-auto py-3 px-10 bg-black text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4" onClick={() => router.push('/login')}>Увійти зараз</button>
                                <Image 
                                    src="/assets/thumb-up.svg"
                                    width={300} 
                                    height={300} 
                                    alt="" 
                                    className="mx-auto mt-5"
                                />
                            </div>
                        )}
                        {error && (
                            <div>
                                <Accordion className="w-full" type="single" collapsible>
                                    <AccordionItem value="item-1" className="border-none">
                                        <AccordionTrigger className="text-heading1-semibold text-start font-[550] mt-5 mb-1">Упс, сталася помилка</AccordionTrigger>
                                        <AccordionContent>
                                            <p>Якщо ви отримали данне повідомлення після оновлення сторінки, то перейдіть  &quot;До реєстрації&quot;, далі на вкладку &quot;Увійти&quot;. Введіть ваші данні як при звичайному вході.</p>
                                            <p className="mt-5">В іншому випадку пройдіть реєстрацію ще раз. Вибачте за незручності.</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                                <button className="w-full mx-auto py-3 px-10 bg-black text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4" onClick={() => router.push('/signup')}>До реєстрації</button>
                                <Image src='/assets/sad.svg' width={200} height={200} alt="" className="mx-auto mt-10"></Image>
                            </div>
                        )}
                    </>
                 :
                (
                 <>
                    <h2 className="text-heading1-semibold font-[550] mt-5 mb-1">Підтвердження пошти</h2>
                    <div className="flex items-center justify-center mt-9">
                        <div className="w-12 h-12 border-4 border-black border-t-transparent border-solid rounded-full animate-spin"></div>
                    </div>
                 </>
                )}
            </div>
          </div>
        </div>
        <div className="relative w-4/5 h-full flex justify-center items-center rounded-l-[80px] overflow-hidden max-[1010px]:flex-col max-[1010px]:w-full max-[1010px]:rounded-none" style={{ backgroundImage: `url(/assets/loginbackground.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <h1 className="text-[56px] font-medium text-white max-[1010px]:text-[48px] max-[390px]:text-[40px]">SANTEHVAN</h1>
          <div className="w-full text-white justify-center items-center px-28 py-5 overflow-y-auto min-[1011px]:hidden max-[600px]:px-16 max-[455px]:px-12 max-[360px]:px-10 max-[340px]:px-7">
            <div className="w-full h-fit flex flex-col flex-1 mb-10">
                {loaded
                 ?
                    <>
                        {verified && (
                            <div className="w-full flex flex-col items-center">
                                <h2 className="text-heading2-semibold text-center font-[550] mt-5 mb-1">Вітаємо! Ви успішно створили акаунт.</h2>
                                <button className="w-full mx-auto py-3 px-10 text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4" onClick={() => router.push('/login')}>Увійти зараз</button>
                            </div>
                        )}
                        {error && (
                            <div className="w-full flex flex-col items-center">
                                <Accordion className="text-center" type="single" collapsible>
                                    <AccordionItem value="item-1" className="border-none">
                                        <h1 className="text-heading2-semibold text-center font-[550] mt-5 mb-1">Упс, здається, щось пішло не так :(</h1>
                                        <p>Якщо ви отримали данне повідомлення після оновлення сторінки, то перейдіть  &quot;До реєстрації&quot;, далі на вкладку &quot;Увійти&quot;. Введіть ваші данні як при звичайному вході.</p>
                                        <p className="mt-5">В іншому випадку пройдіть реєстрацію ще раз. Вибачте за незручності.</p>
                                    </AccordionItem>
                                </Accordion>
                                <button className="w-full mx-auto py-3 px-10 text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4" onClick={() => router.push('/signup')}>До реєстрації</button>
                            </div>
                        )}
                    </>
                 :
                (
                 <>
                    <h2 className="text-heading1-semibold text-center font-[550] mt-5 mb-1">Підтвердження пошти</h2>
                    <div className="flex items-center justify-center mt-9">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
                    </div>
                 </>
                )}
            </div>
          </div>
        </div>
      </main>
        // <div className="flex flex-col items-center justify-center min-h-screen mt-[-160px]">

        //     <h1 className="text-[45px]">Підтвердження пошти</h1>
        //     {loaded?
        //         <>
        //             {verified && (
        //             <div>
        //                 <h2 className="text-[25px] text-gray-700">Вітаємо! Ви успішно створили акаунт</h2>
        //                 <Image src='/assets/welldone.svg' width={300} height={300} alt="" className="mx-auto mt-5"></Image>
        //                 <div className="mx-auto w-fit mt-[-30px]">
        //                     <Link href="/login" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2 z-40 relative">
        //                         Увійти
        //                     </Link>
        //                 </div>
        //             </div>
        //         )}
        //         {error && (
        //             <div>
                        
        //                 <Accordion type="single" collapsible className="w-[400px]">
        //                     <AccordionItem value="item-1" className="border-none">
        //                         <AccordionTrigger className="text-center"><h2 className="text-[25px] text-gray-700 mx-auto">Упс, щось пішло не так</h2></AccordionTrigger>
        //                         <AccordionContent>
        //                             <p>Якщо ви отримали данне повідомлення після оновлення сторінки, то перейдіть  &quot;До реєстрації&quot;, далі на вкладку 
        //                             &quot;Увійти&quot;. Введіть ваші данні як при звичайному вході.<br /><br />
        //                                 В іншому випадку пройдіть реєстрацію ще раз. Вибачте за незручності.
        //                             </p>
        //                         </AccordionContent>
        //                     </AccordionItem>
        //                 </Accordion>
        //                 <Image src='/assets/sad.svg' width={200} height={200} alt="" className="mx-auto mt-10"></Image>
        //                 <div className="mx-auto w-fit">
        //                     <Link href="/signup" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2 z-40 relative">
        //                         До реєстрації
        //                     </Link>
        //                 </div>
        //             </div>
        //         )}

        //         </>
        //     :
        //         <div className="flex items-center justify-center mt-9">
        //             <div className="w-12 h-12 border-4 border-black border-t-transparent border-solid rounded-full animate-spin"></div>
        //         </div>}
            

            
        // </div>
    )

}