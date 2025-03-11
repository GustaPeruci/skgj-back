import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createSession, validatePassword, register, login } from "./controllers/authController";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/session", createSession);
app.post("/api/validate", validatePassword);
app.post("/api/login", login);
app.post("/api/signup", register);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
