import { Request, Response } from "express";
import bcrypt from "bcrypt";
import pool from "../config/database";
import { generateSession, validateSession, invalidateSession } from "../config/sessionManager";
import { encryptData } from "../utils/cryptoUtils";

export async function createSession(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    const [rows]: any = await pool.execute(
      "SELECT id, password_hash FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0 || !rows[0].password_hash) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, rows[0].password_hash);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    const { sessionId, keyPairs, encryptedPairs } = await generateSession(rows[0].id); 
    res.json({ sessionId, keyPairs, encryptedPairs });
  } catch (error) {
    console.error("Erro ao criar sessão:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function validatePassword(req: Request, res: Response): Promise<void> {
  try {
    const { inputValue, sessionId, encryptedPairs, username } = req.body;

    if (!await validateSession(sessionId, encryptedPairs, inputValue, username)) {
      res.status(400).json({ message: "Sessão inválida ou expirada." });
      return;
    }

    await invalidateSession(sessionId);
    res.status(200).json({ message: "Senha válida." });
  } catch (error) {
    console.error("Erro ao validar senha:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    await pool.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, password_hash]);
    res.json({ message: "Usuário registrado com sucesso." });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    const [rows]: any = await pool.execute(
      "SELECT id, password_hash FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0 || !rows[0].password_hash) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, rows[0].password_hash);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    const { sessionId, keyPairs, encryptedPairs } = await generateSession(rows[0].id);

    res.json({
      message: "Login bem-sucedido",
      sessionId,
      keyPairs: keyPairs,
      encryptedPairs: encryptedPairs
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
}
