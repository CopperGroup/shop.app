export const TypeScriptPrimitiveTypes = ["bigint", "boolean", "function", "number", "object", "string", "symbol", "undefined"] as const;

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

export enum EventNames {
    PageView = "pageView",
    ViewContent = "viewContent",
    AddToCart = "addToCart",
    AddToWishlist = "addToWishlist",
    InitiateCheckout = "initiateCheckout",
    AddPaymentInfo = "addPaymentInfo",
    Purchase = "purchase",
    Search = "search",
    Lead = "lead",
    CompleteRegistration = "completeRegistration",
}

export type PixelEvents = {
    [key in EventNames]: boolean;
};

export type PixelData = {
    _id: string;
    name: string;
    id: string;
    status: "Active" | "Deactivated";
    type: "Meta" | "TikTok";
    createdAt: string;
    activatedAt: string | null;
    deactivatedAt: string | null;
    events: PixelEvents;
};