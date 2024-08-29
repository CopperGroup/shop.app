'use client'

import React, { useState } from 'react'
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
import { Slider } from '../ui/slider'
import { Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'

interface Props {
  maxPrice:number,
  minPrice:number, 
  maxMin:Array<number>, 
  vendors:Array<string>, 
  series:Array<string>, 
  color:Array<string>, 
  Type:Array<string>, 
  category:any, 
  categories:Array<string>,
  counts: {
    vendorCount: { [key: string]: number },
    categoryCount: { [key: string]: number },
    typeCount: { [key: string]: number },
    seriesCount: { [key: string]: number },
    colorCount: { [key: string]: number}
  } 
}

const Filter = ({maxPrice, minPrice, maxMin, vendors, series, color, Type, category, categories, counts}: Props) => {
    const {catalogData, setCatalogData} = useAppContext();
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
    const [ screenWidth, setScreenWidth ] = useState(0);
    const filterButtonRef = useRef<HTMLButtonElement>(null);
    const [sort, setSort] = useState('default');
   

     useEffect(()=>{
      setCatalogData({...catalogData, sort:sort});
    },[sort])


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

  useEffect(() => {
    const currentScreenWidth = window.screen.width;

    setScreenWidth(currentScreenWidth);
  }, [])
    
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
  const divRef = useRef<HTMLDivElement>(null);
  const [bodyOverflow, setBodyOverflow] = useState(false);
  const toggleOverflow = (e:any) =>{
    if (divRef.current) {
      if (bodyOverflow) {
        document.body.style.overflow = 'auto';
        //@ts-ignore
        divRef.current.style.overflow = 'hidden';
        //@ts-ignore
        divRef.current.style.transform = `translateX(-100%)`
        if(screenWidth <= 360) {
          if(filterButtonRef.current) {
            filterButtonRef.current.style.display = "block";
            filterButtonRef.current.style.transform = `translateX(0px)`;
          }
        } else {
          e.target.style.transform = `translateX(0px)`;
        }
      } else {
        document.body.style.overflow = 'hidden';
        //@ts-ignore
        divRef.current.style.overflowY = 'auto';
        //@ts-ignore
        divRef.current.style.transform = `translateX(0%)`
        e.target.style.transform = `translateX(300px)`
        if(screenWidth <= 360) {
          e.target.style.display = "none";
        }
      } 
    }
    setBodyOverflow(!bodyOverflow);
  };


  // useEffect(()=>{
    
  //   
   
  // },[maxPrice, minPrice,  maxMin])

  return (
    <>
    <Button ref={filterButtonRef} onClick={(e)=>toggleOverflow(e)} className="fixed duration-300 left-0 top-36 rounded-none rounded-r md:hidden transition-all"><i className="fa fa-filter pointer-events-none"></i></Button>
    <div ref={divRef} className='transition-all duration-300 w-[25%] border-[1.5px] shadow-small px-5 rounded-3xl max-[1023px]:w-[30%] max-[850px]:w-[35%] max-[1080px]:px-3 max-[880px]:px-2 max-md:w-[300px] max-md:rounded-l-none max-md:fixed max-md:bg-white  max-md:flex max-md:flex-col justify-center z-50 items-center max-md:overflow-y-scroll overflow-x-hidden max-md:h-full  max-md:translate-x-[-100%] max-[360px]:w-full max-[360px]:rounded-none top-0  left-0 ' >
      <div className='h-full max-md:w-[270px] py-10'>
          <div className="w-full h-fit flex justify-between"> 
            <h2 className='text-[28px]'>{category?category.replace(/_/g, ' '):'Фільтр'}</h2>
            <Button onClick={(e)=>toggleOverflow(e)} className="duration-300 size-12 rounded-full md:hidden transition-all min-[361px]:hidden"><i className="fa fa-filter pointer-events-none"></i></Button>
          </div>
            
            <div className='mt-4 pb-4 w-full'>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3">Ціна</AccordionTrigger>
                  <AccordionContent className="flex flex-col items-center shrink-0 px-3">
                    <Slider
                        value={filter.price}
                        onValueChange={handleChange}
                        max={maxPrice}
                        min={minPrice}
                        step={1}
                        className={cn("w-full mt-4")}
                      />
                      <div className='flex gap-1 justify-between mt-7 w-full'>
                        <div>
                          <label htmlFor="minPrice">Від</label>
                          <input className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' onChange={(e) => setFilter({...filter, price: [e.target.value !== "₴" ? parseFloat(e.target.value.slice(1)) : 0, maxPrice]})} value={`₴${filter.price[0]}`} id="minPrice"/>
                        </div>
                        <div>
                          <label htmlFor="maxPrice">До</label>
                          <input className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' onChange={(e) => setFilter({...filter, price: [minPrice, e.target.value !== "₴" ? parseFloat(e.target.value.slice(1)): 0]})} value={`₴${filter.price[1]}`} id="maxPrice"/>
                        </div>
                      </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            
            <div className='mt-4 pb-4 w-full min-[601px]:hidden'>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3'>Сортування</AccordionTrigger>
                  <AccordionContent className="px-3">
                  <RadioGroup className="py-3" onValueChange={(element)=>setSort(element)} defaultValue="default">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="default" id="default" />
                      <Label htmlFor="default">Default</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low_price" id="low_price" />
                      <Label htmlFor="low_price">Ціна(низька)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hight_price" id="hight_price" />
                      <Label htmlFor="hight_price">Ціна(Висока)</Label>
                    </div>
                  </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='mt-4 pb-4 w-full'>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3'>Виробник</AccordionTrigger>
                  <AccordionContent className="pl-3">
                    {vendors.map((vendor, index)=>(
                      <div key={index} className="w-full h-fit flex justify-between items-center">
                      <div className="flex items-center space-x-2 mt-4">
                        <Checkbox id={vendor} onCheckedChange={(e)=> handleCheckboxChange(vendor)} className="size-5 rounded-md border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white"/>
                        <label
                          htmlFor={vendor}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {vendor}
                        </label>
                        </div>
                        <p className="w-fit text-small-medium text-blue drop-shadow-xl mt-3 px-4">{counts.vendorCount[vendor]}</p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='mt-4 pb-4 w-full'>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3'>Категорія</AccordionTrigger>
                  <AccordionContent className="mt-3 pl-3">
                    <Link href='/catalog?category=' className='hover:underline max-lg:underline'>Всі категорії</Link>
                    {categories.map((category, index)=>(
                      <div className="w-full flex justify-between items-center space-x-2 mt-4" key={index}>
                        <Link  href={'/catalog?category='+category.replace(/ /g, '_')} className='leading-[103%] hover:underline max-lg:underline'>{category}</Link>
                        <p className="w-fit text-small-medium text-end text-blue drop-shadow-xl px-4">{counts.categoryCount[category]}</p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>







            <div className='mt-4 pb-4 w-full'>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3'>Вид</AccordionTrigger>
                  <AccordionContent className="pl-3">
                    {Type.map((type, index)=>(
                      <div key={index} className="w-full h-fit flex justify-between items-center">
                        <div className="flex items-center space-x-2 mt-4">
                        <Checkbox id={type} onCheckedChange={()=>handleType(type)} className="size-5 rounded-md border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white"/>
                        <label
                          htmlFor={type}
                          className="text-sm leading-[103%] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </label>
                        </div>
                        <p className="w-fit text-small-medium text-blue drop-shadow-xl mt-3 px-4">{counts.typeCount[type]}</p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='w-full mt-4 pb-4'>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3'>Серія</AccordionTrigger>
                  <AccordionContent className="pl-3">
                    {series.map((seria, index)=>(
                      <div key={index} className="w-full h-fit flex justify-between items-center">
                        <div className="flex items-center space-x-2 mt-4">
                        <Checkbox id={seria} onCheckedChange={()=>handleSeries(seria)} className="size-5 rounded-md border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white"/>
                        <label
                          htmlFor={seria}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {seria}
                        </label>
                        </div>
                        <p className="w-fit text-small-medium text-blue drop-shadow-xl mt-3 px-4">{counts.seriesCount[seria]}</p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='w-full mt-4 pb-4'>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className='text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3'>Колір</AccordionTrigger>
                  <AccordionContent className="pl-3">
                    {color.map((color, index)=>(
                      <div key={index} className="w-full h-fit flex justify-between items-center">
                        <div className="flex items-center space-x-2 mt-4">
                        <Checkbox id={color} onCheckedChange={()=>handleColor(color)} className="size-5 rounded-md border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white"/>
                        <label
                          htmlFor={color}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {color}
                        </label>
                        </div>
                        <p className="w-fit text-small-medium text-blue drop-shadow-xl mt-3 px-4">{counts.colorCount[color]}</p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='mt-4 pb-4 w-full'>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3">Ширина</AccordionTrigger>
                  <AccordionContent className="flex flex-col items-center shrink-0 px-3">
                    <Slider
                        value={filter.width}
                        onValueChange={([min,max])=>{setFilter({...filter, width:[min,max]})}}
                        max={maxMin[0]}
                        min={maxMin[1]}
                        step={1}
                        className={cn("w-full mt-4")}
                      />
                      <div className='flex justify-between mt-7 w-full'>
                        <div>
                          <label htmlFor="minWidth">Від</label>
                          <input className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' onChange={(e) => setFilter({...filter, width: [e.target.value !== "" ? parseFloat(e.target.value.slice(1)) : 0, maxMin[0]]})} value={`${filter.width[0]}`} id="minWidth"/>
                        </div>
                        <div>
                          <label htmlFor="maxWidth">До</label>
                          <input className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' onChange={(e) => setFilter({...filter, width: [maxMin[1], e.target.value !== "" ? parseFloat(e.target.value.slice(1)): 0]})} value={`${filter.width[1]}`} id="maxWidth"/>
                        </div>
                      </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='mt-4 pb-4 w-full'>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3">Висота</AccordionTrigger>
                  <AccordionContent className="flex flex-col items-center shrink-0 px-3">
                    <Slider
                        value={filter.height}
                        onValueChange={([min,max])=>{setFilter({...filter, height:[min,max]})}}
                        max={maxMin[2]}
                        min={maxMin[3]}
                        step={1}
                        className={cn("w-full mt-4")}
                      />
                      <div className='flex justify-between mt-7 w-full'>
                        <div>
                          <label htmlFor="minHeight">Від</label>
                          <input className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' onChange={(e) => setFilter({...filter, height: [e.target.value !== "" ? parseFloat(e.target.value.slice(1)) : 0, maxMin[2]]})} value={`${filter.height[0]}`} id="minHeight"/>
                        </div>
                        <div>
                          <label htmlFor="maxHeight">До</label>
                          <input className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' onChange={(e) => setFilter({...filter, height: [maxMin[3], e.target.value !== "" ? parseFloat(e.target.value.slice(1)): 0]})} value={`${filter.height[1]}`} id="maxHeight"/>
                        </div>
                      </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className='mt-4 pb-4 w-full'>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3">Глибина</AccordionTrigger>
                  <AccordionContent className="flex flex-col items-center shrink-0 px-3">
                    <Slider
                        value={filter.deep}
                        onValueChange={([min,max])=>{setFilter({...filter, deep:[min,max]})}}
                        max={maxMin[4]}
                        min={maxMin[5]}
                        step={1}
                        className={cn("w-full mt-4")}
                      />
                      <div className='flex justify-between mt-7 w-full'>
                        <div>
                          <label htmlFor="minDeep">Від</label>
                          <input className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' onChange={(e) => setFilter({...filter, deep: [e.target.value !== "" ? parseFloat(e.target.value.slice(1)) : 0, maxMin[4]]})} value={`${filter.deep[0]}`} id="minDeep"/>
                        </div>
                        <div>
                          <label htmlFor="maxDeep">До</label>
                          <input className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' onChange={(e) => setFilter({...filter, deep: [maxMin[5], e.target.value !== "" ? parseFloat(e.target.value.slice(1)): 0]})} value={`${filter.deep[1]}`} id="maxDeep"/>
                        </div>
                      </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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