"use client";

import * as z from "zod";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FaMeta } from "react-icons/fa6";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { PixelValidation } from "@/lib/validations/pixel";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPixel } from "@/lib/actions/pixel.actions";
import CryptoJS from "crypto-js";

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

const CreatePixel = () => {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)

  const form = useForm<z.infer<typeof PixelValidation>>({
    resolver: zodResolver(PixelValidation)
  })

  const onSubmit = async (values: z.infer<typeof PixelValidation>) => {
    const encryptedPixelID = CryptoJS.AES.encrypt(values.id, encryptionKey as string).toString();

    await createPixel({
      type: "Meta",
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
          className="w-full text-small-medium h-9 bg-[#F0F6FF] text-[#0668E1] hover:bg-[#E1EDFF] hover:text-[#0557BD] transition-all duration-300"
          variant="outline"
        >
          <Plus className="mr-2 h-3 w-3" /> Add Meta Pixel
        </Button>
      ) : (
        <Card className="mt-4 border border-muted shadow-sm transition-all duration-300 ease-in-out">
          <CardContent className="pt-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label className="text-[16px] text-muted-foreground">
                        Pixel Name
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter pixel name"
                          className="text-base-regular h-10 transition-all duration-200 focus:ring-2 focus:ring-[#0668E1]"
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
                      <Label className="text-[16px] text-muted-foreground">
                        Pixel Id
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter pixel Id"
                          className="text-base-regular h-10 transition-all duration-200 focus:ring-2 focus:ring-[#0668E1]"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="h-9 flex-1 text-small-medium text-white bg-[#0668E1] hover:bg-[#0557BD] transition-all duration-300"
                  >
                    <FaMeta className="size-5 text-white"/>
                    <span className="ml-2">Add Pixel</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={(e) => {setIsFormOpen(false)}}
                    size="sm"
                    className="h-9 w-9 p-0 transition-all duration-200 hover:bg-gray-100"
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

export default CreatePixel