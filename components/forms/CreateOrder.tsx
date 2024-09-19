"use client";

import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OrderValidation } from "@/lib/validations/order";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useAppContext } from "@/app/(root)/context";
import { createOrder } from "@/lib/actions/order.actions";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle, Truck, CreditCard, MessageSquare, ShoppingCart, Phone, Package } from "lucide-react";
import Confetti from 'react-confetti';

const CreateOrder = ({ userId, email }: { userId: string; email: string }) => {
  const router = useRouter();
  const { cartData, priceToPay, setCartData } = useAppContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [isOrderCreated, setIsOrderCreated] = useState(true);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showThankYou, setShowThankYou] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const [ position, setPosition ] = useState<"fixed" | "relative">("fixed")

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const form = useForm<z.infer<typeof OrderValidation>>({
    resolver: zodResolver(OrderValidation),
    defaultValues: {
      email: email,
    },
  });

  const products = cartData.map((product: { id: string; name: string; image: string; price: number; priceWithoutDiscount: number; quantity: number }) => ({
    product: product.id,
    amount: product.quantity,
  }));

  const onSubmit = async (values: z.infer<typeof OrderValidation>) => {
    const createdOrder = await createOrder({
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
      comment: values.comment,
    }, "json");

    const order = JSON.parse(createdOrder);

    setCartData([]);
    setIsOrderCreated(true);
    setOrderId(order.id);
    setTimeout(() => setShowThankYou(true), 3000);
    setTimeout(() => setShowConfetti(true), 3500);
  };

  const steps = [
    { icon: <CheckCircle className="w-6 h-6" />, title: "Особисті дані" },
    { icon: <Truck className="w-6 h-6" />, title: "Доставка" },
    { icon: <CreditCard className="w-6 h-6" />, title: "Оплата" },
    { icon: <MessageSquare className="w-6 h-6" />, title: "Підтвердження" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
      {isOrderCreated ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full flex flex-col items-center max-[425px]:pt-24"
        >
          <AnimatePresence>
            {showConfetti && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 pointer-events-none"
              >
                <Confetti
                  width={windowSize.width}
                  height={windowSize.height}
                  recycle={false}
                  numberOfPieces={200}
                  gravity={0.1}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 20, 1] }}
            transition={{ 
              duration: 1,
              times: [0, 0.7, 1],
              ease: "easeInOut",
            }}
            style={{
              position: position,
              left: position === "fixed" ? '50%' : '0%',
              translateX: position === "fixed" ? '-50%' : '0%',
              translateY: position === "fixed" ? '-50%' : '0%',
            }}
            onAnimationComplete={() => setPosition("relative")}
            className="bg-sky-100 rounded-full p-8 mb-8 overflow-hidden"
          >
            <motion.div
              initial={{ y: -200, rotate: 0}}
              animate={{ y: 0, rotate: [0, -10, 10, -5, 5, 0]}}
              transition={{
                y: {delay: 1.2, duration: 0.3},
                rotate: { delay: 1.5, duration: 0.5, ease: "easeInOut" },
              }}
            >
              <Package className="w-16 h-16 text-sky-600" />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.5 }}
            className="text-center mt-7"
          >
            <motion.h1 
              className="text-heading1-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5 }}
            >
              Замовлення створено успішно!
            </motion.h1>
            <motion.p 
              className="text-body-medium mb-8 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7 }}
            >
              Дякуємо за ваше замовлення. Наш менеджер зв&apos;яжеться з вами найближчим часом.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.9 }}
            >
              <Button
                onClick={() => router.push(`/myOrders/${orderId}`)}
                className="bg-sky-500 hover:bg-sky-600 px-6 py-3 rounded-lg text-base-medium text-white transition duration-300 w-full sm:w-auto"
              >
                {windowSize.width > 380 ? "Переглянути деталі замовлення" : "Переглянути деталі"}
              </Button>
              <div className="flex flex-1 justify-center items-center text-gray-600 bg-white px-4 py-2 rounded-lg shadow-md max-[640px]:w-full">
                <Phone className="w-5 h-5 mr-2 text-sky-500" />
                <span className="text-base-medium">Очікуйте на дзвінок</span>
              </div>
            </motion.div>
            <AnimatePresence>
              {showThankYou && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="mt-12 text-body-semibold text-sky-600"
                >
                  Дякуємо за покупку!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      ) : (
        <>
          <h1 className="w-full text-heading1-bold mb-10 text-center">Оформлення замовлення</h1>
          <div className="mb-12">
            <div className="flex flex-col items-center">
              <div className="flex gap-2 justify-between items-center w-full max-w-3xl mb-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <motion.div
                      className={`rounded-full p-3 ${
                        currentStep > index + 1 ? "bg-green-500" : currentStep === index + 1 ? "bg-sky-500" : "bg-gray-300"
                      } text-white mb-2`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {step.icon}
                    </motion.div>
                    <span className="text-small-medium text-center max-[450px]:hidden">{step.title}</span>
                  </div>
                ))}
              </div>
              <div className="w-full max-w-3xl h-2 bg-gray-200 rounded-full mt-2">
                <motion.div
                  className="h-full bg-sky-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base-medium">Ім&apos;я</FormLabel>
                                <FormControl>
                                  <Input {...field} className="rounded-lg" />
                                </FormControl>
                                <FormMessage className="text-small-regular" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="surname"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base-medium">Прізвище</FormLabel>
                                <FormControl>
                                  <Input {...field} className="rounded-lg" />
                                </FormControl>
                                <FormMessage className="text-small-regular" />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base-medium">Номер телефону</FormLabel>
                                <FormControl>
                                  <Input {...field} className="rounded-lg" />
                                </FormControl>
                                <FormMessage className="text-small-regular" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base-medium">Email</FormLabel>
                                <FormControl>
                                  <Input {...field} className="rounded-lg" />
                                </FormControl>
                                <FormMessage className="text-small-regular" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FormField
                          control={form.control}
                          name="deliveryMethod"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base-medium">Спосіб доставки</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Виберіть спосіб доставки" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Нова пошта (У відділення)">Нова пошта (У відділення)</SelectItem>
                                  <SelectItem value="Нова пошта (До дому)">Нова пошта (До дому)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-small-regular" />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base-medium">Місто</FormLabel>
                                <FormControl>
                                  <Input {...field} className="rounded-lg" />
                                </FormControl>
                                <FormMessage className="text-small-regular" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="adress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base-medium">Адреса</FormLabel>
                                <FormControl>
                                  <Input {...field} className="rounded-lg" />
                                </FormControl>
                                <FormMessage className="text-small-regular" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base-medium">Поштовий код</FormLabel>
                                <FormControl>
                                  <Input {...field} className="rounded-lg" />
                                </FormControl>
                                <FormMessage className="text-small-regular" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FormField
                          control={form.control}
                          name="paymentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base-medium">Спосіб оплати</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Виберіть спосіб оплати" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Накладний платіж">Накладний платіж</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-small-regular" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                    {currentStep === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FormField
                          control={form.control}
                          name="comment"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base-medium">Коментар до замовлення</FormLabel>
                              <FormControl>
                                <Textarea {...field} rows={4} className="rounded-lg" />
                              </FormControl>
                              <FormMessage className="text-small-regular" />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className={`flex justify-between mt-8 ${currentStep === steps.length &&  "max-[425px]:flex-col gap-2 justify-start"}`}>
                    {currentStep > 1 && (
                      <Button type="button" onClick={() => setCurrentStep(currentStep - 1)} variant="outline" className="text-base-medium">
                        Назад
                      </Button>
                    )}
                    {currentStep < steps.length && (
                      <Button type="button" onClick={() => setCurrentStep(currentStep + 1)} className="ml-auto text-base-medium text-white">
                        Далі
                      </Button>
                    )}
                    {currentStep === steps.length && (
                      <Button type="submit" className="ml-auto bg-green-500 hover:bg-green-600 text-base-medium text-white max-[425px]:w-full">
                        Підтвердити замовлення
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
            <div className="lg:sticky lg:top-6 self-start">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="text-heading4-medium flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Ваше замовлення
                  </h2>
                </div>
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto p-4">
                  {cartData.map((item: any, index: number) => (
                    <div key={index} className="flex items-center mb-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                      <Image src={item.image} alt={item.name} width={60} height={60} className="rounded-md mr-4 object-cover" />
                      <div className="flex-grow">
                        <h3 className="text-base-semibold">{item.name}</h3>
                        <p className="text-small-regular text-gray-500">Кількість: {item.quantity}</p>
                        <p className="text-base-medium">{item.price.toFixed(2)}₴</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-base-regular text-gray-600">Підсумок:</span>
                    <span className="text-base-semibold">{priceToPay}₴</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-regular text-gray-600">Доставка:</span>
                    <span className="text-base-semibold">Безкоштовно</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-body-semibold">Загальна сума:</span>
                    <span className="text-heading4-medium text-green-600">{priceToPay}₴</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 bg-sky-50 p-4 rounded-lg">
                <h3 className="text-heading4-medium mb-2 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Гарантія безпеки
                </h3>
                <p className="text-base-regular text-gray-600">
                  Ваші особисті дані в безпеці, ми використовуємо найновіші технології шифрування і не зберігаємо інформації про рахунки клієнтів.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateOrder;