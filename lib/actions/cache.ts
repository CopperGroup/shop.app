"use server";

import { revalidatePath } from "next/cache";

const paths = {
    categories: "/admin/categories",
    products: "/admin/products",
    dashboard: "/admin/dashboard",
    statistics: "/admin/statistics",
    orders: "/admin/Orders",
    payments: "/admin/payments",
    clients: "/admin/clients"
} as const

const adminPaths = [
    {
        name: 'createProduct',
        values: [paths.categories, paths.products]
    },
    {
        name: 'updateProduct',
        values: [paths.categories, paths.products, paths.dashboard, paths.statistics]
    },
    {
        name: 'deleteProduct',
        values: [paths.categories, paths.products, paths.dashboard, paths.statistics]
    },
    {
        name: 'createOrder',
        values: [paths.categories, paths.dashboard, paths.orders, paths.payments, paths.statistics]
    },
    {
        name: "createUser",
        values: [paths.clients, paths.statistics]
    },
    {
        name: 'likeProduct',
        values: [paths.statistics, paths.categories]
    },
    {
        name: "addToCart",
        values: [paths.dashboard, paths.statistics]
    },
] as const;

export default async function clearCache(functionName: typeof adminPaths[number]["name"]) {
    const path = adminPaths.filter(({name, values}) => name == functionName)

    console.log(path)
    path[0].values.forEach((value: string) => revalidatePath(value))
}
