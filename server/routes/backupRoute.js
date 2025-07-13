import express from "express";
import { backupDatabase } from "../controllers/backupController.js";

const backupRouter = express.Router();

backupRouter.get("/database", backupDatabase); //

export default backupRouter;
