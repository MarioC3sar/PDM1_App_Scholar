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
exports.getCursos = exports.createCurso = exports.cursoSchema = void 0;
const prismaClient_1 = __importDefault(require("../prismaClient"));
const zod_1 = require("zod");
// Molde de validação para o Curso
exports.cursoSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, "O nome do curso deve ter no mínimo 3 caracteres."),
    descricao: zod_1.z.string().optional(),
});
const createCurso = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validacao = exports.cursoSchema.safeParse(req.body);
        if (!validacao.success) {
            return res.status(400).json({
                message: "Erro na validação.",
                detalhes: validacao.error.format(),
            });
        }
        const { nome, descricao } = validacao.data;
        const existingCurso = yield prismaClient_1.default.curso.findUnique({
            where: { nome },
        });
        if (existingCurso) {
            return res.status(409).json({ message: "Este curso já está cadastrado." });
        }
        const novoCurso = yield prismaClient_1.default.curso.create({
            data: { nome, descricao },
        });
        return res.status(201).json({
            message: "Curso cadastrado com sucesso.",
            curso: novoCurso,
        });
    }
    catch (error) {
        console.error("Erro ao cadastrar curso:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.createCurso = createCurso;
const getCursos = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cursos = yield prismaClient_1.default.curso.findMany({
            orderBy: { nome: "asc" },
        });
        return res.json({ total: cursos.length, cursos });
    }
    catch (error) {
        console.error("Erro ao buscar cursos:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.getCursos = getCursos;
