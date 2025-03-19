import express from "express";
import dotenv from "dotenv";
import  cookieParser from "cookie-parser";
import { connectDB } from "./db/config.js";
import productRoutes from "./routes/productRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import cartRoutes from "./routes/cartRoutes.js";
import cors from "cors";
import { v2 as cloudinary } from 'cloudinary';
import shippingRoutes from "./routes/shippingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js"


// express declaration
const app = express();


// env file
dotenv.config();

const allowedOrigins = [
     "https://final-year-project-five-snowy.vercel.app", 
     "https://shoploot.xyz",
     "http://localhost:5173",
     "*" 
];

const corsOptions = {
     origin: (origin, callback) => {
       if (allowedOrigins.includes(origin) || !origin) {
         callback(null, true); 
       } else {
         callback(new Error("Not allowed by CORS")); 
       }
     },
     credentials: true, // to allow COOKIES from the browser.
};


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors(corsOptions));


export const config = {
     cashfreeAppId: process.env.CASHFREE_APP_ID,
     cashfreeApiKey: process.env.CASHFREE_API_KEY,
     nodeEnv: process.env.NODE_ENV
};


cloudinary.config({ 
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
     api_key: process.env.CLOUDINARY_API_KEY, 
     api_secret: process.env.CLOUDINARY_API_SECRET 
});

export default cloudinary;


const PORT = process.env.PORT || 5000;



app.get("/", (req, res) => {
     res.send("Hello World!");
});


app.use("/api/products", productRoutes);
app.use("/api/users/", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/shipping", shippingRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/orders", orderRoutes);


app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
     console.log(`Server is running on port : ${PORT}`);
     connectDB();
});