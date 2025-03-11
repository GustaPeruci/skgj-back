import crypto from "crypto";
import bcrypt from "bcrypt";
import pool from "./database";
import { encryptData, decryptData } from "../utils/cryptoUtils";

interface KeyPair {
  key1: string;
  key2: string;
}

// Geração de uma nova sessão
export async function generateSession(userId: number): Promise<{ sessionId: string; keyPairs: string, encryptedPairs: string }> {
  try {
    const sessionId = crypto.randomBytes(16).toString("hex");

    // Gerando os pares de teclas de forma aleatória
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    // Embaralha os dígitos
    const shuffledDigits = digits.sort(() => Math.random() - 0.5);

    // Cria pares aleatórios
    const keyPairs = JSON.stringify(
      Array.from({ length: 5 }, (_, i) =>
        shuffledDigits.splice(0, 2) // Pega e remove dois elementos aleatórios
      ).sort(() => Math.random() - 0.5) // Embaralha a ordem dos pares
    );

    if (!sessionId || !keyPairs) {
      throw new Error("Falha ao gerar sessionId ou keyPairs.");
    }

    const encryptedPairs = encryptData(keyPairs);
    if (!encryptedPairs) {
      throw new Error("Falha ao criptografar os pares de teclas.");
    }

    // Armazenando a sessão no banco de dados
    await pool.execute(
      "INSERT INTO sessions (session_id, user_id, key_pairs, active) VALUES (?, ?, ?, TRUE)",
      [sessionId, userId, encryptedPairs]
    );

    return { sessionId, keyPairs, encryptedPairs };
  } catch (error) {
    console.error("Erro ao criar sessão:", error);
    throw error; // Re-throw the error after logging it
  }
}

// Validação da sessão
export async function validateSession(sessionId: string, encryptedPairs: string, password: string, username: string): Promise<boolean> {
  const [rowsSessions]: any = await pool.execute("SELECT * FROM sessions WHERE session_id = ?", [sessionId]);

  if (rowsSessions.length === 0 || !rowsSessions[0].active || rowsSessions[0].key_pairs !== encryptedPairs) {
    console.log(rowsSessions.length)
    console.log(rowsSessions[0].active) 
    console.log(rowsSessions[0].key_pairs) 
    console.log(encryptedPairs);
    console.log("Sessão inválida ou expirada.");
    return false;
  }

  const decryptedPairs = decryptData(encryptedPairs);

  const [rowsUsers]: any = await pool.execute(
    "SELECT id, password_hash FROM users WHERE username = ?",
    [username]
  );

  if (rowsUsers.length === 0 || !rowsUsers[0].password_hash) {
    console.log("Usuário não encontrado ou sem senha.");
    return false;
  }

  // Gerar todas as combinações possíveis com base no teclado
  const keyPairs = JSON.parse(decryptedPairs);
  const splitPassword = password.split("");

  // Criar todas as combinações possíveis de senhas a partir dos pares
  console.log(keyPairs)
  console.log(splitPassword)
  const generatedPasswords = generatePossiblePasswords(keyPairs, password);
  
  console.log(generatedPasswords);  // Para fins de debug, você pode remover isso depois

  // Verificar se a senha fornecida está nas combinações geradas
  if (!generatedPasswords.includes(password)) {
    console.log("Senha não corresponde aos pares de chave.");
    return false;
  }

  for (const generatedPassword of generatedPasswords) {
    const passwordMatch = await bcrypt.compare(generatedPassword, rowsUsers[0].password_hash);

    if (passwordMatch) {
      console.log("Senha válida.");
      return true;
    }
  }

  // const passwordMatch = await bcrypt.compare(password, rowsUsers[0].password_hash);

  // if (!passwordMatch) return false;

  // Marca a sessão como inválida (inativa) após o primeiro uso
  await pool.execute("UPDATE sessions SET active = FALSE WHERE session_id = ?", [sessionId]);

  return true;
}

// Função para gerar todas as combinações possíveis de senha a partir dos pares de chave
function generatePossiblePasswords(keyPairs: string[][], password: string): string[] {
  // Criar um mapa para facilitar a busca dos pares
  const keyMap: { [key: string]: string } = {};

  for (const pair of keyPairs) {
    keyMap[pair[0]] = pair[1];
    keyMap[pair[1]] = pair[0];
  }

  // Criar um array de opções para cada dígito da senha
  let possibleCharsArray: string[][] = [];

  for (const char of password) {
    if (keyMap[char]) {
      possibleCharsArray.push([char, keyMap[char]]);
    } else {
      possibleCharsArray.push([char]); // Se o caractere não tem substituto, mantém ele mesmo
    }
  }

  // Gerar todas as combinações possíveis
  return generateCombinations(possibleCharsArray);
}

// Função para gerar todas as combinações possíveis de um array de arrays
function generateCombinations(arrays: string[][]): string[] {
  let results: string[] = [""];

  for (let options of arrays) {
    let newResults: string[] = [];
    for (let result of results) {
      for (let option of options) {
        newResults.push(result + option);
      }
    }
    results = newResults;
  }

  return results;
}



// Invalidação da sessão (utilizada após validar a senha)
export async function invalidateSession(sessionId: string): Promise<void> {
  try {
    await pool.execute("UPDATE sessions SET active = FALSE WHERE session_id = ?", [sessionId]);
  } catch (error) {
    console.error("Erro ao invalidar a sessão:", error);
  }
}

export async function getKeyPairs(sessionId: string): Promise<string[]> {
  const [rows]: any = await pool.execute("SELECT key_pairs FROM sessions WHERE session_id = ?", [sessionId]);

  if (rows.length === 0) {
    throw new Error("Sessão não encontrada");
  }

  const decryptedPairs = decryptData(rows[0].key_pairs);

  try {
    // Tenta fazer o parse da string descriptografada
    const keyPairs = JSON.parse(decryptedPairs);

    if (Array.isArray(keyPairs)) {
      return keyPairs; // Retorna como array se for válido
    } else {
      throw new Error("Pares de teclas não são um array válido.");
    }
  } catch (error) {
    console.error("Erro ao converter decryptedPairs para array:", error);
    throw new Error("Erro ao processar os pares de teclas.");
  }
}

