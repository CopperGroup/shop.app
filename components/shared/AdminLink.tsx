
'use client'

import { useSession } from "next-auth/react"
import Link from "next/link";


const AdminLink = () => {

const { data:session , status} = useSession();

  return (
    <>
        {session?.user.role == "Admin" && ( 
          <div className="w-fit h-8 flex justify-center items-center border-neutral-400 text-red-500 rounded-full transition-all px-[0.885rem] hover:bg-red-500/80 hover:text-white">
            <Link href='/admin/createProduct' className="text-small-medium font-normal">
              Адмін
            </Link>
          </div>
        )} 
    </>
  )
}

export default AdminLink