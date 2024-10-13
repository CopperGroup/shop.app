import { createUrlProduct, deleteProduct, deleteUrlProducts, fetchUrlProducts, updateUrlProduct } from "./actions/product.actions";
import { clearCatalogCache } from "./actions/redis/catalog.actions";

interface Product {
    _id: string,
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
    isFetched: boolean,
    category: string
}

export async function proceedDataToDB(data: Product[], selectedRowsIds: (string | null)[]) {
    try {
        const stringifiedUrlProducts = await fetchUrlProducts("json");
        let urlProducts: Product[] = JSON.parse(stringifiedUrlProducts as string);

        const leftOverProducts = urlProducts.filter(urlProduct => 
            !data.some(product => product.id === urlProduct.id)
        );

        const processedIds = new Set<string>();

        for (const product of data) {
            if (product.id && selectedRowsIds.includes(product.id) && !processedIds.has(product.id)) {
                const existingProductIndex = urlProducts.findIndex(urlProduct => urlProduct.id === product.id);

                if (existingProductIndex !== -1) {
                    const urlProduct = urlProducts[existingProductIndex];
                    console.log("Update: ", product.id);
                    
                    await updateUrlProduct({
                        _id: urlProduct._id,
                        id: product.id,
                        name: product.name,
                        isAvailable: product.isAvailable,
                        quantity: product.quantity,
                        url: product.url,
                        priceToShow: product.priceToShow,
                        price: product.price,
                        images: product.images,
                        vendor: product.vendor,
                        description: product.description,
                        params: product.params,
                        isFetched: product.isFetched,
                        category: product.category
                    });
                } else {
                    console.log("Create: ", product.id);

                    await createUrlProduct({
                        id: product.id,
                        name: product.name,
                        isAvailable: product.isAvailable,
                        quantity: product.quantity,
                        url: product.url,
                        priceToShow: product.priceToShow,
                        price: product.price,
                        images: product.images,
                        vendor: product.vendor,
                        description: product.description,
                        params: product.params,
                        isFetched: product.isFetched,
                        category: product.category
                    });
                }

                processedIds.add(product.id);
            }
        }

        console.log("Left products:", leftOverProducts);
        for (const leftOverProduct of leftOverProducts) {
            await deleteProduct({productId: leftOverProduct.id as string}, "/catalog", "keep-catalog-cache");
        }

        await clearCatalogCache();
    } catch (error: any) {
        throw new Error(`Error proceeding products to DB: ${error.message}`);
    }
}
