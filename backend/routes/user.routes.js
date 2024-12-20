import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  getUserProfile,
  followUnfollowUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile); // Get user profile
router.post("/follow/:id", protectedRoute, followUnfollowUser); // Follow or unfollow a user
// router.get("/suggested", protectedRoute, getSuggestedUsers);
// router.get("/update", protectedRoute, updateUserProfile);
export default router;
