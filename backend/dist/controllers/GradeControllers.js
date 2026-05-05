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
exports.getGrades = void 0;
const courses_1 = require("../models/courses");
const grades_1 = require("../models/grades");
const student_1 = require("../models/student");
const getGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { matricula } = req.params;
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
