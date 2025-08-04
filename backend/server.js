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

// Initialize express first
const app = express();
const port = process.env.PORT || 4000;

// Configure CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "https://forever-jjbb.vercel.app", // ✅ Main
  "https://forever-jjbb1.vercel.app", // ✅ Admin
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    console.log("🔍 Incoming CORS request from:", origin || "NO ORIGIN");

    const isAllowed =
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin); // ✅ allow all Vercel subdomains

    if (isAllowed) {
      console.log("✅ Allowed CORS for:", origin || "NO ORIGIN");
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    callback(new Error(`Origin '${origin}' not allowed by CORS`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use((req, res, next) => {
  console.log("🛰️ Request received");
  console.log(
    "🔍 Request origin:",
    req.headers.origin || "❌ No origin header"
  );
  console.log("🔗 Request URL:", req.originalUrl);
  next();
});

// Middleware setup
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight handling
app.use(express.json());

// Database connections
connectCloudinary();
await connectDB();

// Routes
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "API Working",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("⚠️ Server error:", err);
  res.status(500).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server started on PORT: ${port}`);
  console.log("Allowed Origins:", allowedOrigins);
});
