import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter, projectRouter, taskRouter, userRouter } from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/users", userRouter);

app.get("/api", (_, res) => {
  return res.status(200).json({ success: true, message: "Hello World" });
});

export default app;
