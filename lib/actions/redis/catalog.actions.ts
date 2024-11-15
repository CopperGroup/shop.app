"use server";

import { redis } from "@/lib/redis";
import { fetchAllProducts } from "../product.actions";

export async function createCatalogChunks (filtredProducts: any) {
    const jsonData = JSON.stringify(filtredProducts); // Convert to JSON string
    const dataSize = Buffer.byteLength(jsonData, 'utf8'); // Calculate size of JSON data in bytes
    const MAX_SIZE = 512 * 1024; // Redis max size limit per chunk in bytes (1 MB)
  
    // Determine the number of chunks required
    const numberOfChunks = Math.ceil(dataSize / MAX_SIZE); // Calculate the minimum number of chunks needed
    const chunkSize = Math.ceil(dataSize / numberOfChunks + 1); // Find the size for each chunk
  
    const chunks = [];
  
    // Split the JSON string into dynamically calculated chunks
    for (let i = 0; i < jsonData.length; i += chunkSize) {
      chunks.push(jsonData.slice(i, i + chunkSize));
    }
  
    // Store each chunk in Redis with a unique key
    for (let i = 0; i < chunks.length; i++) {
      await redis.set(`catalog_chunk_${i}`, chunks[i]);
    }

    await redis.set("catalog_chunk_count", chunks.length);
};

export async function fetchCatalog () {
    try{
        const chunks = [];
        let chunkIndex = 0;
    
        const chunkCount: number | null = await redis.get("catalog_chunk_count");
    
        if (!chunkCount) {
            return await fetchAndCreateCatalogChunks();
        }
        //console.log("Chunk count", chunkCount);
    
        while (chunkIndex < chunkCount) {
            const chunk = await redis.get(`catalog_chunk_${chunkIndex}`);
    
            if(chunk) {
                chunks.push(chunk);
            } else {
                return await fetchAndCreateCatalogChunks();
            }
    
            chunkIndex++;
        }

        if(chunks.length !== chunkCount) {
            return await fetchAndCreateCatalogChunks();
        }
    
        //console.log("Fetching from redis");

        const combinedChunks = chunks.join('');
    
        const data = JSON.parse(combinedChunks);

        console.log("This was fetched from redis cache");
        return data;
    } catch (error) {
        return await fetchAndCreateCatalogChunks();
    }
}

export async function fetchAndCreateCatalogChunks() {
    try {
        const filtredProducts = await fetchAllProducts();

        await clearCatalogCache();
        await createCatalogChunks(filtredProducts);

        return filtredProducts;
    } catch (error: any) {
        throw new Error(`Error fetching catalog data: ${error.message}`);
    }
}

export async function clearCatalogCache() {
    let cursor = '0';
    const matchPattern = '*catalog*';

    try {
        do {
            const scanResult = await redis.scan(cursor, { match: matchPattern, count: 100 });
            cursor = scanResult[0];
            const keys = scanResult[1];

            if (keys.length > 0) {
                await redis.del(...keys);
            }
        } while (cursor !== '0')
    } catch (error: any) {
        throw new Error(`Error clearing catalog cache: ${error.message}`);
    }
}