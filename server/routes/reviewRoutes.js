// routes/reviewRoutes.js
import express from "express";
import { addReview, getAllHighRatedReviews, getProductReviews} from "../controllers/reviewController.js";
import userauth from "../middlewares/userauth.js";

const reviewRouter = express.Router();

// Route to submit a review
reviewRouter.post("/add", userauth, addReview);

reviewRouter.get("/high-rated", getAllHighRatedReviews);

// Route to get all reviews for a product
reviewRouter.get("/:productId", getProductReviews);


export default reviewRouter;
