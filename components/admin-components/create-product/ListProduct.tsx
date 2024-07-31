"use client";

import { Button } from "@/components/ui/button";
import { listProduct } from "@/lib/actions/product.actions";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
    id: string;
    name: string;
    images: string[];
    quantity: number;
    url: string;
    priceToShow: number;
    price: number;
    vendor: string;
    category: string;
    description: string;
    params: string;
}

const ListProduct = ({ id, name, images, quantity, url, priceToShow, price, vendor, category, description, params }: Props) => {

    const router = useRouter();
    
    const productParams = JSON.parse(params);

    const screenWidth = window.screen.width;

    let rows = 5;
     
    if(screenWidth <= 1316) {
        rows = 4;
    } 
    
    if(screenWidth <= 1120) {
        rows = 3;
    }

    const remainder = productParams.length % rows;
    if (remainder !== 0) {
        const paramsToAdd = rows - remainder;
        for (let i = 0; i < paramsToAdd; i++) {
            productParams.push({ name: "", value: "" });
        }
    }

    const handleList = async () => {
        await listProduct(id);

        router.push(`/catalog/${productParams[0].value}`)
    }
    return (
        <section className="mt-12 mr-7">
            <h3 className="text-heading3-bold font-semibold">Properities section:</h3>
            <div className="ml-7 mt-12 flex flex-col gap-3 border rounded-2xl py-16 px-5 shadow-xl">
                <h4 className="text-heading4-medium font-bold text-center">{name}</h4>
                <p className="text-body-medium">Quantity: <span className="font-normal">{quantity}</span></p>
                <p className="text-body-medium">URL: <Link href={url} className="font-normal text-primary-experimental hover:underline">{url}</Link></p>
                <p className="text-body-medium">Price to show: <span className="font-medium text-green-500">{priceToShow}</span></p>
                <p className="text-body-medium">Price: <span className="font-medium text-green-500">{price}</span></p>
                <p className="text-body-medium">Vendor: <span className="font-normal">{vendor}</span></p>
                <p className="text-body-medium">Category: <Link href={`/catalog?page=1&sort=default&category=${category.replace(/ /g, "_")}`} className="font-normal text-primary-experimental hover:underline">{category}</Link></p>
                <p className="text-body-medium">Description: <span className="font-normal">{description.replace(/[^а-яА-ЯіІ]/g, ' ')}</span></p>
                <div className="w-full flex justify-end items-center mt-5">
                    <Button 
                     variant="outline"
                     onClick={() => router.push(`/admin/createProduct/edit-product/${id}`)} 
                    >Edit
                        <Image
                            src="/assets/edit.svg"
                            height={24}
                            width={24}
                            alt="Edit"
                            className="ml-5"
                        />
                    </Button>
                </div>
            </div>

            <h3 className="text-heading3-bold font-semibold mt-32">Images section:</h3>
            <div className="ml-7 mt-12 flex flex-col gap-3 border rounded-2xl py-16 px-5 shadow-xl">
                {images.length > 0 && (
                    <div className="w-full grid grid-cols-5 justify-items-center items-center gap-7">
                        {images.map((image, index) => (
                            <Image
                                key={index}
                                src={image}
                                height={216}
                                width={216}
                                alt="Product image"
                                className="border border-black ring-1 ring-black ring-offset-2 p-1"
                            />
                        ))}
                    </div>
                )}
                <div className="w-full flex justify-end items-center mt-5">
                    <Button 
                     variant="outline"
                     onClick={() => router.push(`/admin/createProduct/add-images/${id}`)} 
                    >Edit
                        <Image
                            src="/assets/edit.svg"
                            height={24}
                            width={24}
                            alt="Edit"
                            className="ml-5"
                        />
                    </Button>
                </div>
            </div>

            <h3 className="text-heading3-bold font-semibold mt-32">Params section:</h3>
            <div className="ml-7 mt-12 flex flex-col gap-3 border rounded-2xl py-16 px-5 shadow-xl">
                {productParams.length > 0 && (
                    <div className="w-full grid grid-cols-5 justify-items-center items-center bg-stone-500 p-0 gap-[1px] max-[1316px]:grid-cols-4 max-[1120px]:grid-cols-3">
                        {productParams.map(({ name, value }: { name: string, value: string}) => (
                            <div key={value} className="bg-white w-full h-full p-5">
                                <p className="text-center font-semibold">{name}</p>
                                <p className="text-center">{value}</p>
                            </div>
                        ))}
                    </div>
                )}
                <div className="w-full flex justify-end items-center mt-5">
                    <Button 
                     variant="outline"
                     onClick={() => router.push(`/admin/createProduct/add-params/${id}`)} 
                    >Edit
                        <Image
                            src="/assets/edit.svg"
                            height={24}
                            width={24}
                            alt="Edit"
                            className="ml-5"
                        />
                    </Button>
                </div>
            </div>

            <Button 
             className="w-full bg-green-500 hover:bg-green-400 mt-32"
             onClick={() => handleList()} 
            >
                List product
            </Button>
        </section>
    )
}

export default ListProduct;