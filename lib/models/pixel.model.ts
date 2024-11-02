import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    pixel_type: {
        type: String
    },
    pixel_name: {
        type: String
    },
    pixel_id: {
        type: String
    },
    pixel_secure: {
        type: String
    }
})

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;