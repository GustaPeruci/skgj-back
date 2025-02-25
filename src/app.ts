import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/api", authRoutes);

export default app;
