'use client'

import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  import { 
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'
import Link from 'next/link'



const ProductsTable =  ({stringifiedProducts}:{stringifiedProducts:string}) => {
 
  
  const products = JSON.parse(stringifiedProducts)

  const [first, setFirst] = useState(0);
  const [last, setLast] = useState(9);
  const [pageNumber, setPageNumber] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [select, setSelect] = useState('');
  const [filtredProducts, setFiltredProducts] = useState([]);

  const router = useRouter();




 

 
  useEffect(()=>{
    if(select!='Всі' && select!=''){
      setFiltredProducts(products
      .filter((product:any)=> product.category == select )
      .filter((product:any) => product.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1)
    )
    }else{
      setFiltredProducts(products.filter((product:any) => product.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1))
    }
  },[select, inputValue])
  
  useEffect(()=>{
    setFiltredProducts(products)
  },[])

  const next = ()=>{
    setFirst(first+9);
    setLast(last+9)
    setPageNumber(pageNumber+1)
  }

  const back = ()=>{
    setFirst(first-9);
    setLast(last-9)
    setPageNumber(pageNumber-1)
  }

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'UAH',
    });
 

  return (
    <>

      
        
        <div className="flex gap-5 items-center mt-12 max-[425px]:flex-col">
          <Input
            className=" w-full"
            placeholder="Назва товару..."
            onChange={(e)=>setInputValue(e.target.value)}
            value={inputValue}
          />

          <Select onValueChange={(element)=>setSelect(element)}>
            <SelectTrigger className="w-[10.2rem] max-[425px]:w-full">
              <SelectValue placeholder="Всі категорії" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Всі">Всі категорії</SelectItem>
                <SelectItem value="Меблі для ванної кімнати">Меблі для ванної кімнати</SelectItem>
                <SelectItem value="Житлові меблі">Житлові меблі</SelectItem>
                <SelectItem value="Дитячі меблі">Дитячі меблі</SelectItem>
                <SelectItem value="Сад та город">Сад та город</SelectItem>
                <SelectItem value="Сантехніка">Сантехніка</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>


        <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Постачальник</TableHead>
            <TableHead>Назва</TableHead>
            <TableHead>Доступний</TableHead>
            <TableHead className="text-right">Ціна без знижки</TableHead>
            <TableHead className="text-right">Ціна із знижкою</TableHead>
          </TableRow>
        </TableHeader>
        
       
        <TableBody>
          {filtredProducts
          .slice(first,last).map((product:any)=>(
          
          <TableRow key={product.id} className="cursor-pointer hover:bg-slate-50 transition-all" onClick={()=>router.push(`/admin/createProduct/list/${product.id}`)}>
             
            <TableCell className="font-medium">{product.id}</TableCell>
            <TableCell>{product.vendor}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{product.isAvailable?'Так':'Ні'}</TableCell>
            <TableCell className="text-right font-medium">{formatter.format(product.price)}</TableCell>
            <TableCell className="text-right text-red-600 font-medium">{formatter.format(product.priceToShow)}</TableCell>
            
          </TableRow>
    
          ))}
          
        </TableBody> 
    
      </Table>
      <div className="mt-2 flex gap-5 ml-auto w-fit">
          {first>0?
          <Button variant='outline' onClick={back}>Попередня</Button>
          :
          <Button variant='outline' className='border bg-gray-50 border-gray-300 text-gray-300 pointer-events-none ' onClick={back}>Попередня</Button>
          }
          {pageNumber<Math.ceil(filtredProducts.length/9)?
          <Button onClick={next}>Наступна</Button>
          :
          <Button onClick={next} className='border bg-gray-50 border-gray-300 text-gray-300 pointer-events-none '>Наступна</Button>
          }
          
      </div>
      
   
    </>
  )
}

export default ProductsTable