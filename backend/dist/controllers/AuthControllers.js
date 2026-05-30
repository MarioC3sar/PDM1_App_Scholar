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
exports.createAdmin = exports.logout = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
dotenv_1.default.config();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { login: rawLogin, email, password } = req.body;
        const loginValue = (_a = rawLogin !== null && rawLogin !== void 0 ? rawLogin : email) !== null && _a !== void 0 ? _a : "";
        const passwordValue = password !== null && password !== void 0 ? password : "";
        if (!loginValue.trim() || !passwordValue.trim()) {
            return res.status(400).json({
                message: "Login/email e senha são obrigatórios.",
            });
        }
        const user = yield prismaClient_1.default.usuario.findFirst({
            where: {
                OR: [
                    { email: loginValue },
                    { aluno: { matricula: loginValue } },
                ],
            },
            include: {
                aluno: true,
                professor: true,
            },
        });
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado." });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(passwordValue, user.senhaHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Senha inválida." });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET não definido nas variáveis de ambiente!");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, perfil: user.perfil }, secret, { expiresIn: "1h" });
        const nomeDoUsuario = ((_b = user.aluno) === null || _b === void 0 ? void 0 : _b.nome) || ((_c = user.professor) === null || _c === void 0 ? void 0 : _c.nome) || "Administrador";
        return res.json({
            token,
            usuario: {
                id: user.id,
                nome: nomeDoUsuario,
                perfil: user.perfil,
                email: user.email,
            },
        });
    }
    catch (error) {
        console.error("Erro interno na rota de login:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.login = login;
const logout = (_req, res) => {
    res.json({ message: "Logout efetuado no cliente." });
};
exports.logout = logout;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, senha } = req.body;
        if (!(email === null || email === void 0 ? void 0 : email.trim())) {
            return res.status(400).json({
                message: "O e-mail é obrigatório.",
            });
        }
        const existingUser = yield prismaClient_1.default.usuario.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({ message: "E-mail já está em uso por outro usuário." });
        }
        const senhaTemporaria = (senha === null || senha === void 0 ? void 0 : senha.trim()) || email.split("@")[0];
        const senhaHash = yield bcryptjs_1.default.hash(senhaTemporaria, 10);
        const novoUsuario = yield prismaClient_1.default.usuario.create({
            data: {
                email,
                senhaHash,
                perfil: client_1.Perfil.ADMIN,
            },
        });
        return res.status(201).json({
            message: "Usuário administrador cadastrado com sucesso.",
            usuario: {
                id: novoUsuario.id,
                email: novoUsuario.email,
                perfil: novoUsuario.perfil,
            },
            senha_temporaria: senhaTemporaria,
        });
    }
    catch (error) {
        console.error("Erro ao cadastrar admin:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.createAdmin = createAdmin;
