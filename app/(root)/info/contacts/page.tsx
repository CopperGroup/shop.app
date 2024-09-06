import React from 'react'

const contacts = () => {
  return (
    <section >
        <div className=' text-[25px]'>
            <h1 className='text-[45px]  '>Контакти</h1>
            <div className='flex items-center gap-4 my-2'>Email: santehvan@gmail.com<i className='fa fa-mail-bulk text-[30px]'></i></div>
            <div className='flex items-center gap-4 my-2'>Телеграм, вайбер: 0660178170 <i className='fab fa-telegram text-[30px]'></i><i className='fab fa-viber text-[30px]'></i></div>
            <div className='flex items-center gap-4 my-2'>Телеграм, вайбер: 0991488074 <i className='fab fa-telegram text-[30px]'></i><i className='fab fa-viber text-[30px]'></i></div>
            <div className='flex items-center gap-4 my-2'>Менеджр: 0686610203, 0688428198<i className='fa fa-phone-square-alt text-[30px]'></i></div>
        </div>
    </section>
  )
}

export default contacts