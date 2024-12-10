"use client";

import { trackFacebookEvent } from "@/helpers/pixel";
import { useEffect, useCallback } from "react";

const ContentView = ({
  productName,
  productCategory,
  productId,
  contentType,
  value,
  currency,
}: {
  productName: string;
  productCategory: string;
  productId: string;
  contentType: string;
  value: number;
  currency: string;
}) => {

  const trackViewContent = useCallback(() => {
    const key = `viewContentTracked-${productId}`;
    if (!sessionStorage.getItem(key)) {
      trackFacebookEvent("ViewContent", {
        content_name: productName,
        content_category: productCategory,
        content_ids: [productId],
        content_type: contentType,
        value,
        currency,
      });
      sessionStorage.setItem(key, "true");
    }
  }, [
    productName,
    productCategory,
    productId,
    contentType,
    value,
    currency,
  ]);

  useEffect(() => {
    trackViewContent();
  }, [trackViewContent]);

  return null;
};

export default ContentView;
