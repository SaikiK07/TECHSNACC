import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import "dotenv/config";

// Routes
import authRouter from './routes/authRoutes.js';
import productRouter from "./routes/productRoute.js";
import contactRouter from "./routes/contactRoute.js";
import './config/cloudinary.js';
import categoryRouter from "./routes/categoryRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/userRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import brandRouter from "./routes/brandRoute.js";
import backupRouter from "./routes/backupRoute.js";
import profileRouter from "./routes/profileRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI;

mongoose.connect(URI, {
  ssl: true,
  tlsAllowInvalidCertificates: false,
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas");
}).catch((err) => {
  console.error("❌ Failed to connect to MongoDB", err);
});

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://techsnacc.vercel.app',
  'https://techsnacc-admin.vercel.app',
  'https://techsnacc.onrender.com',
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


// ✅ Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("Welcome to TECHSNACC backend!");
});

// ✅ API Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/contact', contactRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/review', reviewRouter);
app.use('/api/profile', profileRouter);
app.use('/api/backup', backupRouter);

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
