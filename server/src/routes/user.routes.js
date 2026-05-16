import express from "express";
import { getUsers } from "../controllers/user.controller.js";
import { adminOnly, protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);

export default router;
