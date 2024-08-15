'use client'

import React, { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from "next/navigation"
import { useDebounce } from 'use-debounce'
import { useEffect } from 'react'
import { useAppContext } from "@/app/(root)/context"
import FilterButton from '@/components/shared/FilterButton'
import { useRef } from 'react';
import { Button } from '../ui/button'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link'


const Filter = ({maxPrice, minPrice, maxMin, vendors, series, color, Type, category, categories}:{maxPrice:number,minPrice:number, maxMin:Array<number>, vendors:Array<string>, series:Array<string>, color:Array<string>, Type:Array<string>, category:any, categories:Array<string>}) => {
    const {catalogData} = useAppContext();
    const [filter, setFilter] = useState({
      price:[minPrice, maxPrice],
      width:[maxMin[1], maxMin[0]],
      height:[maxMin[3], maxMin[2]],
      deep:[maxMin[5], maxMin[4]],
      vendor:[],
      series:[],
      color:[],
      type:[]
     
    })

  


    const router = useRouter()

    const [debounce] = useDebounce(filter,200)
  
    useEffect(()=>{
        
       router.push(`/catalog?${'page=1'}${catalogData.sort!=''?'&sort='+ catalogData.sort:''}${filter.color.length>0?'&color='+ filter.color:''}${filter.type.length>0?'&type='+ filter.type:''}${catalogData.search?'&search='+ catalogData.search:''}${filter.vendor.length>0?'&vendor='+filter.vendor:''}${filter.series.length>0?'&series='+filter.series:''}${filter.price[0]!=minPrice || filter.price[1]!=maxPrice ?'&minPrice='+ filter.price[0]+'&maxPrice='+ filter.price[1]:''}${filter.width[0]!= maxMin[1] || filter.width[1]!=maxMin[0] ?'&minWidth='+ filter.width[0]+'&maxWidth='+ filter.width[1]:''}${filter.height[0]!= maxMin[3] || filter.height[1]!=maxMin[2] ?'&minHeight='+ filter.height[0]+'&maxHeight='+ filter.height[1]:''}${filter.deep[0]!= maxMin[5] || filter.deep[1]!=maxMin[4] ?'&minDeep='+ filter.deep[0]+'&maxDeep='+ filter.deep[1]:''}${category?'&category='+category:''}
       `      
      ) 
    },[debounce, catalogData.sort, catalogData.search, category]) 

  useEffect(()=>{
        
   router.push(`/catalog?${'page='+ catalogData.pNumber}${catalogData.sort!=''?'&sort='+ catalogData.sort:''}${filter.color.length>0?'&color='+ filter.color:''}${filter.type.length>0?'&type='+ filter.type:''}${catalogData.search?'&search='+ catalogData.search:''}${filter.vendor.length>0?'&vendor='+filter.vendor:''}${filter.series.length>0?'&series='+filter.series:''}${filter.price[0]!=minPrice || filter.price[1]!=maxPrice ?'&minPrice='+ filter.price[0]+'&maxPrice='+ filter.price[1]:''}${filter.width[0]!= maxMin[1] || filter.width[1]!=maxMin[0] ?'&minWidth='+ filter.width[0]+'&maxWidth='+ filter.width[1]:''}${filter.height[0]!= maxMin[3] || filter.height[1]!=maxMin[2] ?'&minHeight='+ filter.height[0]+'&maxHeight='+ filter.height[1]:''}${filter.deep[0]!= maxMin[5] || filter.deep[1]!=maxMin[4] ?'&minDeep='+ filter.deep[0]+'&maxDeep='+ filter.deep[1]:''}${category?'&category='+category:''}
 
     `)
  },[catalogData.pNumber])

    
  useEffect(()=>{
    setFilter({...filter, price:[minPrice, maxPrice],height:[maxMin[3], maxMin[2]],width:[maxMin[1], maxMin[0]],deep:[maxMin[5], maxMin[4]]});
  },[category])

   

    const handleChange = (newValue: [number, number]) => {
      setFilter({...filter, price:newValue})
    };

    const handleCheckboxChange = (v:any) => {
      const selectedVendor = v; // Assuming the value of checkbox is the vendor name
      //@ts-ignore
      const isChecked = filter.vendor.includes(v);
  
      setFilter((prevFilter):any => {
        if (!isChecked) {
          // If checkbox is checked, add the selected vendor to the array
          return {
            ...prevFilter,
            vendor: [...prevFilter.vendor, selectedVendor]
          };
        } else {
          // If checkbox is unchecked, remove the selected vendor from the array
          return {
            ...prevFilter,
            vendor: prevFilter.vendor.filter(vendor => vendor !== selectedVendor)
          };
        }
      });
    };

    const handleSeries = (v:any) => {
      const selectedSeria = v; 
      //@ts-ignore
      const isChecked = filter.series.includes(v);
  
      setFilter((prevFilter):any => {
        if (!isChecked) {
          return {
            ...prevFilter,
            series: [...prevFilter.series, selectedSeria]
          };
        } else {
          return {
            ...prevFilter,
            series: prevFilter.series.filter(series => series !== selectedSeria)
          };
        }
      });
    };

    const handleColor = (v:any) => {
      const selectedColor = v; 
      //@ts-ignore
      const isChecked = filter.color.includes(v);
  
      setFilter((prevFilter):any => {
        if (!isChecked) {
          return {
            ...prevFilter,
            color: [...prevFilter.color, selectedColor]
          };
        } else {
          return {
            ...prevFilter,
            color: prevFilter.color.filter(color => color !== selectedColor)
          };
        }
      });
    };

    const handleType = (v:any) => {
      const selectedType = v; 
      //@ts-ignore
      const isChecked = filter.type.includes(v);
  
      setFilter((prevFilter):any => {
        if (!isChecked) {
          return {
            ...prevFilter,
            type: [...prevFilter.type, selectedType]
          };
        } else {
          return {
            ...prevFilter,
            type: prevFilter.type.filter(type => type !== selectedType)
          };
        }
      });
    };
  const divRef = useRef(null);
  const [bodyOverflow, setBodyOverflow] = useState(false);
  const toggleOverflow = (e:any) =>{
    if (divRef.current) {
      if (bodyOverflow) {
        document.body.style.overflow = 'auto';
        //@ts-ignore
        divRef.current.style.overflow = 'hidden';
        //@ts-ignore
        divRef.current.style.transform = `translateX(-100%)`
        e.target.style.transform = `translateX(0px)`
      } else {
        document.body.style.overflow = 'hidden';
        //@ts-ignore
        divRef.current.style.overflowY = 'auto';
        //@ts-ignore
        divRef.current.style.transform = `translateX(0%)`
        e.target.style.transform = `translateX(270px)`
      } 
    }
    setBodyOverflow(!bodyOverflow);
  };


  // useEffect(()=>{
    
  //   
   
  // },[maxPrice, minPrice,  maxMin])

  return (
    <>
    <Button onClick={(e)=>toggleOverflow(e)} className="fixed duration-300 left-0 top-36 rounded-none rounded-r md:hidden transition-all"><i className="fa fa-filter pointer-events-none"></i></Button>
    <div ref={divRef} className='transition-all duration-300 w-[25%] border-[1.5px] shadow-small pl-7 rounded-3xl max-md:w-[270px]  max-md:fixed max-md:bg-white  max-md:flex max-md:flex-col justify-center z-50 items-center max-md:overflow-y-scroll overflow-x-hidden max-md:h-full  max-md:translate-x-[-100%] top-0  left-0 ' >
      <div className='h-full max-md:w-[300px] max-md:pl-10 py-10'>
            <h2 className='text-[28px]'>{category?category.replace(/_/g, ' '):'Фільтр'}</h2>
            <div className='mt-4 max-md:w-[90%]'>
                <h3 className='text-[23px]'>Ціна</h3>
                <Slider
                  value={filter.price}
                  onValueChange={handleChange}
                  max={maxPrice}
                  min={minPrice}
                  step={1}
                  className={cn("w-[80%] mt-4")}/>
                  <div className='flex justify-between mt-4 w-[80%]'>
                    <input className='w-20 h-8 text-center border flex items-center justify-center' onChange={(e) => setFilter({...filter, price: [e.target.value !== "" ? parseFloat(e.target.value) : 0, maxPrice]})} value={filter.price[0]}/>
                    <input className='w-20 h-8 text-center border flex items-center justify-center' onChange={(e) => setFilter({...filter, price: [minPrice, e.target.value !== "" ? parseFloat(e.target.value): 0]})} value={filter.price[1]}/>
                  </div>
            </div>
            
            <div className='mt-4 border-b-2 pb-4 w-[90%] border-dashed '>
                <h3 className='text-[23px]'>Виробник</h3>
                  {vendors.map((v)=>(
                    <div className="flex items-center space-x-2 mt-4" key={v}>
                      <Checkbox id={v} onCheckedChange={(e)=>handleCheckboxChange(v)} />
                      <label
                        htmlFor={v}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {v}
                      </label>
                      </div>
                  ))}
                  
               
               
            </div>

            <div className='mt-4 pb-4 w-[90%] border-dashed '>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-[20px]'>Категорія</AccordionTrigger>
                  <AccordionContent>
                    <Link href='/catalog?category=' className='hover:underline max-lg:underline'>Всі категорії</Link>
                    {categories.map((t)=>(
                      <div className="flex items-center space-x-2 mt-4" key={t}>
                        <Link  href={'/catalog?category='+t.replace(/ /g, '_')} className='hover:underline max-lg:underline'>{t}</Link>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>







            <div className='mt-4 pb-4 w-[90%] border-dashed '>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-[20px]'>Вид</AccordionTrigger>
                  <AccordionContent>
                    {Type.map((t)=>(
                      <div className="flex items-center space-x-2 mt-4" key={t}>
                      <Checkbox id={t} onCheckedChange={()=>handleType(t)} />
                      <label
                        htmlFor={t}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t}
                      </label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='mt-4 pb-4 w-[90%] border-dashed '>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-[20px]'>Серія</AccordionTrigger>
                  <AccordionContent>
                    {series.map((s)=>(
                      <div className="flex items-center space-x-2 mt-4" key={s}>
                      <Checkbox id={s} onCheckedChange={()=>handleSeries(s)} />
                      <label
                        htmlFor={s}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {s}
                      </label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='mt-4 pb-4 w-[90%] border-dashed '>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-[20px]'>Колір</AccordionTrigger>
                  <AccordionContent>
                    {color.map((c)=>(
                      <div className="flex items-center space-x-2 mt-4" key={c}>
                      <Checkbox id={c} onCheckedChange={()=>handleColor(c)} />
                      <label
                        htmlFor={c}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {c}
                      </label>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='mt-4 max-md:w-[90%]'>
                <h3 className='text-[23px]'>Ширина</h3>
                <Slider
                  value={filter.width}
                  onValueChange={([min,max])=>{setFilter({...filter, width:[min,max]})}}
                  max={maxMin[0]}
                  min={maxMin[1]}
                  step={1}
                  className={cn("w-[80%] mt-4")}/>
                  <div className='flex justify-between mt-4 w-[80%]'>
                    <div className='w-20 h-8 border flex items-center justify-center'>{filter.width[0]}</div>
                    <div className='w-20 h-8 border flex items-center justify-center'>{filter.width[1]}</div>
                  </div>
            </div>
            <div className='mt-4 max-md:w-[90%]'>
                <h3 className='text-[23px]'>Висота</h3>
                <Slider
                  value={filter.height}
                  onValueChange={([min,max])=>{setFilter({...filter, height:[min,max]})}}
                  max={maxMin[2]}
                  min={maxMin[3]}
                  step={1}
                  className={cn("w-[80%] mt-4")}/>
                  <div className='flex justify-between mt-4 w-[80%]'>
                    <div className='w-20 h-8 border flex items-center justify-center'>{filter.height[0]}</div>
                    <div className='w-20 h-8 border flex items-center justify-center'>{filter.height[1]}</div>
                  </div>
            </div>
            <div className='mt-4 max-md:w-[90%] max-md:pb-36'>
                <h3 className='text-[23px]'>Глибина</h3>
                <Slider
                  value={filter.deep}
                  onValueChange={([min,max])=>{setFilter({...filter, deep:[min,max]})}}
                  max={maxMin[4]}
                  min={maxMin[5]}
                  step={1}
                  className={cn("w-[80%] mt-4")}/>
                  <div className='flex justify-between mt-4 w-[80%]'>
                    <div className='w-20 h-8 border flex items-center justify-center'>{filter.deep[0]}</div>
                    <div className='w-20 h-8 border flex items-center justify-center'>{filter.deep[1]}</div>
                  </div>
            </div>
            {/* <div className='mt-4 border-b-2 pb-4 w-[90%] border-dashed '>
                <h3 className='text-[23px]'>Акції</h3>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="5%"></Checkbox>
                  <label
                    htmlFor="5%"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Знижка 5%
                  </label>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="10%" />
                  <label
                    htmlFor="10%"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Знижка 10%
                  </label>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="15%" />
                  <label
                    htmlFor="15%"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Знижка 15%
                  </label>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox id="20%" />
                  <label
                    htmlFor="20%"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Знижка 20%
                  </label>
                </div>
            </div> */}
            </div>
        </div></>
  )
}

export default Filter