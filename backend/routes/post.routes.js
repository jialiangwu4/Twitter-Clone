import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  createPost,
  deletePost,
  commentPost,
  likeUnlikePost,
  getAllPosts,
} from "../controllers/post.controller.js";
import { get } from "mongoose";

const router = express.Router();

router.get("/all", protectedRoute, getAllPosts);
router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likeUnlikePost);
router.post("/comment/:id", protectedRoute, commentPost);
router.delete("/:id", protectedRoute, deletePost);

export default router;
