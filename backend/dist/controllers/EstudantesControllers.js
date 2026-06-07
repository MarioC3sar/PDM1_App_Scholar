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
exports.getStudents = exports.createStudent = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const zodController_1 = require("../schemas/zodController");
const student_account_service_1 = require("../services/student-account.service");
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validacao = zodController_1.createStudentAccountSchema.safeParse(req.body);
        if (!validacao.success) {
            return res.status(400).json({
                message: "Erro na validacao dos dados.",
                detalhes: validacao.error.format(),
            });
        }
        const resultado = yield (0, student_account_service_1.createStudentAccount)(validacao.data);
        return res.status(201).json({
            message: "Aluno cadastrado com sucesso.",
            aluno: resultado.aluno,
            usuario: resultado.usuario,
            senhaTemporaria: resultado.senhaTemporaria,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Erro interno do servidor.";
        console.error("Erro ao cadastrar aluno:", error);
        return res.status(500).json({ message });
    }
});
exports.createStudent = createStudent;
const getStudents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alunos = yield prismaClient_1.default.aluno.findMany({
            orderBy: { id: "desc" },
            include: {
                curso: { select: { nome: true } },
                usuario: { select: { email: true, primeiroAcesso: true } },
            },
        });
        const alunosFormatados = alunos.map((aluno) => (Object.assign(Object.assign({}, aluno), { email: aluno.usuario.email, emailInstitucional: aluno.usuario.email, primeiroAcesso: aluno.usuario.primeiroAcesso, curso: aluno.curso.nome, semestre: aluno.semestre })));
        return res.json({
            total: alunosFormatados.length,
            alunos: alunosFormatados,
        });
    }
    catch (error) {
        console.error("Erro ao buscar alunos:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.getStudents = getStudents;
