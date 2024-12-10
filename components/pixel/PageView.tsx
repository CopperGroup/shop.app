"use client";

import { trackPageView } from "@/helpers/pixel";
import { useEffect } from "react";

const PageView = () => {

  useEffect(() => {
    if (!sessionStorage.getItem("pageViewTracked")) {
      trackPageView();
      sessionStorage.setItem("pageViewTracked", "true");
    }
  }, []);

  return null;
};

export default PageView;
