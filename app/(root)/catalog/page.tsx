'use server'

import React from 'react'
import Filter from '@/components/shared/Filter'
import ProductCard from '@/components/cards/ProductCard'
import Search from '@/components/shared/Search'
import PaginationForCatalog from '@/components/shared/PaginationForCatalog'

import { getSession } from '@/lib/getServerSession'
import BannerSmall from '@/components/banner/BannerSmall'
import { fetchCatalog } from '@/lib/actions/redis/catalog.actions'
import { fetchAllProducts } from '@/lib/actions/product.actions'
import { getCounts, getFiltredProducts } from '@/lib/utils'


const Catalog = async ({searchParams,data}:any) => {
  // let filtredProducts = await fetchAllProducts();

  let filtredProducts: any[] = await fetchCatalog();
  
  const email = await getSession()

  const categories = Array.from(new Set (filtredProducts.map(item => item.category))).filter(function(item) {return item !== '';});
  
  if(searchParams.sort === 'low_price'){
    filtredProducts = filtredProducts.sort((a,b) => a.price - b.price)
  }else if(searchParams.sort == 'hight_price'){
    filtredProducts.sort((a,b) => b.price - a.price)
  }
  
  const maxPrice = Math.max(...filtredProducts.map(item => item.priceToShow));
  const minPrice = Math.min(...filtredProducts.map(item => item.priceToShow));
  const vendors = Array.from(new Set (filtredProducts.map(item => item.vendor))).filter(function(item) {return item !== '';});
  const colors = Array.from(new Set (filtredProducts.map(item => item.params[5]?.value))).filter(function(item) {return item !== '';});
  const series = Array.from(new Set (filtredProducts.map(item => item.params[0].value.split('_')[0].split('-')[0]))).filter(function(item) {return item !== '';});
  const types = Array.from(new Set (filtredProducts.map(item => item.params[4]?.value))).filter(function(item) {return item !== '';});

  const maxMin = () => {
    const allParams = filtredProducts.map(item => item.params);
    const widths = [];
    const heights = [];
    const depths = [];
    
    for(const params of allParams) {
      for(const param of params) {
        if (!isNaN(param.value)) {
          if (['Ширина, см', "Width, cm"].includes(param.name)) {
            widths.push(parseFloat(param.value))
          } else if(['Висота, см', "Height, cm"].includes(param.name)) {
            heights.push(parseFloat(param.value))
          } else if(['Глибина, см', "Depth, cm"].includes(param.name)) {
            depths.push(parseFloat(param.value))
          }
        }
      }
    }
    
    return { minWidth: Math.min(...widths), maxWidth: Math.max(...widths), minHeight: Math.min(...heights), maxHeight: Math.max(...heights), minDepth: Math.min(...depths), maxDepth: Math.max(...depths)} as const
  }
  
  const maxMinRes = maxMin();

  const counts = getCounts(filtredProducts)
  filtredProducts = getFiltredProducts(filtredProducts, searchParams);

  const countOfPages = Math.ceil(filtredProducts.length/12)
  const pageNumber = searchParams.page

  let min = 0
  let max = 12


  if(pageNumber === 1 || pageNumber === undefined){
    
  } else{
      min = (pageNumber-1)*12
      max = min+12
  } 
  return (
    <section>
      <BannerSmall/>
      <div className="flex mt-12">
        <Filter  
         category={searchParams.category} 
         minPrice={minPrice} 
         maxPrice={maxPrice} 
         maxMin={maxMinRes} 
         checkParams={{categories, vendors, series, colors, types }} 
         counts={counts}
        />
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
          <PaginationForCatalog minPrice={minPrice} maxPrice={maxPrice} maxMin={maxMinRes} countOfPages={countOfPages} />
        </div>
      </div>
    </section>
  )
};



export default Catalog;