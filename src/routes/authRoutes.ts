import { Router } from "express";
import { createSession, validatePassword } from "../controllers/authController";

const router = Router();

router.get("/session", createSession);
router.post("/validate", validatePassword);

export default router;
