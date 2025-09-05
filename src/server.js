import "dotenv/config.js";
import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import userRoutes from "../routes/user.routes.js";
import postRoutes from "../routes/post.routes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("➡️", req.method, req.originalUrl);
  next();
});
app.use("/users", userRoutes);
app.use("/posts", postRoutes); 

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

const PORT = process.env.PORT || 4000;
connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
});
