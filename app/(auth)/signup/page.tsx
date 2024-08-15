"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import GoogleSignIn from "@/components/authButtons/GoogleSignIn";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { TransitionLink } from "@/components/interface/TransitionLink";

export default function SignupPage() {
    const session = useSession();
    const router = useRouter();
    const { toast } = useToast()
    useEffect(() => {
        if (session.status === 'authenticated') {
        router.replace("/");
        }
    }, [session]);
 

    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: ""
    })

    const [error, setError] = useState('');
    const [disabled, setDisabled] = React.useState(false);
    const [wasSended, setWasSended] = useState(false);


    const onSignup = async () => {
        try {
            const response = await axios.post("/api/users/signup", user);
            setWasSended(true);
            
        } catch (error: any) {
            console.log(error.message);
           
            setError('Акаунт вже існує')
        }
    }

   

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [user]);


    return (
        <main className="w-full h-screen flex flex-1">
        <div className="w-2/5 max-w-[40rem] h-full flex flex-col justify-center items-center max-[1640px]:max-w-[44rem] max-[1640px]:w-1/2 max-[1010px]:hidden">
          <div className="w-full flex items-center h-20 px-7">
            <Link href="/" className="text-heading3-bold pl-3">SANTEHVAN</Link>
          </div>
          <div className="w-full h-full flex justify-center items-center px-28 py-20 overflow-y-auto max-[1600px]:px-24 max-[1340px]:px-20 max-[1095px]:px-16">
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
                    <h3 className="text-heading1-semibold text-dark-3 font-[550] mt-5 mb-1">Sign up</h3>
                    <p className="text-dark-4 mb-8">Продовжте з Google, або введіть дані самостійно.</p>
                    <GoogleSignIn className="" label="Sign up with Google"/>
                    <div className="relative w-full h-7 flex gap-1 shrink-0 items-center justify-between my-12">
                      <div className="w-[47%] h-[2px] bg-stone-100"></div>
                      <p className="w-10 bg-trasnparent text-center rounded-2xl px-3">or</p>
                      <div className="w-[47%] h-[2px] bg-stone-100"></div>
                    </div>
                    <div className="flex flex-col text-center">
                        <label htmlFor="username"></label>
                        <input 
                            className="bg-transparent appearance-none rounded-none border-b-2 border-stone-200 font-medium focus:outline-none focus:border-gray-600 text-black placeholder-slate-600 p-2 mb-4"
                            id="username"
                            type="text"
                            value={user.username}
                            onChange={(e) => setUser({...user, username: e.target.value})}
                            placeholder="Name"
                        />
                        <label htmlFor="email"></label>
                        <input 
                        className="bg-transparent appearance-none rounded-none border-b-2 border-stone-200 font-medium focus:outline-none focus:border-gray-600 text-black placeholder-slate-600 p-2 mb-4"
                            id="email"
                            type="text"
                            value={user.email}
                            onChange={(e) => setUser({...user, email: e.target.value})}
                            placeholder="Email"
                        />
                        <label htmlFor="password"></label>
                        <input 
                            className="bg-transparent appearance-none rounded-none border-b-2 border-stone-200 font-medium focus:outline-none focus:border-gray-600 text-black placeholder-slate-600 p-2 mb-4"
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({...user, password: e.target.value})}
                            placeholder="Password"
                        />
                        {error && (
                        <div className="w-full bg-red-500 text-white text-sm py-1 px-3 rounded-md mt-2 mb-3">
                            {error}
                        </div>
                        )} 
                        {disabled?<button className="w-full mx-auto py-3 px-10 font-medium tracking-wide border bg-gray-50 border-gray-300 text-gray-300 rounded-lg pointer-events-none mt-9 mb-4">Зареєструватися</button>
                        :<button onClick={onSignup} className="w-full mx-auto py-3 px-10 bg-black text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4">Зареєструватися</button>}
                    
                        <div className="w-full h-fit text-[15px] flex gap-1 justify-center items-center mt-5 mb-7 max-[1255px]:flex-col"><p>Маєте акакунт?</p><TransitionLink type="left" href="/login" className="font-semibold">Увійти зараз</TransitionLink></div>
                    </div>
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
                  <h3 className="text-heading1-semibold text-slate-200 font-[550] mt-5 mb-1">Sign up</h3>
                  <p className="text-slate-200 mb-8">Продовжте з Google, або введіть дані самостійно.</p>
                  <GoogleSignIn className="bg-glass text-white border-white bg-opacity-5" label="Sign up with Google"/>
                  <div className="relative w-full h-7 flex gap-1 shrink-0 items-center justify-between my-12">
                    <div className="w-[47%] h-[2px] bg-stone-100"></div>
                    <p className="w-10 bg-glass text-center rounded-2xl px-3">or</p>
                    <div className="w-[47%] h-[2px] bg-stone-100"></div>
                  </div>
                  <div className="flex flex-col text-center">
                    <label htmlFor="username"></label>
                    <input 
                        className="bg-transparent appearance-none rounded-none border-b-2 border-stone-200 font-medium focus:outline-none focus:border-white text-slate-200 placeholder-slate-300 p-2 mb-4"
                        id="username"
                        type="text"
                        value={user.username}
                        onChange={(e) => setUser({...user, username: e.target.value})}
                        placeholder="Name"
                    />
                    <label htmlFor="email"></label>
                    <input 
                      className="bg-transparent appearance-none rounded-none border-b-2 border-stone-200 font-medium focus:outline-none focus:border-white text-slate-200 placeholder-slate-300 p-2 mb-4"
                        id="email"
                        type="text"
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                        placeholder="Email"
                    />
                    <label htmlFor="password"></label>
                    <input 
                        className="bg-transparent appearance-none rounded-none border-b-2 border-stone-200 font-medium focus:outline-none focus:border-white text-slate-200 placeholder-slate-300 p-2 mb-4"
                        id="password"
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({...user, password: e.target.value})}
                        placeholder="Password"
                    />  
                    {error && (
                      <div className="w-full bg-red-500 text-white text-sm py-1 px-3 rounded-md mt-2 mb-3">
                        {error}
                      </div>
                    )} 
                    {disabled ? <button className="w-full mx-auto py-3 px-10 font-medium tracking-wide border bg-gray-50 border-gray-300 text-gray-300 rounded-lg pointer-events-none mt-9 mb-4">Зареєструватися</button>
                      :<button onClick={onSignup} className="w-full mx-auto py-3 px-10 text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4">Зареєструватися</button>}
                  
                  <div className="w-full h-fit text-[15px] flex gap-1 justify-center items-center my-5 mb-3"><p>Маєте акакунт?</p><TransitionLink href="/login" className="font-semibold">Увійти зараз</TransitionLink></div>
                  </div>
                </>)} 
            </div>
          </div>
        </div>
      </main>
        // <>
        //     <div className="flex flex-col items-center justify-center  py-2 pt-52 ">
        //         {wasSended
        //         ?
        //         <div>
        //             <h1 className="text-[45px] text-center">Лист Відправлено!</h1>
        //             <Image src='assets/mail.svg' width={100} height={100} alt="" className="mx-auto my-10"></Image>
        //             <p className="text-gray-700 text-[17px] ">Перевірте вашу електронну адресу на наявність листа! <br /> Не забудьте подивитись у папці спам</p>
        //         </div>
        //         :
        //         <div className="flex flex-col items-center justify-center bg-white py-5 px-8 rounded-lg shadow-2xl">
        //         <div className="mb-5 text-[20px]"><Link href='/signup' className="mr-1 text-slate-500">Реєстрація</Link>/<Link href='login' className="ml-1 relative before:content-[''] before:absolute before:h-[3px] hover:before:w-full before:bottom-[-5px] before:w-0 before:bg-black before:transition-all duration-1000 before:rounded-sm before:left-0">Вхід</Link></div>
        //         <hr />
        //             <GoogleSignIn/>
        //             <br />
        //         <hr />
        //         <label htmlFor="username">Ім&apos;я</label>
        //         <input 
        //             className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        //             id="username"
        //             type="text"
        //             value={user.username}
        //             onChange={(e) => setUser({...user, username: e.target.value})}
        //             placeholder="Name"
        //         />
        //         <label htmlFor="email">Email</label>
        //         <input 
        //         className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        //             id="email"
        //             type="text"
        //             value={user.email}
        //             onChange={(e) => setUser({...user, email: e.target.value})}
        //             placeholder="Email"
        //         />
        //         <label htmlFor="password">Пароль</label>
        //         <input 
        //             className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        //             id="password"
        //             type="password"
        //             value={user.password}
        //             onChange={(e) => setUser({...user, password: e.target.value})}
        //             placeholder="Password"
        //         />
        //             {buttonDisabled? <button
        //             className="p-2 border bg-gray-50 border-gray-300 text-gray-300 rounded-lg mb-4 pointer-events-none ">Створити акаунт</button>:
        //             <button
        //             onClick={onSignup}
        //             className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none    hover:border-slate-950 transition-colors duration-300">Створити акаунт</button>}
        //             {err?
        //             <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
        //             {err}
        //             </div>
        //             :<></>}
        //         </div>
        //         }
                
                    
         
        //         </div>
        // </>
    )

}