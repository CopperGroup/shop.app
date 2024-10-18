"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, sleep } from "@/lib/utils";
import { Edit, Percent, MoveRight, Check } from "lucide-react";
import { setCategoryDiscount, changeProductsCategory, findAllProductsCategories, fetchCategoriesProducts } from "@/lib/actions/product.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductType, ReadOnly } from "@/lib/types/types";
import ProductsTable from "./ProductsTable";

type OnSelectionChangeProps = 
    | { selectType: "select-one", productId: string }
    | { selectType: "select-all", productIds: string[] }

interface EditCategoryButtonProps {
  className?: string;
  categoryName: string;
  stringifiedProducts: string;
  onDialogChange?: (isOpen: boolean) => void;
}

const EditCategoryButton = (props: ReadOnly<EditCategoryButtonProps>) => {
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false);
  const [isChangeCategoryDialogOpen, setIsChangeCategoryDialogOpen] = useState(false);
  const [isSelectProductsDialogOpen, setIsSelectProductsDialogOpen] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategory, setNewCategory] = useState<boolean>(false);
  const [categoriesNames, setCategoriesNames] = useState<{name: string, amount:number}[]>([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set<string>())
  const [selectCategoryOpen, setSelectCategoryOpen] = useState<boolean>(false)
  
  const products = JSON.parse(props.stringifiedProducts)
  
  useEffect(() => {
      const fetchCategoriesNames = async () => {
          const parsedCategoriesNames = await findAllProductsCategories("json");
          setCategoriesNames(JSON.parse(parsedCategoriesNames as string));
        }
        fetchCategoriesNames();
    }, []);
    
    const preventClosing = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }
    
    const handleSelectionChange = useCallback((props: OnSelectionChangeProps) => {
      setSelectedProducts(prevSelected => {
        let newSelected = new Set(prevSelected)

        if(props.selectType == "select-all") {
            if(newSelected.size == props.productIds.length) {
                newSelected.clear()
            } else {
                newSelected = new Set(props.productIds)
            }

        } else {
            if (newSelected.has(props.productId)) {
                newSelected.delete(props.productId)
            } else {
              newSelected.add(props.productId)
            }
        }

        return newSelected
      })

    }, [])
    
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault()
    }
  }, [])

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    preventClosing(e);
    setIsMainDialogOpen(true);
  }

  const handleSetDiscount = (e: React.MouseEvent) => {
    preventClosing(e);
    setIsMainDialogOpen(false);
    setIsDiscountDialogOpen(true);
  }

  const handleChangeCategory = (e: React.MouseEvent) => {
    preventClosing(e);
    setIsMainDialogOpen(false);
    setIsSelectProductsDialogOpen(true);
  }

  const confirmSetDiscount = async () => {
    await setCategoryDiscount(props.categoryName, Number(discountPercentage));
    setIsDiscountDialogOpen(false);
    setIsMainDialogOpen(false);
    setDiscountPercentage("");
  }

  const confirmChangeCategory = async () => {
    await changeProductsCategory({ productsIds: Array.from(selectedProducts), categoryName: newCategoryName });
    setIsChangeCategoryDialogOpen(false);
    setIsMainDialogOpen(false);
    setNewCategoryName("");
    setSelectedProducts(new Set());
  }

  useEffect(() => {
    console.log("Seletced products:", selectedProducts)
  }, [selectedProducts])
 
  const handleCancel = (e: React.MouseEvent) => {
    preventClosing(e);
    setIsMainDialogOpen(true);
  }

  return (
    <div onClick={(e) => preventClosing(e)} onKeyDown={handleKeyDown} className="w-full h-full">
      <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DialogTrigger asChild>
          <span
            onClick={handleClick}
            className={cn(
              "w-full h-full flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200",
              props.className
            )}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </span>
        </DialogTrigger>
        <DialogContent className="bg-white sm:max-w-[425px] max-w-[95%] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center text-gray-800">
              <Edit className="w-6 h-6 mr-2 text-blue-500" />
              Edit Category
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
                Editing <span className="font-semibold">{props.categoryName}</span> category.
            </DialogDescription>
          </DialogHeader>
          <div className="my-6 space-y-4">
            <Button
              variant="outline"
              className="w-full justify-between text-left font-normal hover:bg-gray-100"
              onClick={handleSetDiscount}
            >
              <span className="max-[400px]:hidden">Set category discount</span>
              <span className="min-[401px]:hidden">Set discount</span>
              <Percent className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between text-left font-normal hover:bg-gray-100"
              onClick={handleChangeCategory}
            >
              <span>Move products</span>
              <MoveRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <DialogFooter className="sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsMainDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>

        <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
          <DialogContent className="bg-white sm:max-w-[425px] max-w-[95%] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">Set Category Discount</DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                Enter the discount percentage for all products in <span className="font-semibold">{props.categoryName}</span> category.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <Label htmlFor="discountPercentage" className="text-sm font-medium text-gray-700">
                Discount Percentage
              </Label>
              <Input
                id="discountPercentage"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                onKeyDown={handleInputKeyDown}
                className="mt-1"
                type="number"
                min="0"
                max="100"
                placeholder="Enter discount percentage"
              />
            </div>
            <DialogFooter className="sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                onClick={(event) => {setIsDiscountDialogOpen(false); handleCancel(event);}}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSetDiscount}
                className="w-full sm:w-auto"
                disabled={!discountPercentage.trim() || Number(discountPercentage) < 0 || Number(discountPercentage) > 100}
              >
                Set Discount
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isSelectProductsDialogOpen} onOpenChange={setIsSelectProductsDialogOpen}>
          <DialogContent className="max-w-[95%} max-h-[90vh] flex flex-col bg-white overflow-y-scroll sm:max-w-[700px] rounded-lg max-[420px]:max-w-full max-[390px]:px-1">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">Select Products to Move</DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                Choose the products you want to move to a new category.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto my-4 max-[420px]:pl-1">
            <ProductsTable
                stringifiedProducts={props.stringifiedProducts}
                categoryName={props.categoryName}
                selectedProducts={selectedProducts}
                onSelectionChange={handleSelectionChange}
                />
            </div>
            <DialogFooter className="sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                onClick={(event) => {setIsSelectProductsDialogOpen(false); handleCancel(event);}}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsSelectProductsDialogOpen(false);
                  setIsChangeCategoryDialogOpen(true);
                }}
                className="w-full sm:w-auto"
              >
                Next
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isChangeCategoryDialogOpen} onOpenChange={setIsChangeCategoryDialogOpen}>
          <DialogContent className="bg-white sm:max-w-[425px] max-w-[95%] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">Move products</DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                Enter the new category name for the selected products.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              {newCategory ? (
                <>
                  <Label htmlFor="newCategory" className="text-sm font-medium text-gray-700">New category name</Label>
                  <Input
                    id="newCategory"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={handleInputKeyDown}
                    className="mt-1"
                    placeholder="Enter category name"
                  />
                </>
              ) : (
                <>
                  <Label htmlFor="chooseCategory" className="text-sm font-medium text-gray-700">Choose existing category</Label>
                  <Select        
                    onValueChange={(value) => {setNewCategoryName(value)}} 
                  >
                    <SelectTrigger id="chooseCategory" className="text-small-regular text-gray-700  bg-neutral-100 mt-1 focus-visible:ring-black focus-visible:ring-[1px]">
                      <SelectValue className="text-small-regular text-gray-700 "></SelectValue>
                    </SelectTrigger>
                    <SelectContent onClick={(e) => preventClosing(e)}>
                      {categoriesNames.map((category, index) => (
                        <SelectItem key={index} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
              <div className="w-full h-fit flex justify-end">
                <Button 
                  type="button" 
                  className="text-small-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-0 px-0 -mb-3" 
                  variant="destructive" 
                  onClick={() => setNewCategory(prev => !prev)}
                >
                  {newCategory ? "Choose existing?" : "Create new?"}
                </Button>
              </div>
            </div>
            <DialogFooter className="sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                onClick={(event) => {setIsChangeCategoryDialogOpen(false); handleCancel(event);}}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmChangeCategory}
                className="w-full sm:w-auto"
                disabled={!newCategoryName.trim() || selectCategoryOpen}
              >
                Change Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Dialog>
    </div>
  )
}

export default EditCategoryButton