"use server";

import { revalidatePath } from "next/cache";
import Pixel from "../models/pixel.model";
import { connectToDB } from "../mongoose";
import { PixelData } from "../types/types";

export async function createPixel({ type, name, id }: { type: "Meta" | "TikTok", name: string, id: string }) {
  try {
    connectToDB();

    //console.log("Creating pixel");

    const createdPixel = await Pixel.create({
        type: type,
        name: name,
        id: id,
        status: "Deactivated",
        createdAt: Date.now(),
        events: {
          pageView: true,
          viewContent: true,
          addToCart: true,
          addToWishlist: true,
          initiateCheckout: true,
          addPaymentInfo: true,
          purchase: true,
          search: true,
          lead: true,
          completeRegistration: true,
      }
    })
    
    //console.log(createdPixel);

    revalidatePath("/admin/pixel");
  } catch (error: any) {
    throw new Error(`Error creating pixel: ${error.message}`)
  }
}

export async function fetchPixels(type: "Meta" | "TikTok") {
  try {
    connectToDB();

    const pixels = await Pixel.find({ type: type });

    return pixels;

  } catch (error: any) {
    throw new Error(`Error fetching pixels: ${error.message}`)
  }
}

export async function deletePixel({ _id }: { _id: string }) {
  try {
    connectToDB();

    const deletedPixel = await Pixel.findByIdAndDelete(_id);

    revalidatePath("/admin/pixel");


  } catch (error: any) {
    throw new Error(`Error deleting pixel: ${error.message}`)
  }
}

export async function activatePixel({ _id, type }: { _id: string, type: PixelData["type"] }) {
  try {
    connectToDB();

    const pixel = await Pixel.findById({ _id: _id });
    const currentlyActivePixel = await Pixel.findOne({ status: "Active", type: type});

    if(!currentlyActivePixel) {
        pixel.status = "Active";
        pixel.activatedAt = Date.now();

        await pixel.save()
    }else if(pixel._id != currentlyActivePixel._id ) {
        currentlyActivePixel.status = "Deactivated";
        currentlyActivePixel.deactivatedAt = Date.now();

        await currentlyActivePixel.save();

        pixel.status = "Active";
        pixel.activatedAt = Date.now();

        await pixel.save();
    } else {
        pixel.status = "Deactivated";
        pixel.deactivatedAt = Date.now();

        await pixel.save();
    }

    revalidatePath("/admin/pixel");
} catch (error: any) {
    throw new Error(`Error activating/disactivating pixel: ${error.message}`)
  }
}

export async function activePixelID() {
  try {
    connectToDB();

    const activePixel = await Pixel.findOne({ status: "Active"});

    if(!activePixel) {
      return ""
    }

    return activePixel.id
  } catch (error: any) {
    throw new Error(`Error fetching active pixel's id: ${error.message}`)
  }
}

export async function fetchActivePixelEvents(type?: "json") {
  try {
    connectToDB();

    const activePixel = await Pixel.findOne({ status: "Active" });

    if(!activePixel) {
      return null
    }

    if(type == "json") {
      return JSON.stringify(activePixel.events);
    } else {
      return activePixel.events
    }
  } catch (error: any) {
    throw new Error(`Error fetching active events: ${error.message}`)
  }
}

export async function fetchPixel({ _id }: { _id: string }) {
  try {
    connectToDB();

    const pixel = await Pixel.findById(_id);

    return pixel;
  } catch (error: any) {
    throw new Error(`Error fetching pixel: ${error.message}`)
  }
}

export async function updatePixelEvents({ _id, events }: { _id: string, events: Record<string, boolean>}): Promise<{ success: boolean; message?: string }> {
  try {
    connectToDB();

    console.log(events);

    const pixel = await Pixel.findByIdAndUpdate(_id, { events: events });

    if (!pixel) {
      return { success: false, message: "Update failed, pixel not found" };
    }
    
    return { success: true, message: "Pixel events updated successfully." };
  } catch (error: any) {

    throw new Error(`Error updating pixel events: ${error.message}`)
  }
}

export async function fetchActivePixel(type: "json") {
  try {
    const activePixel = await Pixel.findOne({ status: "Active" });


    if (!activePixel) {
      return { id: "", events: [] }
    }

    if (type == "json") {
      return JSON.stringify(activePixel);
    }

    return activePixel;
  } catch (error: any) {
    throw new Error(`${error.message}`)
  }
}