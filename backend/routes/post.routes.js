import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  createPost,
  deletePost,
  commentPost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", protectedRoute, createPost);
router.post("/comment/:id", protectedRoute, commentPost);
router.delete("/:id", protectedRoute, deletePost);

export default router;
