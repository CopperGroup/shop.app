// components/pixel/FacebookPixel.js
"use client"; // Enables client-side rendering

import { useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';

const FacebookPixel = () => {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  useEffect(() => {
    if (pixelId) {
      ReactPixel.init(pixelId); // Initialize the Pixel with your Pixel ID
      ReactPixel.pageView(); // Track the initial page view
    }
  }, [pixelId]);

  return null; // This component doesn’t render anything
};

export default FacebookPixel;
