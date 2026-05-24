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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGrade = exports.getGrades = void 0;
const courses_1 = require("../models/courses");
const grades_1 = require("../models/grades");
const student_1 = require("../models/student");
const getGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { matricula } = req.params;
    if (!req.user) {
        return res.status(401).json({ message: "Nao autenticado." });
    }
    // Aluno so pode consultar o proprio boletim.
    if (req.user.perfil === "aluno") {
        const selfStudent = yield student_1.Student.findOne({ where: { email: req.user.email } });
        if (!selfStudent) {
            return res.status(403).json({
                message: "Aluno autenticado nao esta vinculado a uma matricula. Verifique o email cadastrado.",
            });
        }
        if (selfStudent.matricula !== matricula) {
            return res.status(403).json({ message: "Acesso negado ao boletim de outro aluno." });
        }
    }
    const student = yield student_1.Student.findOne({ where: { matricula } });
    if (!student) {
        return res.status(404).json({ message: "Aluno nao encontrado." });
    }
    const studentGrades = yield grades_1.Grade.findAll({
        where: { alunoId: student.id },
        include: [{ model: courses_1.Course, as: "disciplina", attributes: ["nome"] }],
        order: [["id", "ASC"]],
    });
    return res.json({
        aluno: student.nome,
        matricula: student.matricula,
        disciplinas: studentGrades.map((grade) => {
            var _a, _b;
            return ({
                disciplina: (_b = (_a = grade.disciplina) === null || _a === void 0 ? void 0 : _a.nome) !== null && _b !== void 0 ? _b : "Disciplina nao encontrada",
                nota1: grade.nota1,
                nota2: grade.nota2,
                media: grade.media,
                situacao: grade.situacao,
            });
        }),
    });
});
exports.getGrades = getGrades;
const computeSituacao = (media) => {
    if (media >= 6)
        return "Aprovado";
    if (media < 4)
        return "Reprovado";
    return "Em analise";
};
const updateGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nota1, nota2 } = req.body;
    const grade = yield grades_1.Grade.findByPk(Number(id));
    if (!grade) {
        return res.status(404).json({ message: "Registro de nota nao encontrado." });
    }
    const nextNota1 = typeof nota1 === "number" ? nota1 : grade.nota1;
    const nextNota2 = typeof nota2 === "number" ? nota2 : grade.nota2;
    if (!Number.isFinite(nextNota1) || !Number.isFinite(nextNota2)) {
        return res.status(400).json({ message: "nota1 e nota2 devem ser numeros." });
    }
    const media = (nextNota1 + nextNota2) / 2;
    grade.nota1 = nextNota1;
    grade.nota2 = nextNota2;
    grade.media = media;
    grade.situacao = computeSituacao(media);
    yield grade.save();
    return res.json({
        message: "Notas atualizadas com sucesso.",
        nota: {
            id: grade.id,
            nota1: grade.nota1,
            nota2: grade.nota2,
            media: grade.media,
            situacao: grade.situacao,
        },
    });
});
exports.updateGrade = updateGrade;
