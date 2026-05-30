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
exports.getDisciplinas = exports.createDisciplina = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
// Agora exigimos os IDs exatos, evitando erros de digitação e homônimos
const requiredFields = [
    "nome",
    "cargaHoraria",
    "professorId",
    "cursoId",
    "semestre",
];
const createDisciplina = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const missingFields = requiredFields.filter((field) => !req.body[field] || String(req.body[field]).trim() === "");
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: "Campos obrigatórios ausentes.",
                campos: missingFields,
            });
        }
        const { nome, cargaHoraria, professorId, cursoId, semestre } = req.body;
        // 1. Verifica se o Professor existe
        const teacher = yield prismaClient_1.default.professor.findUnique({
            where: { id: Number(professorId) },
        });
        if (!teacher) {
            return res.status(400).json({
                message: "Professor não encontrado. Verifique o ID informado.",
            });
        }
        // 2. Verifica se o Curso existe
        const curso = yield prismaClient_1.default.curso.findUnique({
            where: { id: Number(cursoId) },
        });
        if (!curso) {
            return res.status(400).json({
                message: "Curso base não encontrado. Verifique o ID informado.",
            });
        }
        // 3. Cria a disciplina e já vincula os IDs
        const disciplina = yield prismaClient_1.default.disciplina.create({
            data: {
                nome: String(nome),
                cargaHoraria: Number(cargaHoraria),
                semestre: String(semestre),
                professorId: teacher.id,
                cursoId: curso.id,
            },
            // Pede pro Prisma devolver a disciplina recém-criada JÁ com os dados do professor e curso
            include: {
                professor: { select: { nome: true } },
                curso: { select: { nome: true } }
            }
        });
        return res.status(201).json({
            message: "Disciplina cadastrada com sucesso.",
            disciplina,
        });
    }
    catch (error) {
        console.error("Erro ao criar disciplina:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.createDisciplina = createDisciplina;
const getDisciplinas = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const disciplinas = yield prismaClient_1.default.disciplina.findMany({
            // include substitui os "joins" complexos do Sequelize de forma elegante
            include: {
                professor: {
                    select: { nome: true }, // Traz apenas o nome para não vazar dados sensíveis
                },
                curso: {
                    select: { nome: true },
                }
            },
            orderBy: {
                id: "desc",
            },
        });
        return res.json({ total: disciplinas.length, disciplinas });
    }
    catch (error) {
        console.error("Erro ao buscar disciplinas:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.getDisciplinas = getDisciplinas;
