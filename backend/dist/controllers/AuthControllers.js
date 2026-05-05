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
exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { login: rawLogin, email, password, senha } = req.body;
    const loginValue = (_a = rawLogin !== null && rawLogin !== void 0 ? rawLogin : email) !== null && _a !== void 0 ? _a : "";
    const passwordValue = (_b = password !== null && password !== void 0 ? password : senha) !== null && _b !== void 0 ? _b : "";
    if (!loginValue.trim() || !passwordValue.trim()) {
        return res.status(400).json({
            message: "Login/email e senha sao obrigatorios.",
        });
    }
    const user = yield user_1.User.findOne({
        where: {
            email: loginValue,
        },
    });
    const userByLogin = user !== null && user !== void 0 ? user : (yield user_1.User.findOne({ where: { login: loginValue } }));
    if (!userByLogin) {
        return res.status(401).json({ message: "Usuario nao encontrado." });
    }
    const isPasswordValid = yield bcryptjs_1.default.compare(passwordValue, userByLogin.senhaHash);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Senha invalida." });
    }
    const token = jsonwebtoken_1.default.sign({ id: userByLogin.id, perfil: userByLogin.perfil }, process.env.JWT_SECRET || "appscholar-secret", { expiresIn: "1h" });
    return res.json({
        token,
        usuario: {
            nome: userByLogin.nome,
            perfil: userByLogin.perfil,
            email: userByLogin.email,
        },
    });
});
exports.login = login;
const logout = (_req, res) => res.json({ message: "Logout efetuado no cliente." });
exports.logout = logout;
