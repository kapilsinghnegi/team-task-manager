import express from "express";
import {
  createProject,
  getProjects,
} from "../controllers/project.controller.js";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, adminOnly, createProject);
router.get("/", protect, getProjects);

export default router;
