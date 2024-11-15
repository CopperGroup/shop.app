import mongoose from "mongoose";

const pixelSchema = new mongoose.Schema({
    type: {
        type: String
    },
    name: {
        type: String
    },
    id: {
        type: String
    },
    status: {
        type: String,
        enum: ["Active", "Deactivated"]
    },
    createdAt: {
        type: Date,
    },
    activatedAt: {
        type: Date,
    },
    deactivatedAt: {
        type: Date
    },
    events: {
        pageView: {
            type: Boolean,
            default: true
        },
        viewContent: {
            type: Boolean,
            default: true
        },
        addToCart: {
            type: Boolean,
            default: true
        },
        addToWishlist: {
            type: Boolean,
            default: true
        },
        initiateCheckout: {
            type: Boolean,
            default: true
        },
        addPaymentInfo: {
            type: Boolean,
            default: true
        },
        purchase: {
            type: Boolean,
            default: true
        },
        search: {
            type: Boolean,
            default: true
        },
        lead: {
            type: Boolean,
            default: true
        },
        completeRegistration: {
            type: Boolean,
            default: true
        },
    }
})

const Pixel = mongoose.models.Pixel || mongoose.model("Pixel", pixelSchema);

export default Pixel;