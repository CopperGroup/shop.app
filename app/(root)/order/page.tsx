//'use client'

import React from 'react'
import CreateOrder from '@/components/forms/CreateOrder'
import { getSession } from '@/lib/getServerSession'
import { fetchUserByEmail } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'



const Page = async () => {

    const email = await getSession();

    if(!email){
      redirect('/login')
    }


    const user = await fetchUserByEmail(email);

  return (
    <section className="flex flex-row w-full justify-between max-lg:flex-col max-[425px]:-mt-24">
        <CreateOrder userId={user._id} email={email}/>
    </section>
  )
}

export default Page;