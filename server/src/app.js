import express from "express";
import cookieParser from "cookie-parser";
import { authRouter, projectRouter, taskRouter } from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);

app.get("/api", (_, res) => {
  return res.status(200).json({ success: true, message: "Hello World" });
});

export default app;
