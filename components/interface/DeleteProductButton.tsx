"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { deleteProduct } from "@/lib/actions/product.actions";

const DeleteProductButton = ({ id }: { id: string }) => {
    const [ productId, setProductId ] = useState("");
    const [ error, setError ] = useState("");
    const pathname = usePathname();

    const router = useRouter();

    const handleDelete = async (id: string) => {
        if(productId === id) {
            await deleteProduct(id, pathname);
            router.back();
        } else {
            setError("Неправильний ID замовлення")
        }
    }

    return (
    <Dialog>
        <DialogTrigger className="inline-flex items-center justify-center bg-red-500 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground px-2 hover:bg-red-400">
            <Image 
                src="/assets/delete-white.svg"
                width={22}
                height={22}
                alt="Delete order"
            />
        </DialogTrigger>
        <DialogContent className="bg-white border-black">
            <DialogHeader>
                <DialogTitle>Видалити товар</DialogTitle>
                <DialogDescription>
                    <p className="mt-2">Введіть ID товару, щоб його видалити.</p>
                </DialogDescription>
            </DialogHeader>
            <Input onChange={(e) => setProductId(e.target.value)}/>
            <p className="text-red-500 text-small-regular">{error}</p>
            <DialogFooter>
                <Button 
                    onClick={() => handleDelete(id)}
                    variant="outline"
                    size="sm"
                    >Видалити
                        <Image 
                            src="/assets/delete.svg"
                            width={24}
                            height={24}
                            alt="Delete order"
                            className="ml-2"
                    />
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    )
}

export default DeleteProductButton;