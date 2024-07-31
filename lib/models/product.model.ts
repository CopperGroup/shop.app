import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true},
    images: [
        {
            type: String
        }
    ],
    isAvailable: {
        type: Boolean
    },
    quantity: {
        type: Number
    },
    url: {
        type: String
    },
    priceToShow: {
        type: Number
    },
    price: {
        type: Number
    },
    category: {
        type: String,
    },
    vendor: {
        type: String
    },
    description: {
        type: String
    },
    params: [
        {
            name: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }
    ],
    isFetched: {
        type: Boolean
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    orderedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    likedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    addedToCart: [
        {
            type: Date
        }
    ]

})

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;