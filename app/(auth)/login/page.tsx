"use client";
import Link from "next/link";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import GoogleSignIn from "@/components/authButtons/GoogleSignIn";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { TransitionLink } from "@/components/interface/TransitionLink";

export default function LoginPage() {

  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'authenticated') {
      router.replace("/");
    }
  }, [session]);
 


  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] =useState(true);
  const [error, setError] = useState("");

  

  const handleSubmit = async (e:any) => {
    
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Неправильне ім'я або пароль");
        return;
      }

      router.replace("/");
    } catch (error) {
      console.log(error);
    }
  };

  //for button
  
  useEffect(() => {
      if(email.length > 0 && password.length > 0){
        setDisabled(false)
      }else{
        setDisabled(true)
      }
  }, [email,password]);    


 

    return (
      <main className="w-full h-screen flex flex-1">
        <div className="w-2/5 max-w-[40rem] h-full flex flex-col justify-center items-center max-[1640px]:max-w-[44rem] max-[1640px]:w-1/2 max-[1010px]:hidden">
          <div className="w-full flex items-center h-20 px-7">
            <Link href="/" className="text-heading3-bold pl-3">SANTEHVAN</Link>
          </div>
          <div className="w-full h-full flex justify-center items-center px-28 py-20 overflow-y-auto max-[1600px]:px-24 max-[1340px]:px-20 max-[1095px]:px-16">
            <div className="w-full h-full flex-col justify-center flex-1">
              <h3 className="text-heading1-semibold text-dark-3 font-[550] mt-5 mb-1">Welcome back</h3>
              <p className="text-dark-4 mb-8">Продовжте з Google, або введіть дані самостійно.</p>
              <GoogleSignIn className="" label="Sign in with Google"/>
              <div className="relative w-full h-7 flex gap-1 shrink-0 items-center justify-between my-12">
                <div className="w-[47%] h-[2px] bg-stone-100"></div>
                <p className="w-10 bg-trasnparent text-center rounded-2xl px-3">or</p>
                <div className="w-[47%] h-[2px] bg-stone-100"></div>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col text-center">
                <label htmlFor="email"></label>
                <input 
                  className="bg-transparent border-b-2 border-stone-200 font-medium focus:outline-none focus:border-gray-600 text-black placeholder-slate-600 p-2 mb-4"
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Email"
                />
                <label htmlFor="password"></label>
                <input 
                  className="bg-transparent border-b-2 border-stone-200 font-medium focus:outline-none focus:border-gray-600 text-black placeholder-slate-600 p-2 mb-4"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
                {error && (
                  <div className="w-full bg-red-500 text-white text-sm py-1 px-3 rounded-md mt-2 mb-3">
                    {error}
                  </div>
                )} 
                <div className="w-full h-fit flex justify-end items-center">
                  <TransitionLink type="left" href='/resetPass' className="w-fit text-[16px] text-end font-semibold underline underline-offset-4 mt-1 mb-2">Забули пароль</TransitionLink>
                </div>
                {disabled?<button className="w-full mx-auto py-3 px-10 font-medium tracking-wide border bg-gray-50 border-gray-300 text-gray-300 rounded-lg pointer-events-none mt-9 mb-4">Увійти</button>
                  :<button className="w-full mx-auto py-3 px-10 bg-black text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4">Увійти</button>}
              
                <div className="w-full h-fit text-[15px] flex gap-1 justify-center items-center mt-5 mb-7 max-[1255px]:flex-col"><p>Не маєте акаунта?</p><TransitionLink type="left" href='/signup' className="font-semibold">Зараєструватися зараз</TransitionLink></div>
              </form>
            </div>
          </div>
        </div>
        <div className="relative w-4/5 h-full flex justify-center items-center rounded-l-[80px] overflow-hidden max-[1010px]:flex-col max-[1010px]:w-full max-[1010px]:rounded-none" style={{ backgroundImage: `url(/assets/loginbackground.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <h1 className="text-[56px] font-medium text-white max-[1010px]:text-[48px] max-[390px]:text-[40px]">SANTEHVAN</h1>
          <div className="w-full text-white justify-center items-center px-28 py-5 overflow-y-auto min-[1011px]:hidden max-[600px]:px-16 max-[455px]:px-12 max-[360px]:px-10 max-[340px]:px-7">
            <div className="w-full h-fit flex flex-col flex-1 mb-10">
              <h3 className="text-heading1-semibold text-slate-200 font-[550] mt-5 mb-1">Welcome back</h3>
              <p className="text-slate-200 mb-8">Продовжте з Google, або введіть дані самостійно.</p>
              <GoogleSignIn className="bg-glass text-white border-white bg-opacity-5" label="Sign in with Google"/>
              <div className="relative w-full h-7 flex gap-1 shrink-0 items-center justify-between my-12">
                <div className="w-[47%] h-[2px] bg-stone-100"></div>
                <p className="w-10 bg-glass text-center rounded-2xl px-3">or</p>
                <div className="w-[47%] h-[2px] bg-stone-100"></div>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col text-center">
                <label htmlFor="email"></label>
                <input 
                  className="bg-transparent border-b-2 border-stone-200 font-medium focus:outline-none focus:border-white text-slate-200 placeholder-slate-300 p-2 mb-4"
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Email"
                />
                <label htmlFor="password"></label>
                <input 
                  className="bg-transparent border-b-2 border-stone-200 font-medium focus:outline-none focus:border-white text-slate-200 placeholder-slate-300 p-2 mb-4"
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
                {error && (
                  <div className="w-full bg-red-500 text-white text-sm py-1 px-3 rounded-md mt-2 mb-3">
                    {error}
                  </div>
                )} 
                <div className="w-full h-fit flex justify-end items-center">
                  <TransitionLink href='/resetPass' className="w-fit text-[16px] text-end font-semibold underline underline-offset-4 mt-1 mb-2">Забули пароль</TransitionLink>
                </div>
                {disabled?<button className="w-full mx-auto py-3 px-10 font-medium tracking-wide border bg-gray-50 border-gray-300 text-gray-300 rounded-lg pointer-events-none mt-9 mb-4">Увійти</button>
                  :<button className="w-full mx-auto py-3 px-10 text-white font-medium tracking-wide border border-gray-300 rounded-lg focus:outline-none hover:border-slate-950 transition-colors duration-300 mt-9 mb-4">Увійти</button>}
              
                <div className="w-full h-fit text-[15px] flex gap-1 justify-center items-center my-5 mb-3 max-[425px]:flex-col"><p>Не маєте акаунта?</p><TransitionLink href='/signup' className="font-semibold">Зараєструватися зараз</TransitionLink></div>
              </form>
            </div>
          </div>
        </div>
      </main>
        // <>
        //     <main className="flex flex-col items-center justify-center  py-2 pt-52 ">
        //         <div className="flex flex-col items-center justify-center bg-white py-5 px-8 rounded-lg shadow-2xl  ">
        //             <div className="mb-5 text-[20px]"><Link href='/signup' className="mr-1 ">Реєстрація</Link>/<Link href='login' className="ml-1 text-slate-500">Вхід</Link></div>
        //                 <hr />
        //                 <GoogleSignIn/> 
        //                 <br />
        //                 <hr />
        // <form onSubmit={handleSubmit} className="flex flex-col text-center">
        // <label htmlFor="email">email</label>
        //             <input 
        //                 className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        //                 onChange={(e) => setEmail(e.target.value)}
        //                 type="text"
        //                 placeholder="Email"
        //                 />
        //             <label htmlFor="password">пароль</label>
        //             <input 
        //             className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        //             onChange={(e) => setPassword(e.target.value)}
        //             type="password"
        //             placeholder="Password"
        //                 />
        //             <Link href='/resetPass' className="mb-2 underline">Забули пороль ?</Link>
        //   {disabled?<button className="w-fit mx-auto py-2 px-10 border bg-gray-50 border-gray-300 text-gray-300 rounded-lg mb-4 pointer-events-none ">Увійти</button>
        //   :<button className="w-fit mx-auto py-2 px-10 border border-gray-300 rounded-lg mb-4 focus:outline-none    hover:border-slate-950 transition-colors duration-300">Увійти</button>}
          
        //   {error && (
        //     <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
        //       {error}
        //     </div>
        //   )}

         
        // </form>
        //         </div>
        //     </main>
        // </>
    )

}