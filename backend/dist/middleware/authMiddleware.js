"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const getBearerToken = (req) => {
    const header = req.headers.authorization;
    if (!header)
        return null;
    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token)
        return null;
    return token;
};
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = getBearerToken(req);
    if (!token) {
        return res.status(401).json({ message: "Token ausente." });
    }
    try {
        const secret = process.env.JWT_SECRET || "appscholar-secret";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = yield user_1.User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "Usuario nao encontrado." });
        }
        req.user = {
            id: user.id,
            perfil: user.perfil,
            email: user.email,
            nome: user.nome,
        };
        return next();
    }
    catch (_a) {
        return res.status(401).json({ message: "Token invalido ou expirado." });
    }
});
exports.authenticate = authenticate;
const authorize = (...allowed) => (req, res, next) => {
    var _a;
    const perfil = (_a = req.user) === null || _a === void 0 ? void 0 : _a.perfil;
    if (!perfil) {
        return res.status(401).json({ message: "Nao autenticado." });
    }
    // Admin sempre tem acesso total
    if (perfil === "admin") {
        return next();
    }
    if (!allowed.includes(perfil)) {
        return res.status(403).json({ message: "Acesso negado." });
    }
    return next();
};
exports.authorize = authorize;
