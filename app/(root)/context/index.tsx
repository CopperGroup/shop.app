'use client'

import { createContext, useState, useContext, useEffect, ReactNode } from "react";



const AppContext = createContext<any>(undefined);

export function AppWrapper({ children }: { children: ReactNode }) {
    const [catalogData, setCatalogData] = useState({
        pNumber: 1,
        sort: 'default',
        search: ''
    });

    const [cartData, setCartData] = useState<any[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [priceToPay, setPriceToPay] = useState<any[]>([]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedCartData = localStorage.getItem("cartData");
            if (savedCartData) {
                setCartData(JSON.parse(savedCartData));
            }
            setIsClient(true);
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem("cartData", JSON.stringify(cartData));
        }
    }, [cartData, isClient]);

    return (
        <AppContext.Provider value={{
            catalogData,
            setCatalogData,
            cartData,
            setCartData,
            priceToPay,
            setPriceToPay,
        }}>
            {children}
        </AppContext.Provider>
    );
}


export function useAppContext(){
    return useContext(AppContext)
}