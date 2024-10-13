"use client";

import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import { Trash2, ArrowRight, AlertTriangle, MoveRight } from "lucide-react";
import { deleteCategory, findAllProductsCategories } from "@/lib/actions/product.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeleteCategoryButtonProps {
    className?: string;
    categoryName: string;
    onDialogChange?: (isOpen: boolean) => void;
}

const DeleteCategoryButton = ({ className, categoryName }: DeleteCategoryButtonProps) => {
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategory, setNewCategory] = useState<boolean>(false);
  const [confirmationCategoryName, setConfirmationcategoryName ] = useState<string>("")
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const [categoriesNames, setCategoriesNames] = useState<{name: string, amount:number}[]>([])


  const preventClosing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }

  useEffect(() => {
    const fetchCategoriesNames = async () => {
        const parsedCategoriesNames = await findAllProductsCategories("json");

        setCategoriesNames(JSON.parse(parsedCategoriesNames as string))
    }

    fetchCategoriesNames();
  }, [])


  const handleClick = (e: React.MouseEvent) => {
    preventClosing(e);
    setIsMainDialogOpen(true);
  }

  const handleMoveProducts = (e: React.MouseEvent) => {
    preventClosing(e);
    setIsMainDialogOpen(false);
    setIsMoveDialogOpen(true);
  }

  const handleDeleteCategory = (e: React.MouseEvent) => {
    preventClosing(e);
    setIsMainDialogOpen(false);
    setIsDeleteDialogOpen(true);
  }

  const confirmMoveProducts = async () => {
    await deleteCategory({ categoryName: categoryName, removeProducts: false, categoryToMoveProducts: newCategoryName });

    setIsMoveDialogOpen(false);
    setIsMainDialogOpen(false);
  }

  const confirmDeleteCategory = async (e: React.MouseEvent) => {
    if(confirmationCategoryName == categoryName && deleteConfirmation == "DELETE"){
        await deleteCategory({ categoryName: categoryName, removeProducts: true })
    } 

    setIsDeleteDialogOpen(false);
    setIsMainDialogOpen(false);
    setDeleteConfirmation("");
  }

  const handleCancel = (e: React.MouseEvent) => {
    preventClosing(e);
    setIsMainDialogOpen(true);
  }

  return (
    <div onClick={(e) => preventClosing(e)} className="w-full h-full">
        <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
            <DialogTrigger asChild>
                <span
                onClick={handleClick}
                className={cn(
                    "w-full h-full flex items-center text-red-500 hover:text-red-700 transition-colors duration-200",
                    className
                )}
                >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
                </span>
            </DialogTrigger>
            <DialogContent className="bg-white sm:max-w-[425px] max-w-[95%] rounded-lg">
                <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center text-gray-800">
                    <AlertTriangle className="w-6 h-6 mr-2 text-yellow-500" />
                    Delete Category
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                    This action cannot be undone. Please choose how to manage the products in this category.
                </DialogDescription>
                </DialogHeader>
                <div className="my-6 space-y-4">
                <Button
                    variant="outline"
                    className="w-full justify-between text-left font-normal hover:bg-gray-100"
                    onClick={handleMoveProducts}
                >
                    <span className="max-[400px]:hidden">Move products to another category</span>
                    <span className="min-[401px]:hidden">Move to another category</span>
                    <MoveRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                    variant="outline"
                    className="w-full justify-between text-left font-normal hover:bg-gray-100"
                    onClick={handleDeleteCategory}
                >
                    <span className="max-[400px]:hidden">Delete all products in this category</span>
                    <span className="min-[401px]:hidden">Delete with products</span>
                    <Trash2 className="w-4 h-4 ml-2" />
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

            <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
                <DialogContent className="bg-white sm:max-w-[425px] max-w-[95%] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">Move Products</DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2">
                    Enter the name of the category to move the products to.
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
                            className="mt-1"
                            placeholder="Enter category name"
                            />
                        </>
                    ): (
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
                         onClick={() => setNewCategory(prev => !prev)}>
                            {newCategory? "Вибрати існуючу?" : "Створити нову?"}
                        </Button>
                    </div>
                </div>
                <DialogFooter className="sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                    variant="outline"
                    onClick={(event) => {setIsMoveDialogOpen(false), handleCancel(event)}}
                    className="w-full sm:w-auto"
                    >
                    Cancel
                    </Button>
                    <Button
                    onClick={confirmMoveProducts}
                    className="w-full sm:w-auto"
                    disabled={!newCategoryName.trim()}
                    >
                    Move and Delete
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-white sm:max-w-[425px] max-w-[95%] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">Confirm Deletion</DialogTitle>
                    <DialogDescription className="text-gray-600 mt-2">
                        This will permanently delete <span className="font-bold">{categoryName}</span> category and all it&apos;s products. This action can&apos;t be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-4 space-y-4">
                    <div>
                    <Label htmlFor="categoryName" className="text-sm font-medium text-gray-700">
                        Type category name
                    </Label>
                    <Input
                        id="categoryName"
                        onChange={(e) => setConfirmationcategoryName(e.target.value)}
                        className="mt-1"
                    />
                    </div>
                    <div>
                    <Label htmlFor="deleteConfirmation" className="text-sm font-medium text-gray-700">
                        Type <span className="font-semibold text-red-500">DELETE</span> to confirm
                    </Label>
                    <Input
                        id="deleteConfirmation"
                        value={deleteConfirmation}
                        onChange={(e) => setDeleteConfirmation(e.target.value)}
                        className="mt-1"
                        placeholder="Type DELETE"
                    />
                    </div>
                </div>
                <DialogFooter className="sm:flex-row flex-col space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button
                    variant="outline"
                    onClick={(event) => {setIsDeleteDialogOpen(false), handleCancel(event)}}
                    className="w-full sm:w-auto"
                    >
                    Cancel
                    </Button>
                    <Button
                    variant="destructive"
                    onClick={(e) => confirmDeleteCategory(e)}
                    className="w-full sm:w-auto bg-red-500 text-white"
                    disabled={(deleteConfirmation !== "DELETE" || confirmationCategoryName !== categoryName)}
                    >
                    Delete Category and Products
                    </Button>
                </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    </div>
  )
}

export default DeleteCategoryButton