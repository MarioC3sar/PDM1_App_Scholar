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
exports.getStudents = exports.createStudent = void 0;
const student_1 = require("../models/student");
const requiredFields = [
    "nome",
    "matricula",
    "curso",
    "email",
    "telefone",
    "cep",
    "endereco",
    "cidade",
    "estado",
];
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const missingFields = requiredFields.filter((field) => { var _a; return !String((_a = req.body[field]) !== null && _a !== void 0 ? _a : "").trim(); });
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Campos obrigatorios ausentes.",
            campos: missingFields,
        });
    }
    const existingStudent = yield student_1.Student.findOne({
        where: { matricula: req.body.matricula },
    });
    if (existingStudent) {
        return res.status(409).json({ message: "Matricula ja cadastrada." });
    }
    const student = yield student_1.Student.create({
        nome: req.body.nome,
        matricula: req.body.matricula,
        curso: req.body.curso,
        email: req.body.email,
        telefone: req.body.telefone,
        cep: req.body.cep,
        endereco: req.body.endereco,
        cidade: req.body.cidade,
        estado: req.body.estado,
    });
    return res.status(201).json({
        message: "Aluno cadastrado com sucesso.",
        aluno: student,
    });
});
exports.createStudent = createStudent;
const getStudents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const alunos = yield student_1.Student.findAll({ order: [["id", "DESC"]] });
    return res.json({ total: alunos.length, alunos });
});
exports.getStudents = getStudents;
