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
exports.updateGrade = exports.getProfessorDisciplineStudents = exports.getProfessorDisciplines = exports.getMyGrades = exports.getGrades = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const grades_service_1 = require("../services/grades.service");
const getGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matricula } = req.params;
        // Assumindo que o middleware de autenticação popula req.user
        if (!req.user) {
            return res.status(401).json({ message: "Não autenticado." });
        }
        // 1. REGRA DE SEGURANÇA: Aluno só pode consultar o próprio boletim.
        if (req.user.perfil === "ALUNO") {
            // Como o Prisma vinculou o id do Usuário direto ao Aluno, a busca é instantânea
            const selfStudent = yield prismaClient_1.default.aluno.findUnique({
                where: { usuarioId: req.user.id }
            });
            if (!selfStudent) {
                return res.status(403).json({
                    message: "Usuário autenticado não está vinculado a um aluno no sistema.",
                });
            }
            if (selfStudent.matricula !== matricula) {
                return res.status(403).json({ message: "Acesso negado. Você só pode visualizar o seu boletim." });
            }
        }
        // 2. BUSCA DO BOLETIM E RELAÇÕES (Fim dos joins complexos!)
        const student = yield prismaClient_1.default.aluno.findUnique({
            where: { matricula: String(matricula) },
            include: {
                notas: {
                    include: {
                        disciplina: { select: { nome: true } }
                    },
                    orderBy: { id: "asc" }
                }
            }
        });
        if (!student) {
            return res.status(404).json({ message: "Aluno não encontrado." });
        }
        // 3. RETORNO DOS DADOS
        return res.json({
            aluno: student.nome,
            matricula: student.matricula,
            disciplinas: student.notas.map((nota) => ({
                id: nota.id, // O ID da nota é útil se o professor for editar na tela do frontend
                disciplina: nota.disciplina.nome,
                nota1: nota.nota1,
                nota2: nota.nota2,
                media: nota.media,
                faltas: nota.faltas, // <-- Novo campo do banco de dados!
                situacao: nota.situacao,
            })),
        });
    }
    catch (error) {
        console.error("Erro ao buscar notas:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.getGrades = getGrades;
const getMyGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Não autenticado." });
        }
        if (req.user.perfil !== "ALUNO") {
            return res.status(403).json({
                message: "Apenas alunos podem acessar o boletim proprio por esta rota.",
            });
        }
        const student = yield prismaClient_1.default.aluno.findUnique({
            where: { usuarioId: req.user.id },
            include: {
                notas: {
                    include: {
                        disciplina: { select: { nome: true } },
                    },
                    orderBy: { id: "asc" },
                },
            },
        });
        if (!student) {
            return res.status(404).json({
                message: "Aluno não encontrado para o usuario autenticado.",
            });
        }
        return res.json({
            aluno: student.nome,
            matricula: student.matricula,
            disciplinas: student.notas.map((nota) => ({
                id: nota.id,
                disciplina: nota.disciplina.nome,
                nota1: nota.nota1,
                nota2: nota.nota2,
                media: nota.media,
                faltas: nota.faltas,
                situacao: nota.situacao,
            })),
        });
    }
    catch (error) {
        console.error("Erro ao buscar boletim proprio:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.getMyGrades = getMyGrades;
const getProfessorDisciplines = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Não autenticado." });
        }
        if (req.user.perfil !== "PROFESSOR") {
            return res.status(403).json({ message: "Apenas professores podem acessar esta rota." });
        }
        const result = yield (0, grades_service_1.listProfessorDisciplines)(req.user.id);
        return res.json(result);
    }
    catch (error) {
        console.error("Erro ao carregar disciplinas do professor:", error);
        if (error instanceof grades_service_1.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.getProfessorDisciplines = getProfessorDisciplines;
const getProfessorDisciplineStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Não autenticado." });
        }
        if (req.user.perfil !== "PROFESSOR" && req.user.perfil !== "ADMIN") {
            return res.status(403).json({ message: "Acesso negado para este perfil." });
        }
        const disciplinaId = Number(req.params.disciplinaId);
        if (!Number.isFinite(disciplinaId)) {
            return res.status(400).json({ message: "Disciplina inválida." });
        }
        const result = yield (0, grades_service_1.getProfessorDisciplineGrades)(req.user.id, disciplinaId, req.user.perfil);
        return res.json(result);
    }
    catch (error) {
        console.error("Erro ao carregar notas da disciplina:", error);
        if (error instanceof grades_service_1.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.getProfessorDisciplineStudents = getProfessorDisciplineStudents;
const updateGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Não autenticado." });
        }
        const notaId = Number(req.params.id);
        if (!Number.isFinite(notaId)) {
            return res.status(400).json({ message: "Nota inválida." });
        }
        const result = yield (0, grades_service_1.updateStudentGrade)(req.user.id, req.user.perfil, notaId, {
            nota1: req.body.nota1,
            nota2: req.body.nota2,
            faltas: req.body.faltas,
        });
        return res.json(result);
    }
    catch (error) {
        console.error("Erro ao atualizar notas:", error);
        if (error instanceof grades_service_1.AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.updateGrade = updateGrade;
