'use client'

import React, { useState } from 'react'
import { capitalize, cn } from '@/lib/utils'
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
  maxMin: {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    minDepth: number;
    maxDepth: number;
  }, 
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

type ParamsName = "width" | "height" | "depth";

type CheckParams = "vendor" | "series" | "color" | "type";

type Filter = {
  price: number[],
  width: {
    min: number,
    max: number
  },
  height: {
    min: number,
    max: number
  },
  depth: {
    min: number,
    max: number
  },
  vendor: string[],
  series: string[],
  color: string[],
  type: string[]
}

const Filter = ({maxPrice, minPrice, maxMin, vendors, series, color, Type, category, categories, counts}: Props) => {
  const {catalogData, setCatalogData} = useAppContext();
  const [filter, setFilter] = useState<Filter>({
    price:[minPrice, maxPrice],
    width: {
        min: maxMin.minWidth, 
        max: maxMin.maxWidth,
    },
    height: {
      min: maxMin.minHeight, 
      max: maxMin.maxHeight,
    },
    depth: {
      min: maxMin.minDepth, 
      max: maxMin.maxDepth,
    },
    vendor:[],
    series:[],
    color:[],
    type:[]
  })
  const [screenWidth, setScreenWidth] = useState(0);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [sort, setSort] = useState('default');

  useEffect(()=>{
    setCatalogData({...catalogData, sort:sort});
  },[sort])

  const router = useRouter()

  const [debounce] = useDebounce(filter,200)
  
  useEffect(()=>{
     router.push(`/catalog?${'page=1'}${catalogData.sort!=''?'&sort='+ catalogData.sort:''}${filter.color.length>0?'&color='+ filter.color:''}${filter.type.length>0?'&type='+ filter.type:''}${catalogData.search?'&search='+ catalogData.search:''}${filter.vendor.length>0?'&vendor='+filter.vendor:''}${filter.series.length>0?'&series='+filter.series:''}${filter.price[0]!=minPrice || filter.price[1]!=maxPrice ?'&minPrice='+ filter.price[0]+'&maxPrice='+ filter.price[1]:''}${filter.width.min!= maxMin.minWidth || filter.width.max!=maxMin.maxWidth ?'&minWidth='+ filter.width.min+'&maxWidth='+ filter.width.max:''}${filter.height.min!= maxMin.minHeight || filter.height.max!=maxMin.maxHeight ?'&minHeight='+ filter.height.min+'&maxHeight='+ filter.height.max:''}${filter.depth.min!= maxMin.minDepth || filter.depth.max!=maxMin.maxDepth ?'&minDepth='+ filter.depth.min+'&maxDepth'+ filter.depth.max:''}${category?'&category='+category:''}
     `      
    ) 
  },[debounce, catalogData.sort, catalogData.search, category]) 

  useEffect(()=>{
        
   router.push(`/catalog?${'page='+ catalogData.pNumber}${catalogData.sort!=''?'&sort='+ catalogData.sort:''}${filter.color.length>0?'&color='+ filter.color:''}${filter.type.length>0?'&type='+ filter.type:''}${catalogData.search?'&search='+ catalogData.search:''}${filter.vendor.length>0?'&vendor='+filter.vendor:''}${filter.series.length>0?'&series='+filter.series:''}${filter.price[0]!=minPrice || filter.price[1]!=maxPrice ?'&minPrice='+ filter.price[0]+'&maxPrice='+ filter.price[1]:''}${filter.width.min!= maxMin.minWidth || filter.width.max!=maxMin.maxWidth ?'&minWidth='+ filter.width.min+'&maxWidth='+ filter.width.max:''}${filter.height.min!= maxMin.minHeight || filter.height.max!=maxMin.maxHeight ?'&minHeight='+ filter.height.min+'&maxHeight='+ filter.height.max:''}${filter.depth.min!= maxMin.minDepth || filter.depth.max!=maxMin.maxDepth ?'&minDepth='+ filter.depth.min+'&maxDepth'+ filter.depth.max:''}${category?'&category='+category:''}
 
     `)
  },[catalogData.pNumber])

  useEffect(() => {
    const currentScreenWidth = window.screen.width;

    setScreenWidth(currentScreenWidth);
  }, [])
    
  useEffect(()=>{
    setFilter({...filter, price:[minPrice, maxPrice], height: { min: maxMin.minHeight, max: maxMin.maxHeight }, width: { min: maxMin.minWidth, max: maxMin.maxWidth }, depth:{ min:maxMin.minDepth, max: maxMin.maxDepth }});
  },[category])

   

  const handleChange = (newValue: [number, number]) => {
    setFilter({...filter, price:newValue})
  };

  const handleCheckboxChange = (checkParam: CheckParams, value: string) => {
    const isChecked = filter[checkParam].includes(value);

    setFilter((prevFilter):any => {
      if (!isChecked) {
        return {...prevFilter, [checkParam]: [...prevFilter[checkParam], value]};
      } else {
        return {...prevFilter, [checkParam]: prevFilter[checkParam].filter(param => param !== value)};
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

  function handleSlider(paramName: ParamsName, setting: "min" | "max", value: string) {
   if (value !== "") {
    const floatedValue = parseFloat(value)
    setFilter((prev) => ({...prev, [paramName]: { ...prev[paramName], [setting]: floatedValue}}))
   } else {
    setFilter((prev) => ({...prev, [paramName]: { ...prev[paramName], [setting]: 0}}));
   }
  }

  const handleInputUnfocus = (paramName: ParamsName, setting: 'min' | "max") => {
    const capitalizedParamName = capitalize(paramName);

    const minValue = maxMin[`min${capitalizedParamName}` as keyof typeof maxMin];
    const maxValue = maxMin[`max${capitalizedParamName}` as keyof typeof maxMin];

    const currentValue = filter[paramName][setting];

    if(currentValue < minValue || currentValue > maxValue) {
      setFilter((prev) => ({...prev, [paramName]: {...prev[paramName], [setting]: maxMin[(setting + capitalizedParamName) as keyof typeof maxMin]}}))
    }
  }

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
                        <Checkbox id={vendor} onCheckedChange={()=> handleCheckboxChange("vendor", vendor)} className="size-5 rounded-md border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white"/>
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
                        <Checkbox id={type} onCheckedChange={() => handleCheckboxChange("type", type)} className="size-5 rounded-md border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white"/>
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
                        <Checkbox id={seria} onCheckedChange={() => handleCheckboxChange("series", seria)} className="size-5 rounded-md border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white"/>
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
                        <Checkbox id={color} onCheckedChange={() => handleCheckboxChange("color", color)} className="size-5 rounded-md border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white"/>
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
                        value={Object.values(filter.width)}
                        onValueChange={([min,max])=>{setFilter({...filter, width:{ min, max }})}}
                        max={maxMin.maxWidth}
                        min={maxMin.minWidth}
                        step={1}
                        className={cn("w-full mt-4")}
                      />
                      <div className='flex justify-between mt-7 w-full'>
                        <div>
                          <label htmlFor="minWidth">Від</label>
                          <input 
                           className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' 
                           onChange={(e) => handleSlider("width", "min", e.target.value)} 
                           value={`${filter.width.min}`} 
                           onBlur={() => handleInputUnfocus("width", "min")} 
                           id="minWidth"
                          />
                        </div>
                        <div>
                          <label htmlFor="maxWidth">До</label>
                          <input 
                           className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' 
                           onChange={(e) => handleSlider("width", "max", e.target.value)}  
                           value={`${filter.width.max}`} 
                           onBlur={() => handleInputUnfocus("width", "max")} 
                           id="maxWidth"
                          />
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
                        value={Object.values(filter.height)}
                        onValueChange={([min,max])=>{setFilter({...filter, height:{ min, max }})}}
                        max={maxMin.maxHeight}
                        min={maxMin.minHeight}
                        step={1}
                        className={cn("w-full mt-4")}
                      />
                      <div className='flex justify-between mt-7 w-full'>
                        <div>
                          <label htmlFor="minHeight">Від</label>
                          <input 
                           className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' 
                           onChange={(e) => handleSlider("height", "min", e.target.value)} 
                           value={`${filter.height.min}`} 
                           onBlur={() => handleInputUnfocus("height", "min")} 
                           id="minHeight"
                          />
                        </div>
                        <div>
                          <label htmlFor="maxHeight">До</label>
                          <input 
                           className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' 
                           onChange={(e) => handleSlider("height", "max", e.target.value)} 
                           value={`${filter.height.max}`} 
                           onBlur={() => handleInputUnfocus("height", "max")} 
                           id="maxHeight"
                          />
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
                        value={Object.values(filter.depth)}
                        onValueChange={([min,max])=>{setFilter({...filter, depth:{ min, max }})}}
                        max={maxMin.maxDepth}
                        min={maxMin.minDepth}
                        step={1}
                        className={cn("w-full mt-4")}
                      />
                      <div className='flex justify-between mt-7 w-full'>
                        <div>
                          <label htmlFor="mindepth">Від</label>
                          <input 
                           className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' 
                           onChange={(e) => handleSlider("depth", "min", e.target.value)} 
                           value={`${filter.depth.min}`} 
                           onBlur={() => handleInputUnfocus("depth", "min")} 
                           id="minDepth"
                          />
                        </div>
                        <div>
                          <label htmlFor="maxdepth">До</label>
                          <input 
                           className='w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl' 
                           onChange={(e) => handleSlider("depth", "max", e.target.value)} 
                           value={`${filter.depth.max}`} 
                           onBlur={() => handleInputUnfocus("depth", "max")} id="maxDepth"
                          />
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