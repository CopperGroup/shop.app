import { activePixelID, fetchActivePixel } from "@/lib/actions/pixel.actions";
import CryptoJS from "crypto-js";

let activeEvents = []

export async function initializeFacebookPixel() {
  try {
    const response = await fetchActivePixel("json");

    const activePixel = JSON.parse(response);

    activeEvents = activePixel.events;

    const encryptedPixelID = activePixel.id;
    if (!encryptedPixelID) {
      console.error("Failed to fetch Pixel ID.");
      return;
    }

    const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

    const bytes = CryptoJS.AES.decrypt(encryptedPixelID, encryptionKey);
    const pixelID = bytes.toString(CryptoJS.enc.Utf8).replace(" ", "");

    if (!pixelID) {
      console.error("Failed to initialize Facebook Pixel: Decrypted Pixel ID is empty.");
      return;
    }

    // Inject the Pixel script into the page
    
    (function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = `https://connect.facebook.net/en_US/fbevents.js`;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script');
    
    // Initialize the pixel with the decrypted ID
    console.log(window.fbq.queue);
    
    fbq('init', pixelID);
    
    if(typeof fbq == "undefined") {
      console.log("No fbq")
    }

    console.log(`Facebook pixel initialized`);
  } catch (error) {
    console.error("Error initializing Facebook Pixel:", error);
  }
}

export function trackFacebookEvent(eventName, eventData = {}) {
  if (typeof window !== "undefined" && window.fbq) {
    if(!activeEvents[eventName.charAt(0).toLowerCase() + eventName.slice(1)]) {
      return null
    }

    fbq("track", eventName, eventData);
    console.log(`Tracked event: ${eventName}`, eventData);
  } else {
    console.error(`Failed to track event: ${eventName}. Facebook Pixel is not initialized.`);
  }
}

export function trackPageView() {
  if (typeof window !== "undefined" && window.fbq) {
    fbq("track", "PageView");
  } else {
    console.error("Failed to track PageView. Facebook Pixel is not initialized.");
  }
}
