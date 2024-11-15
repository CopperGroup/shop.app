// components/FacebookPixel.js
"use client";
import { useEffect } from 'react';
import { initializeFacebookPixel } from '@/helpers/pixel';

const FacebookPixel = () => {
  useEffect(() => {
    initializeFacebookPixel();
  }, []);

  return null;
};

export default FacebookPixel;
