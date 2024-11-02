'use client'

import React from 'react'
import { Button } from '../ui/button'
import { useAppContext } from '@/app/(root)/context'
import { productAddedToCart } from '@/lib/actions/product.actions'
import { ShoppingCart } from 'lucide-react'
import { event } from '@/lib/fpixel'

// interface CartData {
//   id: string;
//   name: string;
//   image: string;
//   price: number;
//   amount: number;
// }

const AddToCart = ({ id, name, image, price, priceWithoutDiscount, variant }: { id: string, name:string, image:string, price:number, priceWithoutDiscount: number, variant?: "full"}) => {
    //@ts-ignore
    const {cartData, setCartData} = useAppContext();



    async function AddDataToCart(){

      let exist = 0
      let del = 0


        cartData.map((data: any,index:number)=>{
          if (data.name == name){
            exist = 1
            del = index
          }
        })

        if(exist == 0){
          setCartData((prev:any) =>[...prev, {id: id, name: name, image: image, price: price, priceWithoutDiscount: priceWithoutDiscount, quantity: 1} ]);

        }else{
          cartData.splice(del,1);
          setCartData((prev:any)=>[...prev], cartData); 
        }
        

        await productAddedToCart(id);

        event("Purchase", { currency: "USD", value: 10 });
    }

    //@ts-ignore
    // const {cartData, setCartData} = useAppContext();

    // console.log(id);

    // function AddDataToCart(){

    //   let exist = 0
    //   let del = 0


    //     cartData.map((data: CartData[],index:number)=>{
    //       if (data[index].name === name){
    //         exist = 1
    //         del = index
    //       }
    //     })

    //     if(exist == 0){
    //       setCartData((prev: CartData[]) => [...prev, {id, name, image, price, amount = 1}] );
    //     }else{
    //       cartData.splice(del, 1);
    //       setCartData((prev: CartData[])=>[...prev], cartData); 
    //     }
        
        
    //     console.log('f', cartData);
    // }

    if(variant === "full") {
      return (
        <Button className="w-48 max-[425px]:w-full" onClick={AddDataToCart}>
          <ShoppingCart className="mr-2" size={20} />
          Додати в кошик
        </Button>
      )
    } else {
      return (
        <Button className="border-[1px] border-black  mr-1 px-9 z-20" onClick={AddDataToCart}>У кошик</Button>
      )
    }
}

export default AddToCart