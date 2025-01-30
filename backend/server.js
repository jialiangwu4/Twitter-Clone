import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary"; //cloudinary is a library for uploading and managing images

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

// cloudinary config
// see cloudinary documentation
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

// set the limit for request body, note that the limit shouldn't be too large to avoid DoS attack
app.use(express.json({ limit: "10mb" })); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies

app.use(cookieParser()); // Middleware to parse cookies
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectMongoDB();
});
