import React from 'react'
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Heart } from 'lucide-react'
import Link from "next/link"
import { ReadOnly } from '@/lib/types/types'
import Badge from '../badges/Badge'

interface AdminProductCardProps {
    id: string
    name: string
    price: number
    priceToShow: number
    image: string
    description: string
    isAvailable: boolean
    likes: number
}

const AdminProductCard = ({ props }: { props: ReadOnly<AdminProductCardProps>}) => {
    return (
        <article className="w-[100%] h-96 bg-neutral-100 rounded-2xl flex items-center justify-center  mx-auto" >     
            <div className="w-11/12 h-[90%]">
                <Link href={`/admin/createProduct/list/${props.id}`} prefetch={false}>
                    <div className="relative w-full h-56 flex justify-center">
                        <Image src={props.image} width={200} height={200} alt="Product image" className="absolute rounded-2xl max-w-[200px] max-h-[200px]"/>
                        <div className="w-full h-full flex justify-between items-start">
                            <Badge price={props.price} priceToShow={props.priceToShow}/>
                            
                            {/* <LikeButton  likedBy={JSON.stringify(likedBy)} productId={productId} email={email}/>  */}
                        </div>
                    </div>
                    <div className=" h-[76px] overflow-hidden">
                        <h3 className="text-body-bold ml-1">{props.name}</h3>
                        <p className="ml-1">{props.description}</p>
                    </div>
                </Link>
                <div className="flex flex-1 justify-between items-center mt-2">
                    <div>
                        <p className="text-base-medium text-gray-700 line-through">{props.price != props.priceToShow && '₴' + props.price}</p>
                        <p className="text-base-semibold">₴{props.priceToShow}</p>
                    </div>
                    <div className="flex gap-1 items-center mt-4 mr-2">
                        <Heart className={`size-4 text-red-500 mt-0.5 ${props.likes > 0 ? "fill-red-500" : ""}`}/>
                        <p>{props.likes} {props.likes == 1 ? "like" : "likes"}</p>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default AdminProductCard