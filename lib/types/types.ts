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