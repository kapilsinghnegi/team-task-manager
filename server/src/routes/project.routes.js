import express from "express";
import {
  addProjectMember,
  createProject,
  getProject,
  getProjects,
  removeProjectMember,
} from "../controllers/project.controller.js";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";
import { isProjectAdmin } from "../middlewares/project.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, createProject);
router.post("/create", protect, adminOnly, createProject);
router.get("/", protect, getProjects);
router.get("/:projectId", protect, getProject);
router.post("/:projectId/members", protect, isProjectAdmin, addProjectMember);
router.delete(
  "/:projectId/members/:userId",
  protect,
  isProjectAdmin,
  removeProjectMember,
);

export default router;
