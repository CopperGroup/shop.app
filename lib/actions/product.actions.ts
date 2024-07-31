"use server";

import Product from "../models/product.model"
import { connectToDB } from "../mongoose"
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

interface CreateUrlParams {
    id: string | null,
    name: string | null,
    isAvailable: boolean,
    quantity: number,
    url: string | null,
    priceToShow: number,
    price: number,
    images: (string | null)[],
    vendor: string | null,
    description: string | null,
    params: {
        name: string | null,
        value: string | null
    }[],
    isFetched: boolean
    category:string
}




interface GetParams {
    productId: string,
    params: {
        Color: string,
        Depth: string,
        Height: string,
        Model: string,
        Type: string,
        Width: string,
        customParams: {
            name: string,
            value: string,
        } []
    }
}


interface CreateParams {
    id: string,
    name: string,
    quantity: number,
    url: string,
    price: number,
    priceToShow: number,
    vendor: string,
    category?: string,
    description: string,
}


interface InterfaceProps {
    productId: string,
    email: string,
    path: string,
}

export async function createUrlProduct({ id, name, isAvailable, quantity, url, priceToShow, price, images, vendor, description, params, isFetched, category }: CreateUrlParams){
    try {
        connectToDB();
        
        const createdProduct = await Product.create({
            id: id,
            name: name,
            isAvailable: isAvailable,
            quantity: quantity,
            url: url,
            priceToShow: priceToShow,
            price: price,
            images: images,
            vendor: vendor,
            description: description,
            params: params,
            isFetched: isFetched,
            category:category,
        })
        
    } catch (error: any) {
        throw new Error(`Error creating url-product, ${error.message}`)
    }
}

export async function createProduct({ id, name, quantity, url, price, priceToShow, vendor, category, description }: CreateParams){
    try {
        connectToDB();

        const createdProduct = await Product.create({
            id: id,
            name: name,
            quantity: quantity,
            url: url,
            price: price,
            priceToShow: priceToShow,
            category: category ? category : "",
            vendor: vendor,
            description: description,
        })

  
    } catch (error: any) {
        throw new Error(`Error creating new product, ${error.message}`)
    }
}

export async function deleteUrlProducts(){
    try {
        connectToDB();

        await Product.deleteMany({ isFetched: true});
    } catch (error: any) {
        throw new Error(`Error deleting fetched products, ${error.message}`)
    }
}

export async function fetchAllProducts() {
    try {
        connectToDB();
        
        const fetchedProducts = await Product.find({ isAvailable: true, quantity: { $gt: 0 } })
        .populate({
            path: 'likedBy',
            model: User,
            select: "_id email"
        })
        return fetchedProducts

    } catch (error:any) {
        throw new Error(`Error fetching all available products, ${error.message}`)
    }
}

export async function fetchProducts(){
    try {
        connectToDB();

        const products = await Product.find();
        
        return products
    } catch (error:any) {
        throw new Error(`Error fetching products, ${error.message}`)
    }
}




 
export async function fetchLastProducts() {
    try {
        connectToDB();
        

        const last12Products = await Product.find({ isAvailable: true })
        .populate({
            path: 'likedBy',
            model: User,
            select: "_id email"
        })
        .sort({ _id: -1 }) // Сортуємо за спаданням _id (останні додані товари будуть першими)
        .limit(12); // Обмежуємо результат до 12 товарів
        

        return last12Products;

    } catch (error:any) {
        throw new Error(`Error fetching all available products, ${error.message}`)
    }
}



export async function addLike({ productId, email, path }: InterfaceProps) {
    try {
        connectToDB();
        
        const product = await Product.findOne({id:productId});
        if(email) {
            const currentUser = await User.findOne({ email: email }); 

            const isLiked = product.likedBy.includes(currentUser._id);

            if(isLiked) {
                await product.likedBy.pull(currentUser._id);
                await currentUser.likes.pull(product._id);
            } else {
                await product.likedBy.push(currentUser._id);
                await currentUser.likes.push(product._id);
            }
    
    
            await product.save();
            await currentUser.save();

            revalidatePath(path);
            revalidatePath(`/liked/${currentUser._id}`);
        }

    } catch (error: any) {
        throw new Error(`Error adding like to the product, ${error.message}`)
    }
}

