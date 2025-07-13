import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    attributes: [{ name: String, type: String , required: true  }] // ✅ Now attributes have names and types
});

const categoryModel = mongoose.models.category || mongoose.model("category", categorySchema);

export default categoryModel;
