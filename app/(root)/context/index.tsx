'use client'

import { fetchActivePixelEvents } from "@/lib/actions/pixel.actions";
import { PixelData } from "@/lib/types/types";
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

    const [pixelEvents, setPixelEvents] = useState<PixelData["events"]>();
    const [isPixelActive, setIsPixelActive] = useState<boolean>(false);

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

    useEffect(() => {
        async function fetchPixelEvents() {
            const events = await fetchActivePixelEvents("json")

            setPixelEvents(JSON.parse(events));

            setIsPixelActive(true);
        }

        fetchPixelEvents();
    }, [])

    return (
        <AppContext.Provider value={{
            catalogData,
            setCatalogData,
            cartData,
            setCartData,
            priceToPay,
            setPriceToPay,
            pixelEvents: {...pixelEvents, active: isPixelActive}
        }}>
            {children}
        </AppContext.Provider>
    );
}


export function useAppContext(){
    return useContext(AppContext)
}