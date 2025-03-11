import crypto from "crypto";

const SECRET_KEY = "mysecretkey"; // Substitua por algo mais seguro

// Garante que a chave tenha 32 bytes
const key = crypto.createHash('sha256').update(SECRET_KEY).digest();

// Exemplo de criptografia com a chave de 32 bytes
export function encryptData(data: string): string {
  const iv = crypto.randomBytes(16);  // IV de 16 bytes
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ":" + encrypted; // Retorna o IV e os dados criptografados
}

// Função de descriptografia
export function decryptData(encryptedData: string): string {
  const [ivHex, encrypted] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
