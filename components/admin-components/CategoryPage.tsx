"use client"

import React, { useState, useMemo, RefObject, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Search, ArrowUpDown, MoreVertical, MoreHorizontal, BarChart2 } from 'lucide-react'
import EditCategoryButton from '../interface/categories/EditCategoryButton'
import DeleteCategoryButton from '../interface/categories/DeleteCategoryButton'
import AdminProductCard from '../cards/AdminProductCard'
import { ProductType, ReadOnly } from '@/lib/types/types'
import Pagination from '../shared/Pagination'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

interface CategoryPageProps {
  categoryName: string;
  totalProducts: number;
  totalValue: number;
  averageProductPrice: number;
  averageDiscountPercentage: number;
  stringifiedProducts: string; 
}

type ContainerRefType<T extends HTMLElement> = RefObject<T>

const CategoryPage: React.FC<CategoryPageProps> = (props : ReadOnly<CategoryPageProps>) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const containerRef = useRef(null)

  const products = useMemo(() => JSON.parse(props.stringifiedProducts), [props.stringifiedProducts])

  const filteredAndSortedProducts: ProductType[] = useMemo(() => {
    return products
      .filter((product: any) => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a: any, b: any) => {
        if (sortBy === 'name') {
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
        } else if (sortBy === 'price') {
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price
        } else {
          return sortOrder === 'asc' ? a.likedBy.length - b.likedBy.length : b.likedBy.length - a.likedBy.length
        }
      })
  }, [products, searchTerm, sortBy, sortOrder])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const pageNumber = Math.ceil(filteredAndSortedProducts.length  / 12)

  return (
    <div className="pb-12">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">{props.categoryName}</CardTitle>
          <div className="flex gap-3 max-[520px]:hidden">
            <EditCategoryButton className="cursor-pointer" categoryName={props.categoryName} stringifiedProducts={props.stringifiedProducts} customStyles={{ marginToIcon: "mr-1"}}/>
            <DeleteCategoryButton className="cursor-pointer" categoryName={props.categoryName} customStyles={{ marginToIcon: "mr-1"}} />
          </div>
          <div className="min-[521px]:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <div className="p-2 rounded-full bg-white">
                    <MoreHorizontal className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors duration-200" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <DropdownMenuItem className="cursor-pointer">
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <EditCategoryButton categoryName={props.categoryName} stringifiedProducts={props.stringifiedProducts}/>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-200">
                    <DeleteCategoryButton categoryName={props.categoryName}/>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    <span>Аналітика</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Total Products</h3>
              <p className="text-2xl font-bold">{props.totalProducts}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Total Value</h3>
              <p className="text-2xl font-bold">₴{parseFloat(props.totalValue.toFixed(2)).toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Average Price</h3>
              <p className="text-2xl font-bold">₴{parseFloat(props.averageProductPrice.toFixed(2)).toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Average Discount</h3>
              <p className="text-2xl font-bold">{props.averageDiscountPercentage}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full relative">
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-800" />
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] max-[360px]:w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="likes">Likes</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={toggleSortOrder} className="whitespace-nowrap">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div ref={containerRef} className="grid auto-cols-max gap-4 mt-8 grid-cols-4 px-4 max-2xl:grid-cols-3 max-[1200px]:grid-cols-2 max-[730px]:px-0 max-[564px]:grid-cols-1">
        {filteredAndSortedProducts.slice((currentPage - 1) * 12, currentPage * 12).map((product: ProductType) => (
          <AdminProductCard 
           key={product.id} 
           props={{
            id: product.id,
            name: product.name,
            price: product.price,
            priceToShow: product.priceToShow,
            image: product.images[0],
            description: product.description,
            isAvailable: product.isAvailable,
            likes: product.likedBy.length
           }}
          />
        ))}
      </div>
      
      <Pagination className="mt-12" totalPages={pageNumber} currentPage={currentPage} onPageChange={setCurrentPage} scrollToTheTop={true} containerRef={containerRef}/>
    </div> 
  )
}

export default CategoryPage