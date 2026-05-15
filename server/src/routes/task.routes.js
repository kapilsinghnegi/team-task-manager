import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, adminOnly, createTask);
router.get("/", protect, getAllTasks);
router.get("/:id", protect, getTaskById);
router.put("/:id", protect, adminOnly, updateTask);
router.patch("/:id", protect, updateTaskStatus);
router.delete("/:id", protect, adminOnly, deleteTask);

export default router;
