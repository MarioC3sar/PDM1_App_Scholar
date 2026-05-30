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
exports.getTeachers = exports.createTeacher = void 0;
const client_1 = require("@prisma/client");
const prismaClient_1 = __importDefault(require("../prismaClient"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const requiredFields = ["nome", "titulacao", "area", "tempoDocencia", "email"];
const createTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const missingFields = requiredFields.filter((field) => { var _a; return !String((_a = req.body[field]) !== null && _a !== void 0 ? _a : "").trim(); });
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Campos obrigatórios ausentes.",
                campos: missingFields,
            });
        }
        const { nome, titulacao, area, tempoDocencia, email } = req.body;
        // 1. Verifica se o e-mail já existe na tabela de Usuários (para evitar duplicidade no login)
        const existingUser = yield prismaClient_1.default.usuario.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(409).json({ message: "E-mail já está em uso por outro usuário." });
        }
        // 2. Define uma senha padrão (ex: pegando a parte do email antes do '@')
        const senhaPadrao = email.split('@')[0];
        const senhaHash = yield bcryptjs_1.default.hash(senhaPadrao, 10);
        // 3. NESTED WRITE: Cria o Usuário E o Professor na mesma transação!
        const novoUsuario = yield prismaClient_1.default.usuario.create({
            data: {
                email: email,
                senhaHash: senhaHash,
                perfil: client_1.Perfil.PROFESSOR, // Usa o Enum gerado pelo Prisma
                // Entra na tabela Professor e vincula o ID automaticamente
                professor: {
                    create: {
                        nome,
                        titulacao,
                        area,
                        tempoDocencia
                    }
                }
            },
            include: {
                professor: true
            }
        });
        return res.status(201).json({
            message: "Professor e usuário de acesso cadastrados com sucesso.",
            professor: novoUsuario.professor,
            email_acesso: novoUsuario.email,
            senha_temporaria: senhaPadrao // Envia a senha gerada para exibir na tela do Admin
        });
    }
    catch (error) {
        console.error("Erro ao cadastrar professor:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.createTeacher = createTeacher;
const getTeachers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const professores = yield prismaClient_1.default.professor.findMany({
            orderBy: { id: "desc" },
            // Busca o email na tabela de usuários para devolver ao Frontend
            include: {
                usuario: { select: { email: true } }
            }
        });
        // Remonta o objeto para o App Scholar continuar funcionando perfeitamente
        const professoresFormatados = professores.map(prof => (Object.assign(Object.assign({}, prof), { email: prof.usuario.email // Puxa o email de volta para o nível principal do objeto
         })));
        return res.json({ total: professoresFormatados.length, professores: professoresFormatados });
    }
    catch (error) {
        console.error("Erro ao buscar professores:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.getTeachers = getTeachers;
