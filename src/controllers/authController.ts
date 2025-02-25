import { Request, Response } from "express";
import { generateSession, validateSession } from "../config/sessionManager";

export function createSession(req: Request, res: Response): void {
  const { sessionId, keyPairs } = generateSession();
  res.json({ sessionId, keyPairs });
}

export function validatePassword(req: Request, res: Response): void {
  const { sessionId, inputValue } = req.body;

  if (!validateSession(sessionId)) {
    res.status(400).json({ message: "Sessão inválida ou expirada." });
    return;
  }

  // Aqui poderia ser validada a senha do usuário no banco de dados
  console.log("Senha recebida:", inputValue);

  res.json({ message: "Senha enviada para validação." });
}
