'use client'

import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';
import axios from "axios";
import Link from 'next/link';


const ResetPass = () => {
    const [disabled, setDisabled] =useState(true);
    const [email, setEmail] = useState("");
    const [wasSended, setWasSended] = useState(false);


    useEffect(() => {
      if(email.length > 0 ){
        setDisabled(false)
      }else{
        setDisabled(true)
      }
    }, [email]);   

    const handleSubmit = async (e:any) => {
    
      e.preventDefault();
  
      try {
        await axios.post("/api/users/resetPass", { email });
        setWasSended(true);
        
    } catch (error:any) {
      console.log(error);
    }


      
    };
  




  return (
    <main className="w-full h-screen flex flex-1">
        <div className="w-2/5 max-w-[40rem] h-full flex flex-col justify-center items-center max-[1640px]:max-w-[44rem] max-[1640px]:w-1/2 max-[1010px]:hidden">
          <div className="w-full flex items-center h-20 px-7">
            <Link href="/" className="text-heading3-bold pl-3">SANTEHVAN</Link>
          </div>
          <div className="w-full h-full flex justify-center items-center px-28 py-20 overflow-y-auto max-[1600px]:px-24 max-[1340px]:px-20 max-[1150px]:px-16 max-[1065px]:px-12">
            <div className="w-full h-full flex-col justify-center flex-1">
            {wasSended
                 ?
                 <div>
                     <h1 className="text-heading1-semibold text-dark-3 font-[550] mt-5 mb-1">Лист Відправлено!</h1>
                     <p className="text-gray-700 text-[17px] mt-3">Перевірте вашу електронну адресу на наявність листа! <br/>Не забудьте подиввитися у папці &quot;Спам&quot;!</p>
                     <Image src='assets/mail.svg' width={100} height={100} alt="" className="mx-auto my-10"></Image>
                 </div>
                 :
                (<>
                    <h3 className="text-heading1-semibold text-dark-3 font-[550] mt-5 mb-1">Змінити пароль</h3>
                    <p className="text-dark-4 mb-8">На вашу пошту прийде лист для змінення пароля.</p>
                    <form onSubmit={handleSubmit} className="flex flex-col text-center"> 
                      <input 
                       className="bg-transparent border-b-2 border-stone-200 font-medium focus:outline-none focus:border-gray-600 text-black placeholder-slate-600 p-2 mb-4"
                       onChange={(e) => setEmail(e.target.value)}
                       type="email"
                       placeholder="Email"
                      />
                      {disabled?<button className="w-full mx-auto py-3 px-10 font-medium tracking-wide border bg-gray-50 border-gray-300 text-gray-300 rounded-lg pointer-events-none mt-9 mb-4">Отримати лист</button>
                      :<button type="submit" className="w-full mx-auto py-3 px-10 bg-black text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4">Отримати лист</button>}
                    
                    </form>
                </>)}
            </div>
          </div>
        </div>
        <div className="relative w-4/5 h-full flex justify-center items-center rounded-l-[80px] overflow-hidden max-[1010px]:flex-col max-[1010px]:w-full max-[1010px]:rounded-none" style={{ backgroundImage: `url(/assets/loginbackground.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <h1 className="text-[56px] font-medium text-white max-[1010px]:text-[48px] max-[390px]:text-[40px]">SANTEHVAN</h1>
          <div className="w-full text-white justify-center items-center px-28 py-5 overflow-y-auto min-[1011px]:hidden max-[600px]:px-16 max-[455px]:px-12 max-[360px]:px-10 max-[340px]:px-7">
            <div className="w-full h-fit flex flex-col flex-1 mb-10">
            {wasSended
                 ?
                 <div>
                     <h1 className="w-full text-heading1-semibold text-center text-slate-200 font-[550] mt-5 mb-1">Лист Відправлено!</h1>
                     <p className="w-full text-slate-200 text-center mb-8">Перевірте вашу електронну адресу на наявність листа! <br/>Не забудьте подиввитися у папці &quot;Спам&quot;!</p>
                      <Image src="/assets/mail-white.svg" width={100} height={100} alt="" className="mx-auto my-10"></Image>
                 </div>
                 :
                (<>
                  <h3 className="text-heading1-semibold text-slate-200 font-[550] mt-5 mb-1">Змінити пароль</h3>
                  <p className="text-slate-200 mb-8">На вашу пошту прийде лист для змінення пароля.</p>
                  <form onSubmit={handleSubmit} className="flex flex-col text-center">
                    <input 
                      className="bg-transparent appearance-none rounded-none  border-b-2 border-stone-200 font-medium focus:outline-none focus:border-white text-slate-200 placeholder-slate-300 p-2 mb-4"
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Email"
                    />
                    {disabled ? <button className="w-full mx-auto py-3 px-10 font-medium tracking-wide border bg-gray-50 border-gray-300 text-gray-300 rounded-lg pointer-events-none mt-9 mb-4">Отримати лист</button>
                      :<button type="submit" className="w-full mx-auto py-3 px-10 text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4">Отримати лист</button>}
                  </form>
                </>)} 
            </div>
          </div>
        </div>
      </main>
//     <>
//     <section className="flex flex-col items-center justify-center  py-2 pt-52 ">
//       {wasSended?
//         <div>
//           <h1 className="text-[45px] text-center">Лист Відправлено!</h1>
//           <Image src='assets/mail.svg' width={100} height={100} alt="" className="mx-auto my-10"></Image>
//           <p className="text-gray-700 text-[17px] ">Перевірте вашу електронну адресу на наявність листа! <br /> Не забудьте подивитись у папці спам</p>
//         </div>
//         :
//         <div className="flex flex-col items-center justify-center bg-white py-5 px-8 rounded-lg shadow-2xl  ">
//         <h1 className='text-[25px]'>Зміна пароля</h1>
//         <p className='text-gray-700 mb-5'>На вашу пошту прийде лист <br /> підтвердження, з яким ви <br /> зможете змінити пароль</p>
//         <form onSubmit={handleSubmit}  className="flex flex-col text-center">

//             <input 
//                 className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
//                 onChange={(e) => setEmail(e.target.value)}
//                 type="email"
//                 placeholder="Email"
//                 />
           
            
//             {disabled?<button className="w-fit mx-auto py-2 px-10 border bg-gray-50 border-gray-300 text-gray-300 rounded-lg mb-4 pointer-events-none ">Надіслати</button>
//             :<button className="w-fit mx-auto py-2 px-10 border border-gray-300 rounded-lg mb-4 focus:outline-none    hover:border-slate-950 transition-colors duration-300">Надіслати</button>}

//           </form>
//         </div>
//     }
        
//     </section>
// </>
  )
}

export default ResetPass