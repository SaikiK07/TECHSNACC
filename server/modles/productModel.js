import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  bestseller: { type: Boolean },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category", // ✅ FIXED: must match the actual model name
    required: true,
  },
  attributes: { type: Object },
  brand: { type: String, required: true },
  date: { type: Number, required: true },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
