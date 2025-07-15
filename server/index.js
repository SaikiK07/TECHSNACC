import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import "dotenv/config"
import authRouter from './routes/authRoutes.js'
import productRouter from "./routes/productRoute.js"
import contactRouter from "./routes/contactRoute.js"
import './config/cloudinary.js';
import categoryRouter from "./routes/categoryRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import userRouter from "./routes/userRoutes.js"
import reviewRouter from "./routes/reviewRoutes.js"
import brandRouter from "./routes/brandRoute.js"
import backupRouter from "./routes/backupRoute.js"
import profileRouter from "./routes/profileRoutes.js"

const app = express()

const PORT = process.env.PORT || 4000;
const URI = process.env.MongoDBURI

//connect to mongodb
try {
    mongoose.connect(URI)
    console.log("connected to mongoDB :)")
} catch (error) {
    console.log("Error:",error)
}

//connectCloudinary()

const allowedOrigins =['http://localhost:5173','http://localhost:5174']
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: allowedOrigins,credentials:true}))


//API Endpoints
app.get("/",(req,res) =>{
    res.send("hello")
})

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/product',productRouter)
app.use('/api/category',categoryRouter)
app.use('/api/brand',brandRouter)
app.use('/api/contact',contactRouter)
app.use('/api/cart',cartRouter)
app.use('/api/order',orderRouter)
app.use('/api/review',reviewRouter)
app.use('/api/profile',profileRouter)


app.use('/api/backup', backupRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})