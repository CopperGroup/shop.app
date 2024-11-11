// hooks/useFacebookPixel.js
import { useEffect, useState } from 'react';
import CryptoJS from "crypto-js";
import ReactPixel from 'react-facebook-pixel';
import { activePixelID } from '@/lib/actions/pixel.actions';

const useFacebookPixel = () => {
  const [isPixelInitialized, setIsPixelInitialized] = useState(false);

  useEffect(() => {
    async function initFacebookPixel() {
      try {
        // Fetch the encrypted Pixel ID
        const encryptedPixelID = await activePixelID();
        if (!encryptedPixelID) {
          console.error("Failed to fetch Pixel ID.");
          return;
        }

        // Decrypt the Pixel ID
        const encryptionKey = process.env.ENCRYPTION_KEY;
        const bytes = CryptoJS.AES.decrypt(encryptedPixelID, encryptionKey as string);
        const pixelID = bytes.toString(CryptoJS.enc.Utf8);

        if (!pixelID) {
          console.error("Decryption failed.");
          return;
        }

        // Initialize Facebook Pixel
        ReactPixel.init(pixelID);
        ReactPixel.pageView(); // Track initial page view
        console.log("Facebook Pixel initialized with ID:", pixelID);
        setIsPixelInitialized(true);
      } catch (error) {
        console.error("Error initializing Facebook Pixel:", error);
      }
    }

    initFacebookPixel();
  }, []);

  return isPixelInitialized;
};

export default useFacebookPixel;
