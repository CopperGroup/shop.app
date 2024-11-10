export type ReadOnly<T> = {
    readonly [P in keyof T] : T[P]
}

export type ProductType = {
    _id: string,
    id: string,
    name: string,
    images: string[],
    isAvailable: boolean,
    quantity: number,
    url: string,
    priceToShow: number,
    price: number,
    category: string,
    vendor: string,
    description: string,
    params: {
        name: string,
        value: string
    }[],
    isFetched: boolean,
    likedBy: string[],
    addedToCart: Date[]
}

export type Category = {
    category: string,
    values: {
      totalProducts: number,
      totalValue: number,
      averageProductPrice: number,
      stringifiedProducts: string
    }
}

export type PixelData = {
    _id: string;
    name: string;
    id: string;
    status: "Active" | "Deactivated";
    type: "Meta" | "TikTok";
    createdAt: string;
    activatedAt: string | null;
    deactivatedAt: string | null;
}