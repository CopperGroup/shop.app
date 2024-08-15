"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);
    const [changed, setChanged] = useState(true);
    const [disabled, setDisabled] = useState(true);
    const [password, setPassword] = useState("");

    const router = useRouter();

    const changeUserPass = async () => {
        try {
            await axios.post('/api/users/newPass', { token, password });
            setVerified(true);
            setChanged(true);
        } catch (error: any) {
            setError(true);
            console.log(error);
        }
    }

    useEffect(() => {
        if (password.length > 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [password]);

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (token.length > 0) {
            await changeUserPass();
        }
    }

    return (
        <main className="w-full h-screen flex flex-1">
        <div className="w-2/5 max-w-[40rem] h-full flex flex-col justify-center items-center max-[1640px]:max-w-[44rem] max-[1640px]:w-1/2 max-[1010px]:hidden">
          <div className="w-full flex items-center h-20 px-7">
            <Link href="/" className="text-heading3-bold pl-3">SANTEHVAN</Link>
          </div>
          <div className="w-full h-full flex justify-center items-center px-28 py-20 overflow-y-auto max-[1600px]:px-24 max-[1340px]:px-20 max-[1150px]:px-16 max-[1065px]:px-12">
            <div className="w-full h-full flex-col justify-center flex-1">
            {changed
                 ?
                 <>
                    <h2 className="text-heading1-semibold font-[550] mt-5 mb-1">Вітаємо! Ви успішно змінили пароль.</h2>
                    <button className="w-full mx-auto py-3 px-10 bg-black text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4" onClick={() => router.push('/login')}>Увійти зараз</button>
                    <Image 
                      src="/assets/thumb-up.svg"
                      width={300} 
                      height={300} 
                      alt="" 
                      className="mx-auto mt-5"
                    />
                 </>
                 :
                (<>
                    <h3 className="text-heading1-semibold text-dark-3 font-[550] mt-5 mb-1">Змінити пароль</h3>
                    <p className="text-dark-4 mb-8">Введіть новий пароль.</p>
                    <form onSubmit={handleSubmit} className="flex flex-col text-center"> 
                        <input
                            className="bg-transparent appearance-none rounded-none border-b-2 border-stone-200 font-medium focus:outline-none focus:border-gray-600 text-black placeholder-slate-600 p-2 mb-4"
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Новий пароль"
                        />
                        {disabled?<button className="w-full mx-auto py-3 px-10 font-medium tracking-wide border bg-gray-50 border-gray-300 text-gray-300 rounded-lg pointer-events-none mt-9 mb-4">Змінити пароль</button>
                        :<button type="submit" className="w-full mx-auto py-3 px-10 bg-black text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4">Змінити пароль</button>}
                    
                    </form>
                </>)}
            </div>
          </div>
        </div>
        <div className="relative w-4/5 h-full flex justify-center items-center rounded-l-[80px] overflow-hidden max-[1010px]:flex-col max-[1010px]:w-full max-[1010px]:rounded-none" style={{ backgroundImage: `url(/assets/loginbackground.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <h1 className="text-[56px] font-medium text-white max-[1010px]:text-[48px] max-[390px]:text-[40px]">SANTEHVAN</h1>
          <div className="w-full text-white justify-center items-center px-28 py-5 overflow-y-auto min-[1011px]:hidden max-[600px]:px-16 max-[455px]:px-12 max-[360px]:px-10 max-[340px]:px-7">
            <div className="w-full h-fit flex flex-col flex-1 mb-10">
            {changed
                 ?
                 <>
                    <h2 className="w-full text-heading1-semibold text-center text-slate-200 font-[550] mt-5 mb-1">Вітаємо! Ви успішно змінили пароль.</h2>
                    <button className="w-[80%] mx-auto py-3 px-10 text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4" onClick={() => router.push('/login')}>Увійти зараз</button>
                 </>
                 :
                (<>
                  <h3 className="text-heading1-semibold text-slate-200 font-[550] mt-5 mb-1">Змінити пароль</h3>
                  <p className="text-slate-200 mb-8">Введіть новий пароль.</p>
                  <form onSubmit={handleSubmit} className="flex flex-col text-center">
                    <input
                        className="bg-transparent appearance-none rounded-none border-b-2 border-stone-200 font-medium focus:outline-none focus:border-white text-slate-200 placeholder-slate-300 p-2 mb-4"
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Новий пароль"
                    />
                    {disabled ? <button className="w-full mx-auto py-3 px-10 font-medium tracking-wide border bg-gray-50 border-gray-300 text-gray-300 rounded-lg pointer-events-none mt-9 mb-4">Змінити пароль</button>
                      :<button type="submit" className="w-full mx-auto py-3 px-10 text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4">Змінити пароль</button>}
                  </form>
                </>)} 
            </div>
          </div>
        </div>
      </main>
        // <div className="flex flex-col items-center justify-center min-h-screen mt-[-160px]">
        //     {changed ?
        //         <div>
        //             <h2 className="text-[25px] text-gray-700">Вітаємо! Ви успішно змінили пароль.</h2>
        //             <Image src='/assets/welldone.svg' width={300} height={300} alt="" className="mx-auto mt-5"></Image>
        //             <div className="mx-auto w-fit mt-[-30px]">
        //                 <Link href="/login" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2 z-40 relative">
        //                     Увійти
        //                 </Link>
        //             </div>
        //         </div>
        //         :
        //         <div className="flex flex-col items-center justify-center bg-white py-5 px-8 rounded-lg shadow-2xl">
        //             <h1 className="text-[25px]">Зміна пароля</h1>

        //             <form onSubmit={handleSubmit} className="flex flex-col text-center">

        //                 <input
        //                     className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        //                     onChange={(e) => setPassword(e.target.value)}
        //                     type="password"
        //                     placeholder="Новий пароль"
        //                 />

        //                 {disabled ? <button className="w-fit mx-auto py-2 px-10 border bg-gray-50 border-gray-300 text-gray-300 rounded-lg mb-4 pointer-events-none">Змінити</button>
        //                     : <button className="w-fit mx-auto py-2 px-10 border border-gray-300 rounded-lg mb-4 focus:outline-none hover:border-slate-950 transition-colors duration-300">Змінити</button>}

        //             </form>
        //         </div>
        //     }
        // </div>
    )
}