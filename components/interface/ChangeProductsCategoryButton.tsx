"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { changeProductsCategory } from "@/lib/actions/product.actions";

const ChangeProductsCategoryButton = ({ categoryName, productsIds, className }: { categoryName: string, productsIds: string[], className: string }) => {

    const handleCategoryChange = async () => {
        await changeProductsCategory({ productsIds: productsIds, categoryName: categoryName })
    } 

    return (
        <Button className={cn(className)} onClick={handleCategoryChange}></Button>
    )
}

export default ChangeProductsCategoryButton