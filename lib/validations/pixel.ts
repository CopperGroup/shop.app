import * as z from "zod";

export const PixelValidation = z.object({
    name: z.string().min(1, "Name is required"),
    id: z.string().min(1, "Id is required")
})