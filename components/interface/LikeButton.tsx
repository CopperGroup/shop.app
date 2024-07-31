"use client";

import { addLike } from "@/lib/actions/product.actions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
 
const LikeButton = ({ productId, likedBy, email}: { productId: string,  likedBy: string, email:string }) => {
    const [ isLiked, setIsLiked ] = useState(false);
   
    

 

    
    // const email = session.data?.user.email
      
    
 
    

    let likes = []

    if(likedBy) {
        likes = JSON.parse(likedBy);
    }

    useEffect(() => {
        if(likes.some((user: { email: string }) => user.email === email)) {
            setIsLiked(true)
        }
    }, [productId, email])

    const pathname = usePathname();

    const handleAddingLike = async (e:any) => {
        e.preventDefault()
        try {
            setIsLiked(!isLiked);
            await addLike({ productId: productId, email: email, path: pathname})

        } catch (error: any) {
            throw new Error(`Error running addLike() function, ${error.message}`)
        }
    }

    return (
        <Image src={`/assets/heart-${isLiked ? "filled" : "gray"}.svg`} width={24} height={24} alt="Like" className="cursor-pointer relative z-10" onClick={(e)=>handleAddingLike(e)}/> 
    )
}

export default LikeButton;