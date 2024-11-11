// components/pixel/FacebookPixel.js
"use client";

import { activePixelID } from '@/lib/actions/pixel.actions';
import { useEffect, useState } from 'react';
import ReactPixel from 'react-facebook-pixel';
import CryptoJS from "crypto-js";
import useFacebookPixel from '@/lib/hooks/useFacebookPixel';

const encryptionKey = process.env.ENCRYPTION_KEY;

const FacebookPixel = () => {
  const isPixelInitialized = useFacebookPixel();

  // Optionally, track more events once pixel is initialized
  if (isPixelInitialized) {
    console.log("Facebook Pixel is active and ready for tracking.");
  }

  return null;
};

export default FacebookPixel;
