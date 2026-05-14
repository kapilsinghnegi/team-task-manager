import express from "express";

const app = express();

app.get("/", (_, res) => {
  return res.json({ success: true, message: "Hello World" });
});

export default app;
