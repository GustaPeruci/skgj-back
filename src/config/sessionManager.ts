import crypto from "crypto";

interface SessionData {
  keyPairs: [string, string][];
  active: boolean;
}

const sessions: Map<string, SessionData> = new Map();

export function generateSession(): { sessionId: string; keyPairs: [string, string][] } {
  const sessionId = crypto.randomBytes(16).toString("hex");
  const keyPairs: [string, string][] = ([
    ["2", "6"], ["3", "8"], ["0", "4"], ["7", "9"], ["1", "5"]
  ] as [string, string][]).sort(() => Math.random() - 0.5);  

  sessions.set(sessionId, { keyPairs, active: true });

  return { sessionId, keyPairs };
}

export function validateSession(sessionId: string): boolean {
  const session = sessions.get(sessionId);
  if (!session || !session.active) return false;

  // Inativa a sessão após a validação
  session.active = false;
  return true;
}
