import { createUrlProduct, deleteUrlProducts } from "./actions/product.actions";
import { clearCatalogCache } from "./actions/redis/catalog.actions";

interface Product {
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
        await deleteUrlProducts();
        
        for (let i = 0; i < data.length; i++) {
            const product = data[i];
            if (product.id && selectedRowsIds.includes(product.id)) {
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

            // Перевірка для додавання затримки після кожних 100 товарів
            if ((i + 1) % 100 === 0) {
                console.log(`Processed ${i + 1} products, waiting for 30 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 30000));
            }
        }

        await clearCatalogCache();
    } catch (error: any) {
        throw new Error(`Error proceeding products to DB: ${error.message}`);
    }
}