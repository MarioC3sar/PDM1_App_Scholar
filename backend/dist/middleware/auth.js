"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autorizar = exports.autenticar = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const autenticar = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token não fornecido ou inválido." });
    }
    const token = authHeader.split(" ")[1];
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("JWT_SECRET não configurado.");
        // O TS agora aceita o req.user naturalmente graças ao seu arquivo global!
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = {
            id: decoded.id,
            perfil: decoded.perfil
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Sessão expirada ou token inválido." });
    }
};
exports.autenticar = autenticar;
const autorizar = (perfisPermitidos) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
        if (!perfisPermitidos.includes(req.user.perfil)) {
            return res.status(403).json({
                message: "Acesso negado. Você não tem permissão para realizar esta ação."
            });
        }
        next();
    };
};
exports.autorizar = autorizar;
