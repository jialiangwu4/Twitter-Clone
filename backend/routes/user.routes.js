import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
  updateUserProfile,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile); // Get user profile
router.get("/suggested", protectedRoute, getSuggestedUsers); // Get suggested users
router.post("/follow/:id", protectedRoute, followUnfollowUser); // Follow or unfollow a user
router.post("/update", protectedRoute, updateUserProfile); // Update user profile
export default router;
