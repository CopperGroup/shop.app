"use client";

import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/lib/actions/product.actions";
import { OrderValidation } from "@/lib/validations/order";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAppContext } from "@/app/(root)/context";
import { createOrder } from "@/lib/actions/order.actions";



// interface CartData {
//   id: string;
//   name: string;
//   image: string;
//   price: number;
//   amount: number;
// }

const CreateOrder = ({ userId, email }: { userId: string, email: string}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof OrderValidation>>({
    resolver: zodResolver(OrderValidation),
  });

  const {cartData, priceToPay, setCartData} = useAppContext();
  const data = cartData;

  const products = cartData.map((product: {id: string, name: string, image: string, price: number, priceWithoutDiscount: number, quantity: number}) => ({product: product.id, amount: product.quantity}))

  console.log(products);

  const onSubmit = async (values: z.infer<typeof OrderValidation>) => {
    await createOrder({
      products: products,
      userId: userId,
      value: priceToPay,
      name: values.name,
      surname: values.surname,
      phoneNumber: values.phoneNumber,
      email: values.email,
      paymentType: values.paymentType,
      deliveryMethod: values.deliveryMethod,
      city: values.city,
      adress: values.adress,
      postalCode: values.postalCode,
      comment: values.comment
    })

    setCartData([]);
    router.push(`/myOrders`)
  }

  form.setValue("email", email);

  return (
    <Form {...form}>
      <form
        className='w-full custom-scrollbar'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="w-full flex max-lg:flex-col ">

          <div className="flex flex-col pr-5 max-lg:mb-10 gap-12 w-full border-r-2 border-gray-700 max-lg:border-0 max-lg:p-0 pl-16 py-12">

            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='flex w-full gap-3 flex-col pr-56 max-xl:pr-0'>
                  <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                    Ім&apos;я
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      className=''
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='surname'
              render={({ field }) => (
                <FormItem className='flex w-full gap-3 flex-col pr-56 max-xl:pr-0'>
                  <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                    Прізвище
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      className=''
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem className='flex w-full gap-3 flex-col pr-56 max-xl:pr-0'>
                  <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                    Номер телефону
                  </FormLabel>
                  <FormControl>
                    <Input
                        type='text'
                        className=''
                        {...field}
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="w-full h-[2px] bg-gray-400 my-5 rounded-lg"></div> */}

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='flex w-full gap-3 flex-col pr-56 max-xl:pr-0'>
                  <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                        type='email'
                        className=''
                        {...field}
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='paymentType'
              render={({ field }) => (
                <FormItem className='flex w-full gap-3 flex-col pr-56 max-xl:pr-0'>
                  <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                    Спосіб оплати
                  </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Виберіть спосіб оплати"/>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="cursor-poiner">
                        <SelectItem value="Накладний платіж" className="cursor-poiner">Накладний платіж</SelectItem>
                      </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-12 w-full max-lg:p-0 pl-16 py-12">
            <FormField
              control={form.control}
              name='deliveryMethod'
              render={({ field }) => (
                <FormItem className='flex w-full gap-3 flex-col pr-56 max-xl:pr-0'>
                  <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                    Спосіб доставки
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Виберіть спосіб доставки"/>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="cursor-poiner">
                      <SelectItem value="Нова пошта (У відділення)" className="cursor-poiner">Нова пошта (У відділення)</SelectItem>
                      <SelectItem value="Нова пошта (До дому)" className="cursor-poiner">Нова пошта (До дому)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="w-full h-[2px] bg-gray-400 my-5 rounded-lg"></div> */}

            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem className='flex w-full gap-3 flex-col pr-56 max-xl:pr-0'>
                  <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                    Місто
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      className=''
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='adress'
              render={({ field }) => (
                <FormItem className='flex w-full gap-3 flex-col pr-56 max-xl:pr-0'>
                  <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                    Адреса
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      className=''
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='postalCode'
              render={({ field }) => (
                <FormItem className='flex w-full gap-3 flex-col pr-56 max-xl:pr-0'>
                  <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                    Поштовий код
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      className=''
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='comment'
              render={({ field }) => (
                <FormItem className='flex w-full gap-3 flex-col pr-56 max-xl:pr-0'>
                  <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                    Коментар
                  </FormLabel>
                  <FormControl>
                    <Textarea
                        rows={5}
                        className=''
                        {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className="w-full h-[2px] bg-gray-400 my-5 rounded-lg"></div> */}

          </div>
        </div>

        <Button type='submit' className='bg-green-500 hover:bg-green-400 w-full mt-20'>
          Створити замовлення
        </Button>
      </form>
    </Form>
)}

export default CreateOrder;