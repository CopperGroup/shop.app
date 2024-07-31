"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addParamsToProduct, getProductParams } from "@/lib/actions/product.actions";
import { ParamsValidation } from "@/lib/validations/params";
import { ProductValidation } from "@/lib/validations/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type ParamsFormValues = z.infer<typeof ParamsValidation>;

const GetParams = ({ productId }: { productId: string }) => {
    const [ params ] = useState([
        { name: "Model" },
        { name: "Width" },
        { name: "Height" },
        { name: "Depth" },
        { name: "Type" },
        { name: "Color" },
    ])


    const paramsNamesUa = ['Назва', 'Ширина', 'Висота', 'Глибина', 'Вид', 'Колір']

    const router = useRouter();

    const form = useForm<ParamsFormValues>({
        resolver: zodResolver(ParamsValidation),
        defaultValues: {
            customParams: [],
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "customParams",
    });

    const onSubmit = async (values: ParamsFormValues) => {
        await addParamsToProduct({ params: values, productId: productId });

        router.push(`/admin/createProduct/list/${productId}`);
    };

    const addCustomParam = () => {
        append({ name: "", value: "" });
    };

    useEffect(() => {
        const fetchProductParams = async () => {
            try {
                const productParams = await getProductParams(productId);
                const fetchedParams = JSON.parse(productParams);

                remove();

                fetchedParams.forEach(({ name, value }: { name: string, value: string }) => {
                    const valueName = mapFieldName(name);

                    if (params.some((param) => param.name === valueName)) {
                        form.setValue(valueName as keyof ParamsFormValues, value);
                    } else {
                        append({ name, value });
                    }
                });
            } catch (error) {
                console.error("Error fetching product parameters:", error);
            }
        }

        fetchProductParams()
    }, [productId]);

    const mapFieldName = (name: string) => {
        switch(name) {
            case "Ширина, см":
                return "Width";
            case "Висота, см":
                return "Height";
            case "Глибина, см":
                return "Depth";
            case "Вид":
                return "Type";
            case "Колір":
                return "Color";
            case "Товар":
                return "Model";
            default:
                return name;
        }
    }
    return (
        <section className="mt-12">
            <Form {...form}>
                <form
                    className='flex flex-col justify-start gap-8 custom-scrollbar'
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    {params.map((param,index) => (
                        <FormField
                            key={param.name}
                            control={form.control}
                            name={param.name as keyof ParamsFormValues}
                            render={({ field }) => (
                                <FormItem className='flex w-full gap-3 max-[1440px]:flex-col pr-[400px] max-xl:pr-0'>
                                    <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                                        <p className="mt-3 text-small-medium text-gray-500">{paramsNamesUa[index]}</p>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='text'
                                            className=''
                                            value={field.value as string}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <h3 className="text-heading2-semibold mt-10">Створіть власні властивості</h3>
                    {fields.map((field, index) => (
                        <FormItem key={field.id} className='flex w-full gap-3 max-[1440px]:flex-col pr-[400px] max-xl:pr-0'>
                            <FormLabel className='text-base-semibold w-2/5 text-dark-1 max-lg:w-full'>
                                <p className="min-[1441px]:hidden">Назва</p>
                                <Input
                                    placeholder="Custom Parameter Name"
                                    {...form.register(`customParams.${index}.name` as const)}
                                    className="mt-2"
                                />
                                <p className="min-[1441px]:hidden mt-3 -mb-3">Значення</p>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    placeholder="Custom Parameter Value"
                                    {...form.register(`customParams.${index}.value` as const)}
                                />
                            </FormControl>
                            <Button type="button" onClick={() => remove(index)} variant="outline" className="border-red-500 text-red-600 hover:bg-red-500 hover:text-white focus:bg-red-500 focus:text-white">
                                Видалити
                            </Button>
                            <div className="w-full h-[2px] bg-neutral-500 rounded-full"></div>
                            <FormMessage />
                        </FormItem>
                    ))}

                    <Button onClick={addCustomParam} className="w-72">
                        Додати властивість
                    </Button>

                    <Button type='submit' className='bg-green-500 hover:bg-green-400'>
                        Зберегти властивості
                    </Button>
                </form>
            </Form>
        </section>
    );
};

export default GetParams;