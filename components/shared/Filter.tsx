'use client'

import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { capitalize, cn, createSearchString } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from 'use-debounce'
import { useEffect } from 'react'
import { useAppContext } from "@/app/(root)/context"
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
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import ClearFilterButton from '../interface/ClearFilterButton'

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
  checkParams: {
    vendors: string[], 
    series: string[], 
    colors: string[], 
    types: string[], 
    categories: string[],
  },
  category:any, 
  counts: {
    categoriesCount: { [key: string]: number },
    vendorsCount: { [key: string]: number },
    typesCount: { [key: string]: number },
    seriesCount: { [key: string]: number },
    colorsCount: { [key: string]: number}
  } 
}

const params = ["width", "height", "depth"] as const;
const paramsUa = { width: "Ширина", height: "Висота", depth: "Глибина" };
type ParamsName = typeof params[number];

const checkParamsNames = ["categories", "vendors", "series", "colors", "types"] as const;
const checkParamsNamesUa = { categories: "Категорії", vendors: "Виробник", series: "Серія", colors: "Колір", types: "Вид" };
type CheckParams = typeof checkParamsNames[number];

type FilterType = {
  page: string,
  price: [number, number],
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
  categories: string[]
  vendors: string[],
  series: string[],
  colors: string[],
  types: string[]
}

