'use client'

import React, { useReducer, useCallback, useMemo } from 'react'
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
import { ChevronLeft, ChevronRight, Search, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ProductType } from '@/lib/types/types'

type Action =
  | { type: 'SET_SEARCH', payload: string }
  | { type: 'SET_AVAILABILITY', payload: string }
  | { type: 'SET_SORT', payload: string }
  | { type: 'SET_PAGE', payload: number }

type State = {
  search: string
  availability: string
  sort: string
  page: number
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 }
    case 'SET_AVAILABILITY':
      return { ...state, availability: action.payload, page: 1 }
    case 'SET_SORT':
      return { ...state, sort: action.payload, page: 1 }
    case 'SET_PAGE':
      return { ...state, page: action.payload }
    default:
      return state
  }
}

const filterAndSortProducts = (products: any[], state: State) => {
  let filtered = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(state.search.toLowerCase()) ||
      product.vendor.toLowerCase().includes(state.search.toLowerCase())
    const matchesAvailability = 
      state.availability === 'all' ||
      (state.availability === 'available' && product.isAvailable) ||
      (state.availability === 'unavailable' && !product.isAvailable)
    return matchesSearch && matchesAvailability
  })

  switch (state.sort) {
    case 'price-high-to-low':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'price-low-to-high':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'likes-high-to-low':
      filtered.sort((a, b) => b.likedBy.length - a.likedBy.length)
      break
    case 'likes-low-to-high':
      filtered.sort((a, b) => a.likedBy.length - b.likedBy.length)
      break
    default:
      // Default sorting (e.g., by ID or name)
      break
  }

  return filtered
}

type OnSelectionChangeProps = 
    | { selectType: "select-one", productId: string }
    | { selectType: "select-all", productIds: string[] }

interface ProductsTableProps {
  stringifiedProducts: string;
  categoryName: string;
  selectedProducts: Set<string>;
  onSelectionChange: (props: OnSelectionChangeProps) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ 
  stringifiedProducts, 
  categoryName, 
  selectedProducts, 
  onSelectionChange 
}) => {

  const products = useMemo(() => JSON.parse(stringifiedProducts), [stringifiedProducts])
  const router = useRouter()

  const [state, dispatch] = useReducer(reducer, {
    search: '',
    availability: 'all',
    sort: 'default',
    page: 1
  })

  const itemsPerPage = 9
  const filteredAndSortedProducts = useMemo(() => filterAndSortProducts(products, state), [products, state])
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage)
  const startIndex = (state.page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPageProducts = filteredAndSortedProducts.slice(startIndex, endIndex)

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UAH',
  })

  const handleProductToggle = useCallback((productId: string) => {
    onSelectionChange({ selectType: "select-one", productId: productId })
  }, [onSelectionChange])

  const handleToggleAllProducts = useCallback(() => {
    const product_Ids = products.map((product: ProductType) => product._id);

    //console.log(product_Ids)
    onSelectionChange({ selectType: "select-all", productIds: product_Ids });
  }, [currentPageProducts, onSelectionChange])

  const isAllSelected = useMemo(() => 
    currentPageProducts.every(product => selectedProducts.has(product._id)),
    [currentPageProducts, selectedProducts]
  )

  return (
    <Card className="w-full max-w-[1200px] mx-auto">
      <CardHeader>
        <CardTitle>Products in {categoryName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                className="w-full"
                placeholder="Search products..."
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                value={state.search}
                //icon={<Search className="h-4 w-4 text-gray-500" />}
              />
            </div>
            <Select onValueChange={(value) => dispatch({ type: 'SET_AVAILABILITY', payload: value })}>
              <SelectTrigger className="w-[180px] max-[488px]:w-full">
                <SelectValue placeholder="All products" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All products</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => dispatch({ type: 'SET_SORT', payload: value })}>
              <SelectTrigger className="w-[180px] max-[488px]:w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-high-to-low">Price: High to Low</SelectItem>
                  <SelectItem value="price-low-to-high">Price: Low to High</SelectItem>
                  <SelectItem value="likes-high-to-low">Likes: High to Low</SelectItem>
                  <SelectItem value="likes-low-to-high">Likes: Low to High</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto thin-scrollbar">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleToggleAllProducts}
                  />
                </TableHead>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Постачальник</TableHead>
                <TableHead>Назва</TableHead>
                <TableHead>Доступний</TableHead>
                <TableHead className="text-right">Ціна без знижки</TableHead>
                <TableHead className="text-right">Ціна із знижкою</TableHead>
                <TableHead className="text-right">Likes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageProducts.map((product:any) => (
                <TableRow 
                  key={product.id} 
                  className="cursor-pointer hover:bg-slate-50 transition-all"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedProducts.has(product._id)}
                      onCheckedChange={() => handleProductToggle(product._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.vendor}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Checkbox checked={product.isAvailable} disabled />
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatter.format(product.price)}</TableCell>
                  <TableCell className="text-right text-red-600 font-medium">{formatter.format(product.priceToShow)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Heart className="w-4 h-4 mr-1 text-red-500" />
                      {product.likedBy.length}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody> 
          </Table>
        </div>

        <div className="flex items-center justify-between gap-2 py-4 max-[460px]:flex-col">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch({ type: 'SET_PAGE', payload: state.page - 1 })}
              disabled={state.page <= 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch({ type: 'SET_PAGE', payload: state.page + 1 })}
              disabled={state.page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductsTable