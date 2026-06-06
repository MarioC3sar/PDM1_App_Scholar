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
const prismaClient_1 = __importDefault(require("../prismaClient"));
const zodController_1 = require("../schemas/zodController");
const teacher_account_service_1 = require("../services/teacher-account.service");
const createTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validacao = zodController_1.createTeacherAccountSchema.safeParse(req.body);
        if (!validacao.success) {
            return res.status(400).json({
                message: "Erro na validacao dos dados.",
                detalhes: validacao.error.format(),
            });
        }
        const resultado = yield (0, teacher_account_service_1.createTeacherAccount)(validacao.data);
        return res.status(201).json({
            message: "Professor e usuario de acesso cadastrados com sucesso.",
            professor: resultado.professor,
            email_pessoal: resultado.professor.emailPessoal,
            email_acesso: resultado.usuario.email,
            senha_temporaria: resultado.senhaTemporaria,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Erro interno do servidor.";
        console.error("Erro ao cadastrar professor:", error);
        return res.status(500).json({ message });
    }
});
exports.createTeacher = createTeacher;
const getTeachers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const professores = yield prismaClient_1.default.professor.findMany({
            orderBy: { id: "desc" },
            include: {
                usuario: { select: { email: true } },
            },
        });
        const professoresFormatados = professores.map((professor) => (Object.assign(Object.assign({}, professor), { email: professor.usuario.email })));
        return res.json({
            total: professoresFormatados.length,
            professores: professoresFormatados,
        });
    }
    catch (error) {
        console.error("Erro ao buscar professores:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.getTeachers = getTeachers;
