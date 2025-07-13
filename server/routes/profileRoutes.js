import express from "express";
import { deleteUserProfile, getUserProfile, updateUserProfile } from "../controllers/profileController.js";
import userauth from "../middlewares/userauth.js";

const profileRouter = express.Router();

// GET profile
profileRouter.get("/get", userauth, getUserProfile);

// UPDATE profile
profileRouter.put("/update", userauth, updateUserProfile);


profileRouter.delete("/delete", userauth, deleteUserProfile);


export default profileRouter;
