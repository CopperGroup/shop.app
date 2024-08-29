import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
})

const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;