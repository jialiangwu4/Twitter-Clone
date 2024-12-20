import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  getUserProfile,
  followUnfollowUser,
  getSuggestedUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile); // Get user profile
router.get("/suggested", protectedRoute, getSuggestedUsers); // Get suggested users
router.post("/follow/:id", protectedRoute, followUnfollowUser); // Follow or unfollow a user
// router.get("/update", protectedRoute, updateUserProfile);
export default router;
