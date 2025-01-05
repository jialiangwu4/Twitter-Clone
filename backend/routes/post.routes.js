import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  createPost,
  deletePost,
  commentPost,
  likeUnlikePost,
  getAllPosts,
  getLikedPosts,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectedRoute, getAllPosts);
router.get("/likes/:id", protectedRoute, getLikedPosts);
router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likeUnlikePost);
router.post("/comment/:id", protectedRoute, commentPost);
router.delete("/:id", protectedRoute, deletePost);

export default router;
