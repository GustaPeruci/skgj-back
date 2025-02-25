"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = createSession;
exports.validatePassword = validatePassword;
const sessionManager_1 = require("../config/sessionManager");
function createSession(req, res) {
    const { sessionId, keyPairs } = (0, sessionManager_1.generateSession)();
    res.json({ sessionId, keyPairs });
}
function validatePassword(req, res) {
    const { sessionId, inputValue } = req.body;
    if (!(0, sessionManager_1.validateSession)(sessionId)) {
        res.status(400).json({ message: "Sessão inválida ou expirada." });
        return;
    }
    // Aqui poderia ser validada a senha do usuário no banco de dados
    console.log("Senha recebida:", inputValue);
    res.json({ message: "Senha enviada para validação." });
}
