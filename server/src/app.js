import express from "express";
import authRouter from "../routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/api", (_, res) => {
  return res.status(200).json({ success: true, message: "Hello World" });
});

export default app;
