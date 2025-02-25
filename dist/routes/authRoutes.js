"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.get("/session", authController_1.createSession);
router.post("/validate", authController_1.validatePassword);
exports.default = router;
