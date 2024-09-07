
'use client'

import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react"
import Link from "next/link";


const AdminLink = ({ className, linkDecoration }: { className?: string, linkDecoration?: string}) => {

const { data:session , status} = useSession();

  return (
    <>
        {session?.user.role == "Admin" ? ( 
          <div className={cn("w-fit h-8 flex justify-center items-center border-neutral-400 text-red-500 rounded-full transition-all px-[0.885rem] hover:bg-red-500/80 hover:text-white", className)}>
            <Link href='/admin/createProduct' className={cn("text-small-medium font-normal", linkDecoration)}>
              Адмін
            </Link>
          </div>
        ): null} 
    </>
  )
}

export default AdminLink