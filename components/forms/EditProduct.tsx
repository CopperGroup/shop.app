"use client";

import * as z from "zod";
import Image from "next/image";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProduct, } from "@/lib/actions/product.actions";
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
import { ProductValidation } from "@/lib/validations/product";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { CheckboxSmall } from "../ui/checkbox-small";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import DeleteProductButton from "../interface/DeleteProductButton";

type ProductFormValues = z.infer<typeof ProductValidation>;
type DiscountType = "percentage" | "digits";
type UploadingState = "initial" | "uploading" | "success" | "error";

const EditProduct = ({ productProperities }: { productProperities: string}) => {
  const [ price, setPrice ] = useState<string>("");
  const [ rawPrice, setRawPrice ] = useState<string>("");
  const [ priceFocused, setPriceFocused ] = useState(false);
  const [ discountPrice, setDiscountPrice ] = useState<string>("");
  const [ discountPercentage, setDiscountPercentage ] = useState<number>(0);
  const [ focused, setFocused ] = useState(false);
  const [ discountType, setDiscountType ] = useState<DiscountType>("percentage");
  const [ noDiscount, setNoDiscount ] = useState<boolean>(false); 

  const [ images, setImages ] = useState<string[]>([]);
  const [ files, setFiles ] = useState<File[]>([]);
  const [ uploadProgress, setUploadProgress ] = useState<number>(0);
  const [ uploadingState, setUploadingState ] = useState<UploadingState>("initial");

  const [ inputValue, setInputValue ] = useState("");
  const [ hoveredIndex, setHoveredIndex ] = useState<number | null>(null);

  const [ categories, setCategories ] = useState<{name: string, amount: number}[]>([]);
  const [ isNewCategory, setIsNewCategory ] = useState<boolean>(false);

  const [ params ] = useState([
    { name: "Model"},
    { name: "Width"},
    { name: "Height"},
    { name: "Depth"},
    { name: "Type"},
    { name: "Color"},
  ])
  const paramsNamesUa = ['Назва', 'Ширина', 'Висота', 'Глибина', 'Вид', 'Колір'];

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    console.log(files)
  }, [])

  useEffect(() => {
    if(files.length > 0) {
      startUpload(files);
    } else {
      console.log(files.length, "No files found");
    }
  }, [files])

  const { startUpload, permittedFileInfo } = useUploadThing(
    "imageUploader",
    {
      onClientUploadComplete: (res) => {
        setUploadingState("success");
        setImages([...images, res[0].url]);
        
        setTimeout(() => {
          setUploadingState("initial")
          setUploadProgress(0)
        }, 300)
      },
      onUploadError: () => {
        setUploadingState("error");

        setTimeout(() => {
          setUploadingState("initial")
          setUploadProgress(0)
        }, 700)
      },
      onUploadProgress: (progress: number) => {
        setUploadProgress(progress);
        if(progress === 100) {
          setTimeout(() => {
            setUploadingState("success");
          }, 200)
        }
      },
      onUploadBegin: () => {
        setUploadingState("uploading")
      }
    }
  )

  const handleChange = (event: { target: { value: string; }; }) => {
    setInputValue(event.target.value);
  };

  const handleImageAdding = () => {
      setImages([...images, inputValue]);
      setInputValue("");
  }

  const handleDeleteImage = (index: number| null) => {
    setImages(images.filter((_, i) => i !== index));
  }

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

    const {getRootProps, getInputProps} = useDropzone({
      onDrop,
      accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined
    })

  const form = useForm<z.infer<typeof ProductValidation>>({
    resolver: zodResolver(ProductValidation),
  });

  const onSubmit = async (values: z.infer<typeof ProductValidation>) => {

    await editProduct({
      id: values.id,
      name: values.name,
      quantity: parseFloat(values.quantity),
      images: images,
      url: values.url ? values.url : "",
      price: parseFloat(price),
      priceToShow: parseFloat(discountPrice),
      vendor: values.vendor,
      category: values.category,
      description: values.description,
      isAvailable: values.isAvailable as boolean,
      params: {
        Model: values.Model,
        Width: values.Width,
        Height: values.Height,
        Depth: values.Depth,
        Type: values.Type,
        Color: values.Color
      },
      customParams: values.customParams
    })

    router.back()
  }
  
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customParams",
  });
  
  useEffect(() => {
    // Set the initial value of rawPrice from the form field
    if (price) {
      setRawPrice(price); 
    }
  }, [price]);
  
  useEffect(() => {
            const parsedPrice = parseFloat(price);
            const parsedDiscountPrice = parseFloat(discountPrice);
        
            if (!isNaN(parsedPrice) && !isNaN(parsedDiscountPrice) && parsedPrice !== 0) {
              const percentage = ((parsedPrice - parsedDiscountPrice) / parsedPrice) * 100;
              setDiscountPercentage(percentage);
            }
  }, [price, discountPrice]);

  useEffect(() => {
            if(discountPercentage) {
              console.log(discountPercentage);
              console.log(discountPrice);
          
              const discountValue = parseFloat(price) - ((discountPercentage / 100) * parseFloat(price));
          
              setDiscountPrice(`${discountValue}`);
        
              console.log("Result " + discountValue);
            } else {
              setDiscountPercentage(0);
        
              console.log(discountPercentage);
              console.log(discountPrice);
          
              const discountValue = parseFloat(price) - ((discountPercentage / 100) * parseFloat(price));
          
              setDiscountPrice(`${discountValue}`);
        
              console.log("Result " + discountPrice);
            }
  }, [discountPercentage])

  const handleNoDiscount = (value: boolean) => {
    if(value) {
      setDiscountPrice(price);
      setDiscountPercentage(0);
      setDiscountType("percentage");
    }
  }

  useEffect(() => {
    const fetchProductProperities = () => {
        try {
            const { properities: parsedProductProperities, params: fetchedParams, categories } = JSON.parse(productProperities as string)

            parsedProductProperities.forEach(({ name, value }: { name: string, value: string | string[]}) => {
              form.setValue(name as keyof ProductFormValues, value as string)

              if(name === "price") {
                setPrice(value as string);
              }
              if(name === "priceToShow") {
                setDiscountPrice(value as string);
              }
              if(name === "images") {
                setImages(value as string[])
              }
            })
            
            setCategories(categories);

            remove();

            fetchedParams.forEach(({ name, value }: { name: string, value: string }) => {
                const valueName = mapFieldName(name);

                if (params.some((param) => param.name === valueName)) {
                    form.setValue(valueName as keyof ProductFormValues, value);
                } else {
                    append({ name, value });
                }
            });

            console.log("Category", form.getValues("category"));
          } catch (error: any) {
            throw new Error(`Error appending existing product properities: ${error.message}`)
          }
        }
        
        fetchProductProperities();
  }, [productProperities])

  // useEffect(() => {
  //   const fetchProductParams = async () => {
  //       try {
    //           const productParams = await getProductParams(productId);
    //           const fetchedParams = JSON.parse(productParams);
    
  //           remove();
  
  //           fetchedParams.forEach(({ name, value }: { name: string, value: string }) => {
  //               const valueName = mapFieldName(name);
  
  //               if (params.some((param) => param.name === valueName)) {
  //                   form.setValue(valueName as keyof ProductFormValues, value);
  //               } else {
  //                   append({ name, value });
  //               }
  //           });
  //       } catch (error) {
  //           console.error("Error fetching product parameters:", error);
  //       }
  //   }
  
  //   fetchProductParams()
  // }, [productId]);

  const addCustomParam = () => {
    append({ name: "", value: "" });
  };
  
  const customParams = useWatch({
    control: form.control,
    name: "customParams",
    defaultValue: []
  }) ?? [];
  
  // Use `useMemo` to check if all custom parameters are filled
  const areAllParamsFilled = useMemo(() => {
    return customParams.every(
      (param: { name: string; value: string }) => param.name.trim() && param.value.trim()
    );
  }, [customParams]);
  
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
    <Form {...form}>
      <form
        className='w-full flex gap-5 custom-scrollbar max-[900px]:flex-col'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="w-1/2 h-fit flex flex-col gap-5 max-[900px]:w-full">
          <div className="w-full h-fit pl-4 pr-5 py-4 border rounded-2xl">
            <FormField
              control={form.control}
              name='id'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel className='w-full text-base-semibold text-[15px] mb-4'>
                    ID товару
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px]"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full h-fit pl-4 pr-5 py-4 border rounded-2xl">
            <h4 className="w-full text-base-semibold text-[15px] mb-4">Загальна інформація</h4>
            <div className="w-full flex flex-col gap-2">
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-small-medium text-[14px] text-dark-1'>
                      Ім&apos;я товару<span className="text-subtle-medium"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-small-medium text-[14px] text-dark-1'>
                      Опис<span className="text-subtle-medium"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        rows={1}
                        className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 resize-none ml-1 focus-visible:ring-black focus-visible:ring-[1px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-full h-fit pl-4 pr-5 py-4 border rounded-2xl">
            <h4 className="w-full text-base-semibold text-[15px] mb-4">Медіа</h4>
            <p className="text-small-medium text-[14px] text-dark-1 mb-3">Зображення товару <span className="text-subtle-medium">(до 4MB)</span></p>
            {uploadingState === "initial" && (
              <div className="w-full h-36 flex justify-center items-center flex-col bg-blue/5 border border-blue border-dashed rounded-md hover:bg-blue/10">
                <div {...getRootProps()} className="w-full h-full flex flex-col justify-center items-center cursor-pointer">
                  <input {...getInputProps()} />
                  <Image
                    src="/assets/photo-blue.svg"
                    width={28}
                    height={32}
                    alt="Upload image"
                  />
                  <p className="text-subtle-medium text-black text-center max-[490px]:text-[11px] max-[340px]:text-[10px]"><span className="text-blue">Натисніть</span> або перетягніть, щоб завантажити</p>
                </div>
              </div>
            )}

            {uploadingState === "uploading" && (
              <div className="w-full h-36 flex justify-center items-center flex-col bg-orange-400/5 border border-orange-400 border-dashed rounded-md transition-all hover:bg-orange-400/10">
                <div className="w-full h-full flex flex-col justify-center items-center cursor-pointer">
                  <p className="text-subtle-medium text-black text-center max-[490px]:text-[11px] max-[340px]:text-[10px]">Завантаження <span className="text-orange-500 transition-all">{uploadProgress}%</span></p>
                </div>
              </div>
            )}

            {uploadingState === "success" && (
              <div className="w-full h-36 flex justify-center items-center flex-col bg-green-500/5 border border-green-500 border-dashed rounded-md hover:bg-green-500/10">
                <div className="w-full h-full flex flex-col justify-center items-center cursor-pointer">
                  <Image
                    src="/assets/check-circle-green.svg"
                    width={32}
                    height={32}
                    alt="Upload image"
                  />
                  <p className="text-subtle-medium text-black text-center max-[490px]:text-[11px] max-[340px]:text-[10px]">Зображення <span className="text-green-500">завантажено</span></p>
                </div>
              </div>
            )}

            {uploadingState === "error" && (
              <div className="w-full h-36 flex justify-center items-center flex-col bg-red-500/5 border border-red-500 border-dashed rounded-md hover:bg-red-500/10">
                <div className="w-full h-full flex flex-col justify-center items-center cursor-pointer">
                  <Image
                    src="/assets/error-red.svg"
                    width={32}
                    height={32}
                    alt="Upload image"
                  />
                  <p className="text-subtle-medium text-black text-center max-[490px]:text-[11px] max-[340px]:text-[10px]"><span className="text-red-500">Помилка</span> завантаження</p>
                </div>
              </div>
            )}

            {images.length > 0 && (
              <div className="w-full flex gap-2 shrink-0 mt-5 max-[425px]:hidden">
                {images.slice(0, 4).map((image, index) => (
                  <div 
                    key={index} 
                    className={`relative min-w-[10rem] size-[10rem] flex justify-center items-center rounded-2xl cursor-pointer p-2 ${index === 3 && "max-[1700px]:hidden max-[900px]:flex max-[840px]:hidden max-[767px]:flex max-[590px]:hidden"} max-[1380px]:size-[8rem] max-[1380px]:min-w-[8rem] max-[1200px]:size-[7rem] max-[1200px]:min-w-[7rem] max-[1100px]:size-[6rem] max-[1100px]:min-w-[6rem] max-[940px]:size-[5.5rem] max-[940px]:min-w-[5.5rem] max-[900px]:size-[8rem] max-[650px]:size-[7rem] max-[470px]:size-[6rem] `}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Image
                      src={image ? image : "image"}
                      width={156}
                      height={156}
                      alt="Product image"
                      className="max-w-full max-h-full"
                    />
                   {hoveredIndex === index && (
                      <div className="absolute size-full flex flex-col justify-center items-center rounded-2xl bg-black/50">
                        <Button
                          type="button"
                          className="bg-red-500 text-white border border-red-500 transition-all hover:bg-transparent"
                          size="sm"
                          onClick={() => handleDeleteImage(index)}
                        >
                          Видалити
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="w-full h-fit flex gap-2 justify-end mt-3">
                <Dialog>
                    <DialogTrigger className="items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:text-accent-foreground rounded-md px-3 h-[1.87rem] flex gap-1 text-black border hover:bg-neutral-200"> {/* Coppied from Shadcn button, variant: default*/}
                      <Image
                        src="/assets/arrow-up-tray.svg"
                        width={16}
                        height={16}
                        alt="Add images"
                      />
                      <p className="text-subtle-medium">Імпортувати</p>
                    </DialogTrigger>
                    <DialogContent className="bg-white border-black">
                        <DialogHeader>
                            <DialogTitle>Посилання на зображення</DialogTitle>
                            <DialogDescription>Вставте посилання на зображення, щоб додати його до товару</DialogDescription>
                        </DialogHeader>
                        <Input
                            value={inputValue}
                            onChange={handleChange}
                        />
                        <DialogFooter>
                            <Button onClick={handleImageAdding}>Додати</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                  <Dialog>
                    <DialogTrigger className="items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-input bg-background hover:text-accent-foreground rounded-md px-3 h-[1.87rem] flex gap-1 text-black border hover:bg-neutral-200"> {/* Coppied from Shadcn button, variant: default*/}
                      <Image
                        src="/assets/eye.svg"
                        width={16}
                        height={16}
                        alt="Add images"
                      />
                      <p className="text-subtle-medium max-[345px]:hidden">Перегянути</p>
                    </DialogTrigger>
                    <DialogContent className="max-w-[80vw] h-[80vh] bg-white border-black rounded-2xl  overflow-y-auto py-5">
                    <div className="w-full h-fit grid grid-cols-7 max-[1800px]:grid-cols-6 max-[1530px]:grid-cols-5 max-[1050px]:grid-cols-4 max-[720px]:grid-cols-3 max-[520px]:grid-cols-1 max-[520px]:justify-items-center">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className="relative size-48 flex justify-center items-center rounded-2xl cursor-pointer p-2 max-[1270px]:size-40 max-[870px]:size-32 max-[520px]:size-52 max-[520px]:w-[93%] max-[360px]:h-44"
                          onMouseEnter={() => handleMouseEnter(index)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <Image
                            src={image}
                            width={192}
                            height={192}
                            alt="Product image"
                            className="max-w-full max-h-full max-[520px]:max-w-52 max-[520px]:max-h-52 max-[360px]:max-w-44 max-[360px]:max-h-44"
                          />
                          {hoveredIndex === index && (
                            <div className="absolute size-full flex flex-col justify-center items-center rounded-2xl bg-black/50">
                              <Button
                                type="button"
                                className="bg-red-500 text-white border border-red-500 transition-all hover:bg-transparent"
                                size="sm"
                                onClick={() => handleDeleteImage(index)}
                              >
                                Видалити
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    </DialogContent>
                  </Dialog>

            </div>
          </div>
          <div className="w-full h-fit pl-4 pr-5 py-4 border rounded-2xl">
            <h4 className="w-full text-base-semibold text-[15px] mb-4">Інвентар</h4>
              <FormField
                control={form.control}
                name='quantity'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-small-medium text-[14px] text-dark-1'>
                      Кількість<span className="text-subtle-medium"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          {/* <div className="w-full h-fit pl-4 pr-5 py-4 border rounded-2xl">
            <h4 className="w-full text-base-semibold text-[15px] mb-4">Стан</h4>
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel className='text-small-medium text-[14px] text-dark-1 mt-[6px]'>
                      Доступний
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                        className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-2 focus-visible:ring-black focus-visible:bg-black focus-visible:ring-[1px] data-[state=checked]:bg-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div> */}
        </div>
        
        <div className="w-1/2 h-fit flex flex-col gap-5 max-[900px]:w-full">
          <div className="w-full h-fit pl-4 pr-5 py-4 border rounded-2xl">
            <h4 className="w-full text-base-semibold text-[15px] mb-4">Ціни</h4>
            <div className="w-full flex flex-col gap-2">
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-small-medium text-[14px] text-dark-1'>
                      Звичайна ціна<span className="text-subtle-medium"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                          type='text'
                          className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px]"
                          value={priceFocused ? rawPrice : `₴ ${rawPrice}`} // Use the raw input value for the input field
                          onChange={(e) => {

                            const rawValue = e.target.value.replace(/[^\d.]/g, "");

                            setPriceFocused(true);
                            setRawPrice(rawValue);
                          }}
                          onBlur={() => {
                            if (!isNaN(parseFloat(rawPrice)) && rawPrice !== "") {
                              const formattedPrice = `${parseFloat(rawPrice).toFixed(2)}`;
                              setPrice(formattedPrice);
                              setRawPrice(formattedPrice);
                            } else {
                              setRawPrice(""); 
                            }
                            setPriceFocused(false);
                          }}
                          onFocus={() => {setPriceFocused(true)}}
                        />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {noDiscount === false && (
                <div className="w-full h-fit">
                  <p className='w-full text-small-medium text-[14px] text-dark-1'>
                    {discountType === "percentage" ? "Знижка у відсотках (%)" : "Ціна зі знижкою"}<span className="text-subtle-medium"> *</span>
                  </p>
                  <div className="w-full h-fit flex gap-2 items-end max-[370px]:flex-col max-[370px]:px-1">
                    {discountType === "percentage" ? (
                      <div className="w-full h-full">
                        <Input
                          type='text'
                          id="discountPercentage"
                          className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 mt-2 focus-visible:ring-black focus-visible:ring-[1px] max-[370px]:ml-0"
                          value={focused ? `${discountPercentage.toFixed(0)}` : `${discountPercentage.toFixed(0)}%`}
                          onChange={(e) => {
                            const value = e.target.value.replace('%', '');
                            setDiscountPercentage(value !== "" ? parseFloat(value) : 0);
                          }}
                          onBlur={() => setFocused(false)}
                          onFocus={() => setFocused(true)}
                        />
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name='priceToShow'
                        render={({ field }) => (
                          <FormItem className="w-full h-full">
                            <FormLabel className='text-small-medium text-[14px] text-dark-1'>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type='text'
                                className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px]"
                                defaultValue={(parseFloat(price) - (parseFloat(price) * (discountPercentage / 100))).toFixed(2)}
                                onChange={(e) => {setDiscountPrice(e.target.value); console.log("Discount price after: " + discountPrice)}}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    <Select defaultValue="percentage" onValueChange={(value: DiscountType) => setDiscountType(value)}>
                      <SelectTrigger className="w-64 text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px] max-[370px]:w-full">
                        <SelectValue placeholder="Знижка"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">У відсотках (%)</SelectItem>
                        <SelectItem value="digits">У числах</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className={`w-full h-fit flex gap-1 ${noDiscount ? "justify-end" : "justify-between"} items-center mt-2 max-[370px]:px-1`}>
                {!noDiscount && (discountType === "percentage" ? (
                  <p className="text-subtle-medium leading-none ml-1"><span className="max-[370px]:hidden">Ціна зі знижкою</span><span className="min-[371px]:hidden">=</span> ₴{(parseFloat(price) - (parseFloat(price) * (discountPercentage / 100))).toFixed(2)}</p>
                ): (
                  <p className="text-subtle-medium leading-none ml-1"><span className="max-[370px]:hidden">Відсоток знижки</span><span className="min-[371px]:hidden">=</span> {discountPercentage.toFixed(0)}%</p>
                ))}
                <div className="w-fit h-full flex gap-1">
                  <CheckboxSmall id="noDiscount" className="size-3 rounded-[4px] border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white" onCheckedChange={(value: boolean) => {handleNoDiscount(value), setNoDiscount(value)}}/>
                  <label htmlFor="noDiscount" className="text-subtle-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Без знижки</label>
                </div>
              </div>
              {/* <div className="w-full h-fit flex gap-1 justify-end items-center mt-2 min-[371px]:hidden">
                <CheckboxSmall id="noDiscount" className="size-3 rounded-[4px] border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white" onCheckedChange={(value: boolean) => {handleNoDiscount(value), setNoDiscount(value)}}/>
                <label htmlFor="noDiscount" className="text-subtle-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Без знижки</label>
              </div> */}
            </div>
          </div>
          <div className="w-full h-fit pl-4 pr-5 py-4 border rounded-2xl">
            <h4 className="w-full text-base-semibold text-[15px] mb-4">Джерела</h4>
              <div className="w-full flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="vendor"
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className='text-small-medium text-[14px] text-dark-1'>
                        Постачальник<span className="text-subtle-medium"> *</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className='text-small-medium text-[14px] text-dark-1'>
                        Посилання на товар
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='text'
                          className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
          </div>

          <div className="w-full h-fit pl-4 pr-5 py-4 border rounded-2xl">
            <h4 className="w-full text-base-semibold text-[15px] mb-4">Категорія</h4>
              {isNewCategory ? (
                <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormLabel className='text-small-medium text-[14px] text-dark-1'>
                      Назва категоріЇ<span className="text-subtle-medium"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              ): (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel className='text-small-medium text-[14px] text-dark-1'>
                        Категорія товару<span className="text-subtle-medium"> *</span>
                      </FormLabel>
                      <Select        
                        onValueChange={(value) => {
                          // Check if the value is defined before setting it because Initial Rendering and Component Mounting: When the component containing the Select is rendered for the first time, React initializes all the states and props. During this process, the Select component is mounted, and onValueChange is triggered because the component tries to reconcile the initial state of the Select with its current value. Since no value has been selected yet, it is initially undefined.
                          if (value) {
                            field.onChange(value);
                          }
                        }} 
                        {...field}
                      >
                        <FormControl>
                          <SelectTrigger className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px]">
                            <SelectValue className="text-small-regular text-gray-700 text-[13px]"></SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category, index) => (
                            <SelectItem key={index} value={category.name}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="w-full flex justify-end mt-2">
                <Button type="button" className="text-subtle-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 py-0 px-0 -mb-3" variant="destructive" onClick={() => setIsNewCategory(prev => !prev)}>{isNewCategory ? "Вибрати існуючу?" : "Створити нову?"}</Button>
              </div>
          </div>

          <div className="w-full h-fit pl-4 pr-5 py-4 border rounded-2xl">
            <h4 className="w-full text-base-semibold text-[15px] mb-4">Параметри</h4>
            <div className="w-full grid grid-cols-2 gap-3 max-[425px]:grid-cols-1">
              {params.map((param,index) => (
                <FormField
                  key={param.name}
                  control={form.control}
                  name={param.name as keyof ProductFormValues}
                  render={({ field }) => (
                      <FormItem className='w-full'>
                          <FormLabel className='text-small-medium text-[14px] text-dark-1'>
                              {paramsNamesUa[index]} {['Ширина', 'Висота', 'Глибина'].includes(paramsNamesUa[index]) && (<span className="text-subtle-medium">(см)</span>)}<span className="text-subtle-medium"> *</span>
                          </FormLabel>
                          <FormControl>
                              <Input
                                  type='text'
                                  className='text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px]'
                                  value={
                                    paramsNamesUa[index] === "Назва" && typeof field.value === "string"
                                      ? field.value.replace(/_/g, " ")
                                      : field.value as string
                                  }
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
              {fields.map((field, index) => (
                        <FormItem key={field.id} className='w-full'>
                          <div className="relative w-full flex justify-end">
                            <FormLabel className='w-full text-base-semibold text-dark-1 max-lg:w-full'>
                                <Input
                                    placeholder="Назва параметра"
                                    {...form.register(`customParams.${index}.name` as const)}
                                    className='w-full appearance-none text-small-medium text-[14px] text-dark-1 bg-transparent rounded-none border-0 border-b ml-1 px-0 focus-visible:ring-0 focus-visible:border-black'
                                    // onChange={(e) => {field.name = e.target.value; console.log(field)}}
                                />
                            </FormLabel>
                              <Button type="button" onClick={() => remove(index)} variant="outline" className="absolute h-fit bg-white border-0 px-0 pr-3 pt-3 -mr-2 transition-all hover:pt-2">
                                <Image
                                  src="/assets/delete.svg"
                                  width={16}
                                  height={16}
                                  alt="Delete"
                                />
                              </Button>
                          </div>
                            <FormControl>
                                <Input
                                    type='text'
                                    placeholder="Значення"
                                    {...form.register(`customParams.${index}.value` as const)}
                                    className="text-small-regular text-gray-700 text-[13px] bg-neutral-100 ml-1 focus-visible:ring-black focus-visible:ring-[1px]"
                                    // onChange={(e) => {field.value = e.target.value; console.log(field)}}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                ))}
            </div>
            {areAllParamsFilled && (
              <div className="w-full flex justify-end">
                <Button onClick={addCustomParam} className="size-7 text-[28px] text-black font-light bg-transparent rounded-xl border border-transparent ml-1 mt-4 p-0 pb-1 transition-all hover:bg-transparent hover:pb-3" size="sm">
                  +
                </Button>
              </div>
            )}
          </div>
          <div className="w-full flex gap-1">
            <Button type='submit' className='w-full bg-green-500 hover:bg-green-400' size="sm">
              Зберегти зміни
            </Button>
            <DeleteProductButton id={form.getValues("id")}/>
          </div>
          <div className="w-full flex justify-end">
            <FormField
              control={form.control}
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="w-fit h-full flex items-center gap-1">
                  <FormLabel className='text-subtle-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-2'>
                    Доступний
                  </FormLabel>
                  <FormControl>
                    <CheckboxSmall 
                      className="size-3 rounded-[4px] border-neutral-600 data-[state=checked]:bg-black data-[state=checked]:text-white" 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
)}

export default EditProduct;