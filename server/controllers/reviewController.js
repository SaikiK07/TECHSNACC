import reviewModel from "../modles/reviewModel.js";
import productModel from "../modles/productModel.js";
import mongoose from "mongoose";

// Submit a review (rating + comment)
const addReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.body.userId;

    if (!productId || !rating || !comment) {
        return res.json({ success: false, message: "All fields are required." });
    }

    if (rating < 1 || rating > 5) {
        return res.json({ success: false, message: "Rating must be between 1 and 5" });
    }

    try {
        // Convert productId to ObjectId
        const objectId = new mongoose.Types.ObjectId(productId);

        // Find the product
        const product = await productModel.findById(objectId);
        if (!product) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Check if the user has already reviewed the product
        const existingReview = await reviewModel.findOne({ userId, productId: objectId });
        if (existingReview) {
            return res.json({ success: false, message: "You have already reviewed this product" });
        }

        // Create the new review
        const newReview = new reviewModel({
            userId,
            productId: objectId,
            rating,
            comment,
        });

        await newReview.save();

        // Recalculate total reviews and average rating
        const totalReviews = await reviewModel.countDocuments({ productId: objectId });
        const sumRatings = await reviewModel.aggregate([
            { $match: { productId: objectId } }, // Match by ObjectId
            { $group: { _id: null, total: { $sum: "$rating" } } }, // Sum all ratings
        ]);

        const averageRating = totalReviews > 0 ? (sumRatings[0]?.total / totalReviews).toFixed(1) : rating;

        // Update product with new average rating and total ratings
        await productModel.findByIdAndUpdate(objectId, {
            averageRating: parseFloat(averageRating), // Convert to float
            totalRatings: totalReviews,
        });

        res.json({
            success: true,
            message: "Review added successfully",
            averageRating,
            totalRatings: totalReviews,
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Something went wrong. Try again later." });
    }
};


// Get all reviews for a product
const getProductReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate productId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.json({ success: false, message: "Invalid product ID" });
        }

        // Fetch product reviews
        const reviews = await reviewModel.find({ productId }).populate("userId", "name");
        
        if (!reviews) {
            return res.json({ success: false, message: "No reviews found for this product" });
        }

        res.json({
            success: true,
            reviews,
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get all 4-5 star reviews (across all products)
const getAllHighRatedReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find({
            rating: { $gte: 4 }
        }).populate("userId", "name").populate("productId", "name");

        res.json({
            success: true,
            reviews,
        });
    } catch (error) {
        console.error("Error fetching high-rated reviews:", error);
        res.json({ success: false, message: error.message });
    }
};


export {getAllHighRatedReviews,addReview, getProductReviews };
