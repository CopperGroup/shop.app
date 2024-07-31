"use client";

import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import Image from "next/image";
import { useHotkeys } from '@mantine/hooks';
import { addImagesToProduct, getProductImages, getProductParams } from "@/lib/actions/product.actions";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

const GetImagesLinks = ({ productId }: { productId: string }) => {
    const [ inputValue, setInputValue ] = useState("");
    const [ addedImages, setAddedImages ] = useState<string[]>([]);
    const [ hoveredImage, setHoveredImage ] = useState<number | null>(null);
    const [ proceedingState, setProceedingState ] = useState("Proceed");
    const [ redirectUrl, setRedirectUrl ] = useState(`/admin/createProduct/add-params/${productId}`)

    const router = useRouter();

    const handleChange = (event: { target: { value: string; }; }) => {
        setInputValue(event.target.value);
    };

    const handleImageAdding = () => {
        setAddedImages([...addedImages, inputValue]);
        setInputValue(""); // Clear the input after adding
    }

    useHotkeys([
        ['X', () => handleDeleteImage(hoveredImage)]
    ])

    const handleDeleteImage = (index: number| null) => {
        setAddedImages(addedImages.filter((_, i) => i !== index))
    }

    const handleProceed = async (addedImages: string[]) => {
        setProceedingState("Proceeding");
    
        try {
            await addImagesToProduct(addedImages, productId);

        } catch (error: any) {
            throw new Error(`Error adding images to product: ${error.message}`)
        } finally {
          setProceedingState("Success");
    
          setTimeout(() => {
            setProceedingState("Proceed")
          }, 2000)

          router.push(redirectUrl)
        }
    }

    useEffect(() => {
        const fethcProductImages = async () => {
            const productImages = await getProductImages(productId);

            console.log(productImages);

            setAddedImages(productImages);

            const productParams = await getProductParams(productId);

            const params = JSON.parse(productParams);

            if(params.length > 0) {
                setRedirectUrl(`/admin/createProduct/list/${productId}`)
            }
        }

        fethcProductImages();
    }, [])

    return (
        <section className={`w-full h-full overflow-hidden ${addedImages.length === 0 && "flex justify-center items-center"}`}>
            {addedImages.length > 0 && (
                <div className="w-full flex justify-end mt-20 px-5">
                    <Button variant="outline">Delete / <span className="font-bold">&nbsp;X</span></Button>
                </div>
            )}
            {addedImages.length > 0 && (
                <div className={`w-full grid grid-cols-7 gap-2 mt-4 px-3 py-2 max-[1845px]:grid-cols-6 max-[1850px]:gap-10 max-[1800px]:gap-5 max-[1650px]:grid-cols-5 max-[1650px]:gap-10 max-[1535px]:gap-5 max-[1440px]:grid-cols-4 max-[1440px]:gap-10 max-[1300px]:gap-5 max-[1250px]:grid-cols-3 max-[1250px]:gap-10 max-[1050px]:gap-5`}>
                    {addedImages.map((addedImage, index) => (
                        <div 
                         className="w-52 h-52 flex justify-center items-center bg-glass border rounded-2xl overflow-hidden hover:border-dark-4 shadow-lg"
                         onMouseEnter={() => setHoveredImage(index)}
                         onMouseLeave={() => setHoveredImage(null)}
                         key={index}
                        >
                            <Image
                                src={addedImage}
                                height={160}
                                width={160}
                                alt="Product image"
                                className="absolute max-w-40 max-h-40"
                            />
                            <div className="w-full h-full flex justify-end items-end mt-16">
                                <div 
                                 className="relative flex justify-center items-center h-24 w-10 bg-red-600 z-0 rotate-45 hover:bg-red-500 cursor-pointer"
                                 onClick={() => handleDeleteImage(index)}
                                >
                                    <Image
                                        src="/assets/delete-white.svg"
                                        height={24}
                                        width={24}
                                        alt="Delete"
                                        className="-rotate-45 mb-2"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className={`${addedImages.length > 0 && "flex justify-end mt-10 px-5 gap-3"}`}>
                <Dialog>
                    <DialogTrigger className="py-1 px-5 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90"> {/* Coppied from Shadcn button, variant: default*/}
                            Add images
                            <Image
                                src="/assets/plus-white.svg"
                                height={32}
                                width={32}
                                alt="Add images"
                                className="ml-2"
                            />
                    </DialogTrigger>
                    <DialogContent className="bg-white border-black">
                        <DialogHeader>
                            <DialogTitle>Provide image URL</DialogTitle>
                            <DialogDescription>
                                Paste in your image link for us to display it.
                            </DialogDescription>
                        </DialogHeader>
                        <Input
                            value={inputValue}
                            onChange={handleChange}
                        />
                        <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                console.log("Files: ", res);
                                setAddedImages([...addedImages, res[0].url])
                            }}
                            onUploadError={(error: Error) => {
                                alert(`ERROR! ${error.message}`);
                            }}
                        />
                        <DialogFooter>
                            <Button onClick={handleImageAdding}>Confirm</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {addedImages.length > 0 && (
                    <Button
                        variant="default"
                        onClick={() => handleProceed(addedImages)}
                        className="bg-green-500 hover:bg-green-400"
                    >
                        {proceedingState}
                        {proceedingState === "Proceeding" ? <Image height={24} width={24} src="/assets/spinner.svg" alt="Loading"/> : proceedingState === "Success" ? <Image height={24} width={24} src="/assets/success.svg" alt="Loading" className="ml-1"/> : <Image height={24} width={24} src="/assets/arrow-right-circle.svg" alt="Loading" className="ml-1"/>}
                    </Button>
                )}
            </div>
        </section>
    )
}

export default GetImagesLinks;

