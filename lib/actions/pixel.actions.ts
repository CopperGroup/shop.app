"use server";

import { revalidatePath } from "next/cache";
import Pixel from "../models/pixel.model";
import { connectToDB } from "../mongoose";
import { PixelData } from "../types/types";

export async function createPixel({ type, name, id }: { type: "Meta" | "TikTok", name: string, id: string }) {
  try {
    connectToDB();

    console.log("Creating pixel");

    const createdPixel = await Pixel.create({
        type: type,
        name: name,
        id: id,
        status: "Deactivated",
        createdAt: Date.now()
    })
    
    console.log(createdPixel);

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

export async function activatePixel({ _id }: { _id: string }) {
  try {
    connectToDB();

    const pixel = await Pixel.findById({ _id: _id });
    const currentlyActivePixel = await Pixel.findOne({ status: "Active"});

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
    throw new Error(`${error.message}`)
  }
}