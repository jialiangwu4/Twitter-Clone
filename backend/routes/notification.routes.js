import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import {
  getNotifications,
  deleteNotifications,
  deleteNotification,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectedRoute, getNotifications);
router.delete("/", protectedRoute, deleteNotifications);
router.delete("/:id", protectedRoute, deleteNotification); //delete a specific notification

export default router;
