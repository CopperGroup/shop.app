"use client"

import * as z from "zod";
import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaTiktok } from "react-icons/fa6";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { PixelValidation } from "@/lib/validations/pixel";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPixel } from "@/lib/actions/pixel.actions";
import CryptoJS from "crypto-js";

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

export const CreateTikTokPixel = () => {
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  
    const form = useForm<z.infer<typeof PixelValidation>>({
        resolver: zodResolver(PixelValidation)
      })
    
    const onSubmit = async (values: z.infer<typeof PixelValidation>) => {
      const encryptedPixelID = CryptoJS.AES.encrypt(values.id, encryptionKey as string).toString();

      await createPixel({
        type: "TikTok",
        name: values.name,
        id: encryptedPixelID
      })


      form.setValue("name", "");
      form.setValue("id", "");

      setIsFormOpen(false);
    }
    
    return (
      <>
        {!isFormOpen ? (
          <Button
            onClick={() => setIsFormOpen(true)}
            className="w-full text-small-medium h-9 bg-white text-black hover:bg-gray-100 hover:text-black transition-all duration-300"
            variant="outline"
          >
            <Plus className="mr-2 h-3 w-3" /> Add TikTok Pixel
          </Button>
        ) : (
          <Card className="mt-4 border border-gray-200 shadow-sm transition-all duration-300 ease-in-out">
            <CardContent className="pt-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                         control={form.control}
                         name="name"
                         render={({ field }) => (
                        <FormItem className="space-y-2">
                        <Label className="text-base-semibold text-white">
                            Pixel Name
                        </Label>
                            <FormControl>
                                <Input
                                {...field}
                                placeholder="Enter pixel name"
                                className="text-base-regular h-10 transition-all duration-200 focus:ring-2 focus:ring-[#FF004F] bg-gray-800 text-white border-gray-700"
                                />
                            </FormControl>
                            </FormItem>
                            )}
                        />
                        <FormField
                         control={form.control}
                         name="id"
                         render={({ field }) => (
                            <FormItem className="space-y-2">
                                <Label className="text-base-semibold text-white">
                                    Pixel Name
                                </Label>
                                <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="Enter pixel Id"
                                      className="text-base-regular h-10 transition-all duration-200 focus:ring-2 focus:ring-[#FF004F] bg-gray-800 text-white border-gray-700"
                                />
                                </FormControl>
                            </FormItem>
                            )}
                        />
                        <div className="flex gap-2 pt-2">
                        <Button
                            type="submit"
                            className="text-small-medium flex-1 h-9 bg-[#FF004F] hover:bg-[#E6004A] transition-all duration-300 text-white"
                        >
                            <FaTiktok className="size-5 text-white"/>
                            <span className="ml-2">Add Pixel</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsFormOpen(false)}
                            size="sm"
                            className="h-9 w-9 p-0 transition-all duration-200 hover:bg-gray-700 text-white border-gray-700"
                            aria-label="Close form"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
          </Card>
        )}
      </>
    )
  }