"use client";

import { columns } from "@/app/(admin)/fetchUrl/columns";
import { DataTable } from "@/app/(admin)/fetchUrl/data-table";
import { useState, useEffect } from 'react';
import { Skeleton } from "../ui/skeleton";
import axios from "axios";

interface Product {
    id: string | null;
    name: string | null;
    isAvailable: boolean;
    quantity: number;
    url: string | null;
    priceToShow: number;
    price: number;
    images: (string | null)[];
    vendor: string | null;
    description: string | null;
    params: {
      name: string | null;
      value: string | null;
    }[];
    isFetched: boolean;
}

export default function GatherProductsInfo({ url }: { url: string }) {
    const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
    const [isFetching, setIsFetching] = useState(false)



    useEffect(() => {
        setIsFetching(true);

        const fetchData = async () => {
            try {
                const products = await axios.post("/api/getProducts", { url });
                setFetchedProducts(products.data.fetchedProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchData();
    }, [url]);

    
        if(isFetching){
            return(
                <div className="w-full">
                    <div className="flex items-center py-4">
                        <Skeleton className="w-11/12 h-10"/>
                        <Skeleton className="w-1/12 h-10"/>
                    </div>
                    <div className="h-[700px]">
                        <Skeleton className="w-full h-full"/>
                    </div>
                    <div className="w-full flex justify-between pt-4">
                        <Skeleton className="w-72 h-10"/>
                        <div className="flex gap-2">
                            <Skeleton className="w-32 h-10"/>
                            <Skeleton className="w-32 h-10"/>
                            <Skeleton className="w-32 h-10"/>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                    //@ts-ignore
                    <DataTable columns={columns} data={fetchedProducts} />
            );
        }
}
