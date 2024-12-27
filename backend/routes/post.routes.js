import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { createPost, deletePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protectedRoute, createPost);
router.delete("/:id", protectedRoute, deletePost);

export default router;
