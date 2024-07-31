"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { deleteOrder } from "@/lib/actions/order.actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Input } from "../ui/input";

const DeleteOrderButton = ({ id }: { id: string }) => {
    const [ orderId, setOrderId ] = useState("");
    const [ error, setError ] = useState("");
    const pathname = usePathname();

    const router = useRouter();

    const handleDelete = async (id: string) => {
        if(orderId === id) {
            await deleteOrder(id, pathname);
            router.back();
        } else {
            setError("Неправильний ID замовлення")
        }
    }

    return (
    <Dialog>
        <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 max-[1100px]:w-full">
            <p>Видалити</p>
            <Image 
                src="/assets/delete.svg"
                width={24}
                height={24}
                alt="Delete order"
                className="ml-2"
            />
        </DialogTrigger>
        <DialogContent className="bg-white border-black">
            <DialogHeader>
                <DialogTitle>Видалити замовлення</DialogTitle>
                <DialogDescription>
                    Після видалення замовлення відновити його буде <span className="text-red-500 font-semibold">Неможливо</span>.
                    <p className="mt-2">Введіть ID замовлення нижче, щоб його видалити</p>
                </DialogDescription>
            </DialogHeader>
            <Input onChange={(e) => setOrderId(e.target.value)}/>
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

export default DeleteOrderButton;