"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSession = generateSession;
exports.validateSession = validateSession;
const crypto_1 = __importDefault(require("crypto"));
const sessions = new Map();
function generateSession() {
    const sessionId = crypto_1.default.randomBytes(16).toString("hex");
    const keyPairs = [
        ["2", "6"], ["3", "8"], ["0", "4"], ["7", "9"], ["1", "5"]
    ].sort(() => Math.random() - 0.5);
    sessions.set(sessionId, { keyPairs, active: true });
    return { sessionId, keyPairs };
}
function validateSession(sessionId) {
    const session = sessions.get(sessionId);
    if (!session || !session.active)
        return false;
    // Inativa a sessão após a validação
    session.active = false;
    return true;
}
