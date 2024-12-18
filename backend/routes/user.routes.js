import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { getUserProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
// router.get("/suggested", protectedRoute, getSuggestedUsers);
// router.get("/following/:id", protectedRoute, getFollowingUsers);
// router.get("/update", protectedRoute, updateUserProfile);
export default router;
