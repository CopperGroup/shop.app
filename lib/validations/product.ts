import * as z from "zod";

export const ProductValidation = z.object({
    id: z.string().min(1, { message: "Product requires a custom id." }),
    name: z.string()
           .min(3, { message: "Minimum 3 characters." })
           .max(50, { message: "Maximum 50 caracters." }),
    price: z.string(),
    priceToShow: z.string(),
    description: z.string().min(3, { message: "Minimum 3 characters." }),
    url: z.string(),
    quantity: z.string(),
    category: z.string(),
    vendor: z.string(),
    isAvailable: z.boolean(),
    Model: z.string().min(1, { message: "Model requires a name." }),
    Width: z.string().min(1, { message: "Width is required." }),
    Height: z.string().min(1, { message: "Height is required." }),
    Depth: z.string().min(1, { message: "Depth is required." }),
    Type: z.string().min(1, { message: "Type is required." }),
    Color: z.string().min(1, { message: "Color is required." }),
    customParams: z.array(z.object({
        name: z.string().min(1, { message: "Custom parameter name is required." }),
        value: z.string().min(1, { message: "Custom parameter value is required." })
    })).optional()
})