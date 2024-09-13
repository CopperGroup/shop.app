'use server'

import React, { Suspense } from 'react'
import Filter from '@/components/shared/Filter'
import ProductCard from '@/components/cards/ProductCard'
import Search from '@/components/shared/Search'
import PaginationForCatalog from '@/components/shared/PaginationForCatalog'
import FilterButton from '@/components/shared/FilterButton' 
import { useEffect } from 'react'
import Loading from '@/components/loadings/Loading'


import { fetchAllProducts } from '@/lib/actions/product.actions'
import Link from 'next/link'
import { getSession } from '@/lib/getServerSession'
import BannerSmall from '@/components/banner/BannerSmall'
import { redis } from '@/lib/redis'
import { ProductType } from '@/lib/types/types'
import { createCatalogChunks, fetchCatalog } from '@/lib/actions/redis/catalog.actions'


const catalog = async ({searchParams,data}:any) => {


  let filtredProducts: any[] = await fetchCatalog();
  console.log('gh')

  // await createCatalogChunks(filtredProducts);

  // await fetchCatalog();

  const email = await getSession()

  const category = Array.from(new Set (filtredProducts.map(item => item.category))).filter(function(item) {return item !== '';});
  console.log(category)


  if(searchParams.category){
    filtredProducts =filtredProducts.filter(obj => obj.category === searchParams.category.replace(/_/g, ' '));
  }  


  let vendorCount: { [key: string]: number } = {};

  filtredProducts.forEach(product => {
    const vendor = product.vendor;
    if (vendor) {
      vendorCount[vendor] = (vendorCount[vendor] || 0) + 1;
    }
  });

  let categoryCount: { [key: string]: number } = {"Всі категорії": filtredProducts.length}

  filtredProducts.forEach(product => {
    const category = product.category;
    if (category) {
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    }
  });

  let typeCount: { [key: string]: number } = {};

  filtredProducts.forEach(product => {
    const type = product.params[4]?.value;
    if (type) {
      typeCount[type] = (typeCount[type] || 0) + 1;
    }
  });

  let seriesCount: { [key: string]: number } = {};

  filtredProducts.forEach(product => {
    const series = product.params[0]?.value.split('_')[0].split('-')[0];
    if (series) {
      seriesCount[series] = (seriesCount[series] || 0) + 1;
    }
  });

  let colorCount: { [key: string]: number} = {};

  filtredProducts.forEach(product => {
    const color = product.params[5]?.value;
    if (color) {
      colorCount[color] = (colorCount[color] || 0) + 1;
    }
  });

  console.log("Vendor count:", vendorCount);
   
  if(searchParams.sort === 'low_price'){
    filtredProducts = filtredProducts.sort((a,b) => a.price - b.price)
  }else if(searchParams.sort == 'hight_price'){
    filtredProducts.sort((a,b) => b.price - a.price)
  }

  const maxPrice = Math.max(...filtredProducts.map(item => item.priceToShow));
  const minPrice = Math.min(...filtredProducts.map(item => item.priceToShow));
  const vendors = Array.from(new Set (filtredProducts.map(item => item.vendor))).filter(function(item) {return item !== '';});
  
  
  
  


   const maxMin = () => {
    const widths = filtredProducts.map(item => item.params);
  
    let maxWidth = 0, minWidth = Infinity;
    let maxHeight = 0, minHeight = Infinity;
    let maxDeep = 0, minDeep = Infinity;
  
    for (const arr of widths) {
      for (const param of arr) {
        const { name, value } = param || {};
        const currentValue = parseFloat(value);
  
        if (isNaN(currentValue)) continue;
  
        switch (name) {
          case 'Ширина, см':
            maxWidth = Math.max(maxWidth, currentValue);
            minWidth = Math.min(minWidth, currentValue);
            break;
          case 'Висота, см':
            maxHeight = Math.max(maxHeight, currentValue);
            minHeight = Math.min(minHeight, currentValue);
            break;
          case 'Глибина, см':
            maxDeep = Math.max(maxDeep, currentValue);
            minDeep = Math.min(minDeep, currentValue);
            break;
          default:
            break;
        }
      }
    }
  
    return [maxWidth, minWidth, maxHeight, minHeight, maxDeep, minDeep];
  }
  
  const maxMinRes = maxMin();
 
  
  




  
   

  if(searchParams.search){
    filtredProducts =filtredProducts.filter((product) => product.name.toLowerCase().indexOf(searchParams.search?.toLowerCase()) !== -1)
  }
  
  if(searchParams.maxPrice || searchParams.minPrice){
    filtredProducts =filtredProducts.filter(obj => obj.priceToShow >= searchParams.minPrice && obj.priceToShow <= searchParams.maxPrice)
  }

  if(searchParams.minWidth || searchParams.maxWidth){
    filtredProducts =filtredProducts.filter(obj => obj.params[1].value >= parseFloat(searchParams.minWidth) && obj.params[1].value <= parseFloat(searchParams.maxWidth))
  }

  if(searchParams.minHeight || searchParams.maxHeight){
    filtredProducts =filtredProducts.filter(obj => obj.params[2].value >= parseFloat(searchParams.minHeight) && obj.params[2].value <= parseFloat(searchParams.maxHeight))
  }

  if(searchParams.minDeep || searchParams.maxDeep){
    filtredProducts =filtredProducts.filter(obj => obj.params[3].value >= parseFloat(searchParams.minDeep) && obj.params[3].value <= parseFloat(searchParams.maxDeep))
  }

  if(searchParams.vendor){
    filtredProducts =filtredProducts.filter(obj => searchParams.vendor?.includes(obj.vendor))
  } 
  
  const color = Array.from(new Set (filtredProducts.map(item => item.params[5]?.value))).filter(function(item) {return item !== '';});
  const series = Array.from(new Set (filtredProducts.map(item => item.params[0].value.split('_')[0].split('-')[0]))).filter(function(item) {return item !== '';});
  const Type = Array.from(new Set (filtredProducts.map(item => item.params[4]?.value))).filter(function(item) {return item !== '';});

  if(searchParams.series){
    filtredProducts =filtredProducts.filter(obj => searchParams.series?.includes(obj.params[0]?.value.split('_')[0].split('-')))
  }

  if(searchParams.color){
    filtredProducts = filtredProducts.filter(obj => searchParams.color?.includes(obj.params[5]?.value))
  }

  if(searchParams.type){
    filtredProducts = filtredProducts.filter(obj => searchParams.type?.includes(obj.params[4]?.value))
  }

  const countOfPages =   Math.ceil(filtredProducts.length/12)


  const pageNumber = searchParams.page

  let min = 0
  let max = 12


  if(pageNumber === 1 || pageNumber === undefined){
    
  }else{
      min = (pageNumber-1)*12
      max = min+12
  } 
 

  return (
    <section>
      <BannerSmall/>
      <div className="flex mt-12">
        <Filter categories={category} category={searchParams.category} minPrice={minPrice} maxPrice={maxPrice} maxMin={maxMinRes} vendors={vendors} series={series} color={color} Type={Type} counts={{ vendorCount: vendorCount, categoryCount: categoryCount, typeCount: typeCount, seriesCount: seriesCount, colorCount: colorCount}}/>
        <div className='w-full'>
          <div className='w-full flex gap-2 justify-center items-center px-6 ml-auto max-md:w-full max-[560px]:px-10 max-[450px]:px-4'>
            <Search searchParams={searchParams} />
            
          </div> 
        
          <div className='grid auto-cols-max gap-4 mt-8 grid-cols-4 px-4 max-2xl:grid-cols-3 max-lg:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:px-10 max-[450px]:px-4'>
            {filtredProducts
            .slice(min, max)
            .map((product) =>(
              <div key={product.id}>
               
                <ProductCard 
                  id={product._id}
                  productId={product.id}
                  email={email}
                  url={product.params[0].value} 
                  price={product.price} 
                  imageUrl={product.images[0]} 
                  description={product.description.replace(/[^а-яА-ЯіІ]/g, ' ').substring(0, 35) + '...'}  
                  priceToShow={product.priceToShow} 
                  name={product.name}
                  likedBy={product.likedBy}
                />
             
              </div>

            ))}
           

            
            

            
          </div>
          
          <PaginationForCatalog searchParams={searchParams} countOfPages={countOfPages } />
          
        </div>
      </div>
    </section>
  )
};



export default catalog