const Filter = ({ maxPrice, minPrice, maxMin, checkParams, category, counts }: Props) => {
  const {catalogData, setCatalogData} = useAppContext();
  const [filter, setFilter] = useState<FilterType>({
    page: "1",
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
    categories: [],
    vendors:[],
    series:[],
    colors:[],
    types:[]
  })
  const [screenWidth, setScreenWidth] = useState(0);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [sort, setSort] = useState('default');
  const [debounce] = useDebounce(filter, 200);

  const router = useRouter();
  const search = useSearchParams();
  const page = useSearchParams().get("page");
  
  useEffect(()=>{
    setCatalogData({...catalogData, sort:sort});
  },[sort])
  
  useEffect(() => {
    const searchParams = Object.fromEntries(search.entries());
    
    setFilter((...prev) => ({
      ...prev,
      page: page || "1",
      price: [
        parseFloat(searchParams.minPrice || minPrice.toString()),
        parseFloat(searchParams.maxPrice || maxPrice.toString()),
      ],
      width: {
        min: parseFloat(searchParams.minWidth || maxMin.minWidth.toString()),
        max: parseFloat(searchParams.maxWidth || maxMin.maxWidth.toString()),
      },
      height: {
        min: parseFloat(searchParams.minHeight || maxMin.minHeight.toString()),
        max: parseFloat(searchParams.maxHeight || maxMin.maxHeight.toString()),
      },
      depth: {
        min: parseFloat(searchParams.minDepth || maxMin.minDepth.toString()),
        max: parseFloat(searchParams.maxDepth || maxMin.maxDepth.toString()),
      },
      categories: searchParams.category ? searchParams.category.split(","): [],
      colors: searchParams.color ? searchParams.color.split(',') : [],
      types: searchParams.type ? searchParams.type.split(',') : [],
      vendors: searchParams.vendor ? searchParams.vendor.split(',') : [],
      series: searchParams.series ? searchParams.series.split(',') : [],
    }))
    
    setSort(searchParams.sort || "default")
  }, [search, minPrice, maxPrice, maxMin, checkParams, category, counts]);
  

  useEffect(() => {
    // Handle filter changes, reset to page 1
    const searchString = createSearchString({
      pNumber: filter.page, // Reset to page 1 on filter change
      sort,
      categories: filter.categories,
      colors: filter.colors,
      types: filter.types,
      vendors: filter.vendors,
      series: filter.series,
      search: catalogData.search,
      price: filter.price,
      width: filter.width,
      height: filter.height,
      depth: filter.depth,
      category,
      minPrice,
      maxPrice,
      maxMin,
    });
    router.push(`/catalog?${searchString}`);
  }, [debounce, sort, catalogData.search, category]);  

  const handleChange = (newValue: [number, number]) => {
    setFilter({...filter, page: "1", price:newValue})
  };

  const handleCheckboxChange = (checkParam: CheckParams, value: string) => {
    const isChecked = filter[checkParam].includes(value);

    setFilter((prevFilter):any => {
      if (!isChecked) {
        return {...prevFilter, page: "1", [checkParam]: [...prevFilter[checkParam], value]};
      } else {
        return {...prevFilter, page: "1", [checkParam]: prevFilter[checkParam].filter(param => param !== value)};
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

  return (
    <>
    <Button ref={filterButtonRef} onClick={(e)=>toggleOverflow(e)} className="fixed duration-300 left-0 top-36 rounded-none rounded-r md:hidden transition-all"><i className="fa fa-filter pointer-events-none"></i></Button>
    <div ref={divRef} className='transition-all duration-300 w-[25%] border-[1.5px] shadow-small px-5 rounded-3xl max-[1023px]:w-[30%] max-[850px]:w-[35%] max-[1080px]:px-3 max-[880px]:px-2 max-md:w-[300px] max-md:rounded-l-none max-md:fixed max-md:bg-white  max-md:flex max-md:flex-col justify-center z-50 items-center max-md:overflow-y-scroll overflow-x-hidden max-md:h-full  max-md:translate-x-[-100%] max-[360px]:w-full max-[360px]:rounded-none top-0  left-0 ' >
      <div className='h-full max-md:w-[270px] py-10'>
          <div className="w-full h-fit flex justify-between"> 
            <h2 className='text-[28px]'>Фільтр</h2>
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

            {checkParamsNames.map((param) => (
              <div key={param} className='mt-4 pb-4 w-full'>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className='text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3'>{checkParamsNamesUa[param]}</AccordionTrigger>
                    <AccordionContent className="pl-3">
                      {checkParams[param].map((value, index)=>(
                        <div key={index} className="w-full h-fit flex justify-between items-center">
                        <div className="flex items-center space-x-2 mt-4">
                          <Checkbox 
                           id={value} 
                           className="size-5 rounded-md border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white"
                           onCheckedChange={()=> handleCheckboxChange(param, value)} 
                           checked={filter[param].includes(value)}
                          />
                          <label
                            htmlFor={value}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {value}
                          </label>
                          </div>
                          <p className="w-fit text-small-medium text-blue drop-shadow-xl mt-3 px-4">{counts[`${param}Count` as keyof typeof counts][value]}</p>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}

          {params.map((param, index) => {
            const capitalizedParam = capitalize(param);

            return (
              <div className='mt-4 pb-4 w-full' key={index}>
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-[18px] bg-zinc-100 rounded-3xl font-medium py-[6px] px-3">{paramsUa[param]}</AccordionTrigger>
                    <AccordionContent className="flex flex-col items-center shrink-0 px-3">
                      <Slider
                          value={Object.values(filter[param])}
                          onValueChange={([min,max])=>{setFilter({...filter, [param]:{ min, max }})}}
                          max={maxMin[("max" + capitalizedParam) as keyof typeof maxMin]}
                          min={maxMin[("min" + capitalizedParam) as keyof typeof maxMin]}
                          step={1}
                          className={cn("w-full mt-4")}
                        />
                        <div className='flex justify-between mt-7 w-full'>
                          <FilterInput
                          paramName={param}
                          setting="min"
                          maxMin={maxMin}
                          filter={filter}
                          setFilter={setFilter}
                          />
                          <FilterInput
                          paramName={param}
                          setting="max"
                          maxMin={maxMin}
                          filter={filter}
                          setFilter={setFilter}
                          />
                        </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )
          })}

          <div className="pb-5">
            <ClearFilterButton />
          </div>
          </div>
        </div>
    </>
  )
}

export default Filter

const FilterInput = ({ paramName, setting, maxMin, filter, setFilter }: { paramName: ParamsName, setting: "min" | "max", maxMin: Props["maxMin"], filter: FilterType, setFilter: Dispatch<SetStateAction<FilterType>>}) => {
  const [inputValue, setInputValue] = useState<string>(filter[paramName][setting].toString());

  // Track the input change in local state
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    setInputValue(filter[paramName][setting].toString());
  }, [filter[paramName][setting]]);

  const handleInputUnfocus = () => {
    const floatedValue = parseFloat(inputValue);
    const capitalizedParamName = capitalize(paramName);

    const minValue = maxMin[`min${capitalizedParamName}` as keyof typeof maxMin];
    const maxValue = maxMin[`max${capitalizedParamName}` as keyof typeof maxMin];

    const currentValue = filter[paramName][setting];

    // If the value is outside bounds or invalid, reset to the boundary value
    if (floatedValue < minValue || floatedValue > maxValue || isNaN(floatedValue)) {
      const boundaryValue = maxMin[(setting + capitalizedParamName) as keyof typeof maxMin];
      setFilter((prev) => ({
        ...prev,
        [paramName]: { ...prev[paramName], [setting]: boundaryValue }
      }));
      setInputValue(boundaryValue.toString());
    } else {
      setFilter((prev) => ({
        ...prev,
        [paramName]: { ...prev[paramName], [setting]: floatedValue }
      }));
    }
  };

  return (
    <div>
      <label htmlFor={`${setting}-${paramName}`}>{setting === "min" ? "Від" : "До"}</label>
      <input
        className="w-20 h-8 mt-2 text-center border flex items-center justify-center rounded-2xl"
        value={inputValue} // Bind inputValue to the input field
        onChange={handleChange} // Update local state on change
        onBlur={handleInputUnfocus} // Update global filter state on blur
        id={`${setting}-${paramName}`}
      />
    </div>
  );
};
