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
exports.getCourses = exports.createCourse = void 0;
const courses_1 = require("../models/courses");
const teacher_1 = require("../models/teacher");
const requiredFields = [
    "nome",
    "cargaHoraria",
    "professorResponsavel",
    "curso",
    "semestre",
];
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const missingFields = requiredFields.filter((field) => { var _a; return !String((_a = req.body[field]) !== null && _a !== void 0 ? _a : "").trim(); });
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Campos obrigatorios ausentes.",
            campos: missingFields,
        });
    }
    const teacher = yield teacher_1.Teacher.findOne({
        where: { nome: req.body.professorResponsavel },
    });
    if (!teacher) {
        return res.status(400).json({
            message: "Professor responsavel nao encontrado. Cadastre o professor antes.",
        });
    }
    const course = yield courses_1.Course.create({
        nome: req.body.nome,
        cargaHoraria: Number(req.body.cargaHoraria),
        professorId: teacher.id,
        curso: req.body.curso,
        semestre: String(req.body.semestre),
    });
    return res.status(201).json({
        message: "Disciplina cadastrada com sucesso.",
        disciplina: Object.assign(Object.assign({}, course.toJSON()), { professorResponsavel: teacher.nome }),
    });
});
exports.createCourse = createCourse;
const getCourses = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const disciplinas = yield courses_1.Course.findAll({
        include: [{ model: teacher_1.Teacher, as: "professor", attributes: ["nome"] }],
        order: [["id", "DESC"]],
    });
    return res.json({ total: disciplinas.length, disciplinas });
});
exports.getCourses = getCourses;
