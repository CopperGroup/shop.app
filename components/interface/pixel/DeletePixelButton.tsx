"use client";

import { Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { deletePixel } from "@/lib/actions/pixel.actions";

export const DeletePixelButton = ({ _id, type }: { _id: string, type: "Meta" | "TikTok"}) => {

    const handleDeletePixel = async () => {
        await deletePixel({ _id: _id })
    }

    return (
        <>
            {type == "Meta" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 text-right p-0 transition-colors hover:bg-red-100"
                  onClick={handleDeletePixel}
                >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-600" />
                </Button>

            )}
            {type == "TikTok" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 text-right p-0 transition-colors hover:bg-gray-700"
                  onClick={handleDeletePixel}
                >
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-[#FF004F]" />
                </Button>
            )}
        </>
    )
}
