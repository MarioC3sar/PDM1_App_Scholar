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
exports.getDisciplinas = exports.updateDisciplina = exports.createDisciplina = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
// Agora exigimos os IDs exatos, evitando erros de digitação e homônimos
const requiredFields = [
    "nome",
    "cargaHoraria",
    "professorId",
    "cursoId",
    "semestre",
];
const optionalUpdateFields = [
    "nome",
    "cargaHoraria",
    "professorId",
    "cursoId",
    "semestre",
];
const resolveDisciplinaData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const missingFields = requiredFields.filter((field) => !req.body[field] || String(req.body[field]).trim() === "");
    if (missingFields.length > 0) {
        res.status(400).json({
            message: "Campos obrigatórios ausentes.",
            campos: missingFields,
        });
        return null;
    }
    const { nome, cargaHoraria, professorId, cursoId, semestre } = req.body;
    const teacher = yield prismaClient_1.default.professor.findUnique({
        where: { id: Number(professorId) },
    });
    if (!teacher) {
        res.status(400).json({
            message: "Professor não encontrado. Verifique o ID informado.",
        });
        return null;
    }
    const curso = yield prismaClient_1.default.curso.findUnique({
        where: { id: Number(cursoId) },
    });
    if (!curso) {
        res.status(400).json({
            message: "Curso base não encontrado. Verifique o ID informado.",
        });
        return null;
    }
    return {
        nome: String(nome),
        cargaHoraria: Number(cargaHoraria),
        semestre: String(semestre),
        professorId: teacher.id,
        cursoId: curso.id,
    };
});
const createDisciplina = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield resolveDisciplinaData(req, res);
        if (!data) {
            return;
        }
        const disciplina = yield prismaClient_1.default.disciplina.create({
            data,
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
const updateDisciplina = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const disciplinaId = Number(req.params.id);
        if (!Number.isFinite(disciplinaId)) {
            return res.status(400).json({ message: "Disciplina inválida." });
        }
        const providedFields = optionalUpdateFields.filter((field) => req.body[field] !== undefined && String(req.body[field]).trim() !== "");
        if (providedFields.length === 0) {
            return res.status(400).json({
                message: "Envie ao menos um campo para atualizar a disciplina.",
            });
        }
        const existing = yield prismaClient_1.default.disciplina.findUnique({
            where: { id: disciplinaId },
            select: { id: true, nome: true, cargaHoraria: true, semestre: true },
        });
        if (!existing) {
            return res.status(404).json({ message: "Disciplina não encontrada." });
        }
        const data = {};
        if (req.body.nome !== undefined && String(req.body.nome).trim() !== "") {
            data.nome = String(req.body.nome).trim();
        }
        if (req.body.cargaHoraria !== undefined && String(req.body.cargaHoraria).trim() !== "") {
            const cargaHoraria = Number(req.body.cargaHoraria);
            if (!Number.isFinite(cargaHoraria)) {
                return res.status(400).json({ message: "Carga horária inválida." });
            }
            data.cargaHoraria = cargaHoraria;
        }
        if (req.body.semestre !== undefined && String(req.body.semestre).trim() !== "") {
            data.semestre = String(req.body.semestre).trim();
        }
        if (req.body.professorId !== undefined && String(req.body.professorId).trim() !== "") {
            const professorId = Number(req.body.professorId);
            if (!Number.isFinite(professorId)) {
                return res.status(400).json({ message: "Professor inválido." });
            }
            const teacher = yield prismaClient_1.default.professor.findUnique({
                where: { id: professorId },
            });
            if (!teacher) {
                return res.status(400).json({
                    message: "Professor não encontrado. Verifique o ID informado.",
                });
            }
            data.professorId = teacher.id;
        }
        if (req.body.cursoId !== undefined && String(req.body.cursoId).trim() !== "") {
            const cursoId = Number(req.body.cursoId);
            if (!Number.isFinite(cursoId)) {
                return res.status(400).json({ message: "Curso inválido." });
            }
            const curso = yield prismaClient_1.default.curso.findUnique({
                where: { id: cursoId },
            });
            if (!curso) {
                return res.status(400).json({
                    message: "Curso base não encontrado. Verifique o ID informado.",
                });
            }
            data.cursoId = curso.id;
        }
        if (Object.keys(data).length === 0) {
            return;
        }
        const disciplina = yield prismaClient_1.default.disciplina.update({
            where: { id: disciplinaId },
            data,
            include: {
                professor: { select: { nome: true } },
                curso: { select: { nome: true } },
            },
        });
        return res.json({
            message: "Disciplina atualizada com sucesso.",
            disciplina,
        });
    }
    catch (error) {
        console.error("Erro ao atualizar disciplina:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.updateDisciplina = updateDisciplina;
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
