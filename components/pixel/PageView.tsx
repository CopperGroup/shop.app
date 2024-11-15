"use client";

import { useAppContext } from "@/app/(root)/context";
import { trackPageView } from "@/helpers/pixel";
import { useEffect } from "react";

const PageView = () => {
  const { pixelEvents } = useAppContext();

  useEffect(() => {
    if (pixelEvents?.pageView && !sessionStorage.getItem("pageViewTracked")) {
      trackPageView();
      sessionStorage.setItem("pageViewTracked", "true");
    }
  }, [pixelEvents.active]);

  return null;
};

export default PageView;
