import express from "express";
import {
  createTask,
  deleteTask,
  getDashboard,
  getMyTasks,
  getProjectTasks,
  updateTask,
} from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { isProjectMember } from "../middlewares/project.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboard);
router.get("/mine", protect, getMyTasks);
router.post("/project/:projectId", protect, isProjectMember, createTask);
router.get("/project/:projectId", protect, isProjectMember, getProjectTasks);
router.patch("/:taskId", protect, updateTask);
router.delete("/:taskId", protect, deleteTask);
export default router;
