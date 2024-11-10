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
    }
})

const Pixel = mongoose.models.Pixel || mongoose.model("Pixel", pixelSchema);

export default Pixel;