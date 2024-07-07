'use client'

import React from 'react'
import { Button } from '../ui/button'
import { useAppContext } from '@/app/(root)/context'

// interface CartData {
//   id: string;
//   name: string;
//   image: string;
//   price: number;
//   amount: number;
// }

const AddToCart = ({ id, name, image, price}:{ id: string, name:string, image:string, price:number}) => {
    //@ts-ignore
    const {cartData, setCartData} = useAppContext();

  

    function AddDataToCart(){

      let exist = 0
      let del = 0


        cartData.map((data: any,index:number)=>{
          if (data[1] == name){
            exist = 1
            del = index
          }
        })

        if(exist == 0){
          setCartData((prev:any) =>[...prev, [id, name, image, price, 1] ]);
        }else{
          cartData.splice(del,1);
          setCartData((prev:any)=>[...prev], cartData); 
        }
        
        
        console.log('f', cartData);
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


  return (
    <Button className="border-[1px] border-black  mr-1 px-9 z-40" onClick={AddDataToCart}>У кошик</Button>
  )
}

export default AddToCart