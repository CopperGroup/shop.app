'use client'


import ProdactPage from '@/components/shared/ProdactPage';
import Product from '@/lib/models/product.model'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import axios from 'axios';

const CatalogItem = (context:any) => {
  
  const [product, setProduct] = useState({name:'',id:'', price:'',priceToShow:'',category:'',quantity:'',vendor:'',description:''});
  const [changed, setChanged] = useState(false);
  useEffect(()=>{
    const getPrductsDB = async () => {
      
      try {
        const response = await axios.post(`/api/getProductForAdmin`,context);
        setProduct(response.data.product);
       
      } catch (error:any) {
        if (error.response) {
          console.log('API Error Response:', error.response.data);
        } else {
          console.log('Error Message:', error.message);
        }
      } 
  }   
  
  setProduct({...product, name:'dssd'})
  getPrductsDB();
  },[ ])

  



  const handleSubmit = async(e:any)=>{

    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/changeProducts",{context,product});
      setChanged(true);
    } catch (error) {
      
    }




  }

  
 
  

  
 
  
  

  return (<>{changed?<div className='flex w-full h-full items-center justify-center'>
            <div className='text-center'>
              <div className='my-5 text-[35px] text-gray-700 font-medium'>Товар збережено !</div>
              <Button><Link href='/admin/dashboard'>Повернутися</Link></Button>
            </div>
          </div>
        :
      <> {product?
        <section className='px-10 py-20 w-full'>
            <h1 className="w-full text-heading1-bold drop-shadow-text-blue max-[440px]:text-center">Товар</h1>
            <div className="w-full h-[2px] bg-gray-400 mt-20 rounded-lg"></div>
            <form action="" className='flex flex-col mt-20' onSubmit={handleSubmit} >
          
              
              <label htmlFor="name" className='text-[20px] mb-5 font-medium'>Назва товару</label>
              <input type="text"
              className="p-2 border w-2/4 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
              id="name"
              value={product.name}
              onChange={(e)=>setProduct({...product, name:e.target.value})}
              />


              <label htmlFor="id" className='text-[20px] mb-5 font-medium mt-10'>Номер (ID)</label>
              <input type="text"
              className="p-2 border w-2/4 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
              id="id"
              value={product.id}
              onChange={(e)=>setProduct({...product, id:e.target.value})}
              />

              <label htmlFor="price" className='text-[20px] mb-5 font-medium mt-10'>Ціна</label>
              <input type="text"
              className="p-2 border w-2/4 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
              id="price"
              value={product.price}
              onChange={(e)=>setProduct({...product, price:e.target.value})}
              />


            <label htmlFor="priceToShow" className='text-[20px] mb-5 font-medium mt-10'>Ціна після знижки</label>
              <input type="text"
              className="p-2 border w-2/4 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
              id="priceToShow"
              value={product.priceToShow}
              onChange={(e)=>setProduct({...product, priceToShow:e.target.value})}
              />


            <label htmlFor="Категорія" className='text-[20px] mb-5 font-medium mt-10'>Категорія</label>
            <input type="text"
              className="p-2 border w-2/4 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
              id="Категорія"
              value={product.category}
              onChange={(e)=>setProduct({...product, category:e.target.value})}
            />

            <label htmlFor="Кількість" className='text-[20px] mb-5 font-medium mt-10'>Кількість</label>
            <input type="text"
              className="p-2 border w-2/4 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
              id="Кількість"
              value={product.quantity}
              onChange={(e)=>setProduct({...product, quantity:e.target.value})}
            />

            <label htmlFor="Постачальник" className='text-[20px] mb-5 font-medium mt-10'>Постачальник</label>
            <input type="text"
              className="p-2 border w-2/4 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
              id="Постачальник"
              value={product.vendor}
              onChange={(e)=>setProduct({...product, vendor:e.target.value})}
            />
              
              <label htmlFor="Опис" className='text-[20px] mb-5 font-medium mt-10 '>Опис</label>
              <textarea 
              name="Опис" 
              id="Опис" 
              className='w-2/4 border h-[300px] text-left p-2' 
              value={product.description.replace(/[^а-щьюяґєіїА-ЩЬЮЯҐЄІЇ0-9. ]/g, '')} 
              onChange={(e)=>setProduct({...product, description:e.target.value})}
              />

            <div className='mt-10 gap-5 flex justify-end w-2/4'>
              <Link href='/admin/dashboard'><Button variant='outline'>Повернутися</Button></Link>
              <Button type='submit'>Зберегти</Button>
            </div>

            </form>
        </section>
        :
          <section>
            <h1 className='text-[45px] text-center  font-bold leading-[65px]'>Товар не знайдено !</h1>

          </section>
        }
      </>
      }
    </>
  );
};

export default CatalogItem;