export async function fetchLikedProducts(userId: string){
    try {
        connectToDB();

        const likedProducts = await Product.find({ isAvailable: true, likedBy: userId })
            .populate({
                path: 'likedBy',
                model: User,
                select: "_id email"
            })

        return likedProducts;
    } catch (error: any) {
        throw new Error(`Error fecthing liked posts, ${error.message}`)
    }
}


export async function addImagesToProduct(addedImages: string[], productId: string) {
    try {
        connectToDB();

        const product = await Product.findOne({ id: productId });

        product.images = [];

        addedImages.forEach((addedImage) => product.images.push(addedImage));

        console.log(product.images);

        product.save();
    } catch (error: any) {
        throw new Error(`Error adding images to product: ${error.message}`)
    }
}

export async function getProductImages(productId: string) {
    try {
        connectToDB();

        const product = await Product.findOne({ id: productId });

        console.log(product.images);

        if(product.images.length > 0) {
            return product.images;
        } else {
            return [];
        }
    } catch (error: any) {
        throw new Error(`Error fetching product images: ${error.message}`)
    }
}

export async function addParamsToProduct({ productId, params }: GetParams) {
    try {
        connectToDB();

        const product = await Product.findOne({ id: productId });

        product.params = [];
        
        await product.params.push({ name: "Товар", value: params.Model.replace(/ /g, '_') });
        await product.params.push({ name: "Ширина, см", value: params.Width });
        await product.params.push({ name: "Висота, см", value: params.Height });
        await product.params.push({ name: "Глибина, см", value: params.Depth });
        await product.params.push({ name: "Вид", value: params.Type });
        await product.params.push({ name: "Колір", value: params.Color });

        for(const customParam of params.customParams){
            await product.params.push({ name: customParam.name, value: customParam.value });
        }

        await product.save();
    } catch (error: any) {
        throw new Error(`Error adding params to product: ${error.message}`)
    }
}

export async function getProductParams(productId: string) {
    try {
        const product = await Product.findOne({ id: productId });

        const productParams = await product.params;

        return JSON.stringify(productParams);
    } catch (error: any) {
        throw new Error(`Error getting product params: ${error.message}`)
    }
}

export async function getProduct(productId: string){
    try {
        connectToDB();

        const product = await Product.findOne({ id: productId });

        return product;
    } catch (error: any) {
        throw new Error(`Error fetching product: ${error.message}`)
    }
}

export async function getProductsProperities(productId: string) {
    try {
        connectToDB();

        const product = await Product.findOne({ id: productId })

        return [
            { name: "id", value: productId }, 
            { name: "name", value: product.name }, 
            { name: "price", value: `${product.price}`}, 
            { name: "priceToShow",  value: `${product.priceToShow}`}, 
            { name: "description", value: product.description }, 
            { name: "url", value: product.url }, 
            { name: "quantity", value: `${product.quantity}` }, 
            { name: "category", value: product.category }, 
            { name: "vendor", value: product.vendor }
        ]
    } catch (error: any) {
        throw new Error(`Error fetching product properities: ${error.message}`)
    }
}

export async function editProduct({ id, name, quantity, url, priceToShow, price, vendor, category, description}: CreateParams){
    try {
        connectToDB();
        
        const createdProduct = await Product.findOne({ id: id })

        createdProduct.name = name;
        createdProduct.quantity = quantity;
        createdProduct.url = url;
        createdProduct.priceToShow = priceToShow;
        createdProduct.price = price;
        createdProduct.vendor = vendor;
        createdProduct.category = category ? category : "";
        createdProduct.description = description;

        createdProduct.save();

        revalidatePath(`/admin/createProduct/list/${id}`)
    } catch (error: any) {
        throw new Error(`Error creating url-product, ${error.message}`)
    }
}

export async function listProduct(productId: string) {
    try {
        connectToDB();

        const product = await Product.findOne({ id: productId });

        product.isAvailable = true;

        product.save();
    } catch (error: any) {
        throw new Error(`Error listing product: ${error.message}`)
    }
}

export async function productAddedToCart(id: string) {
    try {
        connectToDB();

        const product = await Product.findById(id);

        await product.addedToCart.push(Date.now())

        await product.save();

        console.log(product);
    } catch (error: any) {
        throw new Error(`Error adding prduct to cart: ${error.message}`)
    }
}








