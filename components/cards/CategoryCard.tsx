import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, BarChart2, Eye } from "lucide-react"
import { Category } from "@/lib/types/types"
import DeleteCategoryButton from "../interface/categories/DeleteCategoryButton"
import EditCategoryButton from "../interface/categories/EditCategoryButton"

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  } else {
    return num.toFixed(2)
  }
}

const CategoryCard = ({ categoryInfo }: {categoryInfo: Category}) => {
  return(
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl group relative">
            <div className="absolute top-4 right-4 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <div className="p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <MoreVertical className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors duration-200" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white">
                  <DropdownMenuItem className="cursor-pointer">
                    <Link href={`/admin/categories/${categoryInfo.category.replace(" ", "_")}`} className="w-full h-fit flex items-center p-0">
                      <Eye className="mr-2 h-4 w-4"/>
                      <span>View</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <EditCategoryButton categoryName={categoryInfo.category} stringifiedProducts={categoryInfo.values.stringifiedProducts}/>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center text-red-500 cursor-pointer hover:text-red-700 transition-colors duration-200">
                    <DeleteCategoryButton categoryName={categoryInfo.category}/>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    <span>Аналітика</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 truncate">
                {categoryInfo.category || 'Unnamed Category'}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
                  <p className="text-2xl font-bold text-gray-800 truncate" title={categoryInfo.values.totalProducts.toString()}>
                    {formatNumber(categoryInfo.values.totalProducts)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-inner">
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-gray-800 truncate" title={`$${categoryInfo.values.totalValue.toFixed(2)}`}>
                    ${formatNumber(categoryInfo.values.totalValue)}
                  </p>
                </div>
                <div className="col-span-2 bg-white p-4 rounded-lg shadow-inner">
                  <p className="text-sm font-medium text-gray-500 mb-1">Average Price</p>
                  <p className="text-2xl font-bold text-gray-800 truncate" title={`$${categoryInfo.values.averageProductPrice.toFixed(2)}`}>
                    ${formatNumber(categoryInfo.values.averageProductPrice)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
  )
}

export default CategoryCard