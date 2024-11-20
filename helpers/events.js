"use client";

import { useAppContext } from "@/app/(root)/context";

const { pixelEvents } = useAppContext();

export function trackEvent(eventName, eventData = {}) {
    console.log("Events:", pixelEvents)
}