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
exports.getTeachers = exports.createTeacher = void 0;
const teacher_1 = require("../models/teacher");
const requiredFields = ["nome", "titulacao", "area", "tempoDocencia", "email"];
const createTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const missingFields = requiredFields.filter((field) => { var _a; return !String((_a = req.body[field]) !== null && _a !== void 0 ? _a : "").trim(); });
    if (missingFields.length > 0) {
        return res.status(400).json({
            message: "Campos obrigatorios ausentes.",
            campos: missingFields,
        });
    }
    const teacher = yield teacher_1.Teacher.create({
        nome: req.body.nome,
        titulacao: req.body.titulacao,
        area: req.body.area,
        tempoDocencia: req.body.tempoDocencia,
        email: req.body.email,
    });
    return res.status(201).json({
        message: "Professor cadastrado com sucesso.",
        professor: teacher,
    });
});
exports.createTeacher = createTeacher;
const getTeachers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const professores = yield teacher_1.Teacher.findAll({ order: [["id", "DESC"]] });
    return res.json({ total: professores.length, professores });
});
exports.getTeachers = getTeachers;
