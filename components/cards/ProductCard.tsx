import Image from "next/image"
import AddToCart from "../shared/AddToCart"
import Badge from "../badges/Badge"
import Link from "next/link"
import LikeButton from "../interface/LikeButton"
import { TransitionLink } from "../interface/TransitionLink"

interface Props {
    id: string;
    productId: string; 
    email: string;
    priceToShow:number; 
    price:number; 
    name:string;
    imageUrl:string;
    description:string;
    url:string;
    likedBy: {
        _id: string;
        email: string;
    }[];
}






const ProductCard = ({ id, productId, email, priceToShow, price, name, imageUrl, description, url, likedBy}: Props) => {
  return (
    <article className="w-[100%] h-96 border-[1.5px] border-black rounded-2xl flex items-center justify-center  mx-auto" >     
        <div className="w-11/12 h-[90%]">
            <TransitionLink href={`/catalog/${url}`}>
                <div className="w-full h-56 flex justify-center">
                    <Image src={imageUrl} width={200} height={200} alt="Product image" className="absolute rounded-2xl max-w-[200px] max-h-[200px]"/>
                    <div className="w-full h-full flex justify-between items-start">
                        <Badge price={price} priceToShow={priceToShow}/>
                        
                        <LikeButton  likedBy={JSON.stringify(likedBy)} productId={productId} email={email}/> 
                    </div>
                </div>
                <div className=" h-[76px] overflow-hidden">
                    <h3 className="text-body-bold ml-1">{name}</h3>
                    <p className="ml-1">{description}</p>
                </div>
            </TransitionLink>
            <div className="flex flex-1 justify-between items-center mt-2">
                <div>
                    <p className="text-base-medium text-gray-700 line-through">{price != priceToShow?'₴' + price:<></>}</p>
                    <p className="text-base-semibold">₴{priceToShow}</p>
                </div>
                <AddToCart id={id} image={imageUrl} name={name} price={priceToShow} priceWithoutDiscount={price}/>
            </div>
        </div>
    </article>
  )
}

export default ProductCard