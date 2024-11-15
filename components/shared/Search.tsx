'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {useDebounce} from 'use-debounce'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppContext } from '@/app/(root)/context'
import Image from 'next/image'
import { trackFacebookEvent } from '@/helpers/pixel'

type SortParams = "default" | "low_price" | "hight_price"

const Search = ({searchParams}:any) => {
    const router = useRouter();
    const {catalogData, setCatalogData} = useAppContext();
    const [sort, setSort] = useState<SortParams>('default');
    const [searchText, setSearchText] = useState<string>("");
    const [debounce] = useDebounce(searchText,200)

   
    

    const textFromInput = (e:any)=>{
        setSearchText(e.target.value)
    }

     useEffect(()=>{
      setCatalogData({...catalogData, search:debounce, sort:sort});

      if(searchText.trim() != "") {
        trackFacebookEvent("Search", {
          search_string: debounce,
        });
      }
    },[debounce,sort])


    

  return (
    <>
      <div className='w-full flex gap-3 max-md:text-black'>
        <Image
          src="/assets/search.svg"
          width={24}
          height={24}
          alt="Seacrh"
        />
        <Input type='text' onChange={textFromInput}  placeholder='Пошук товару' />
      </div>
      <Select onValueChange={(element: SortParams) => setSort(element)} >
        <SelectTrigger className="w-[240px] max-[600px]:hidden">
          <SelectValue placeholder="Звичайне" />
        </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="default" >Звичайне</SelectItem>
              <SelectItem value="low_price" >Ціна(низька)</SelectItem>
              <SelectItem value="hight_price">Ціна(Висока)</SelectItem>   
            </SelectGroup>
          </SelectContent>
      </Select>
    </>
  )
}

export default Search