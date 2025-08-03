import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import express from "express";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://forever-jjbb.vercel.app", // ✅ Frontend
  "https://forever-jjbb1.vercel.app", // ✅ Admin
];

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🔍 CORS origin request:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
const port = process.env.PORT || 4000;

connectCloudinary();

console.log("ENV Variables:", {
  MONGODB_URI: process.env.MONGODB_URI ? "exists" : "MISSING",
  PORT: process.env.PORT,
});

await connectDB();

app.use(express.json());
app.use(cors(corsOptions));

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () => console.log(`🚀 Server started on PORT: ${port}`));
