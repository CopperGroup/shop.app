"use client";

import { Button } from "@/components/ui/button";
import { activatePixel } from "@/lib/actions/pixel.actions";
import { PixelData } from "@/lib/types/types";
import { cn } from "@/lib/utils";

const SetPixelStatusButton = ({ _id, status, type, className }: { _id: string, status: PixelData["status"], type: PixelData["type"], className?: string }) => {
    const handleChangeStatus = async () => {
        await activatePixel({ _id: _id, type: type });
    }

    return (
        <Button className={cn(`h-6 text-[13px] border-green-500 p-1.5 px-1.5 ${status == "Active" ? "px-3.5 bg-green-500 text-white hover:bg-green-600" : "bg-trasnparent border text-green-500 hover:bg-green-500 hover:text-white"}`, className)} size="sm" onClick={handleChangeStatus}>
            {status == "Active" ? "Active" : "Activate"}
        </Button>
    )
}

export default SetPixelStatusButton