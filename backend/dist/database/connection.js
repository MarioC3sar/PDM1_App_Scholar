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
exports.connectToDatabase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const _1 = require(".");
const courses_1 = require("../models/courses");
const grades_1 = require("../models/grades");
const student_1 = require("../models/student");
const teacher_1 = require("../models/teacher");
const user_1 = require("../models/user");
let initialized = false;
const setupAssociations = () => {
    student_1.Student.hasMany(grades_1.Grade, { foreignKey: "alunoId", as: "notas" });
    grades_1.Grade.belongsTo(student_1.Student, { foreignKey: "alunoId", as: "aluno" });
    teacher_1.Teacher.hasMany(courses_1.Course, { foreignKey: "professorId", as: "disciplinas" });
    courses_1.Course.belongsTo(teacher_1.Teacher, { foreignKey: "professorId", as: "professor" });
    courses_1.Course.hasMany(grades_1.Grade, { foreignKey: "disciplinaId", as: "notas" });
    grades_1.Grade.belongsTo(courses_1.Course, { foreignKey: "disciplinaId", as: "disciplina" });
};
const seedAdminUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@appscholar.edu";
    const adminPassword = process.env.ADMIN_PASSWORD || "123456";
    const existingAdmin = yield user_1.User.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
        return;
    }
    yield user_1.User.create({
        login: adminEmail,
        email: adminEmail,
        senhaHash: yield bcryptjs_1.default.hash(adminPassword, 10),
        nome: "Administrador",
        perfil: "admin",
    });
});
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!initialized) {
        setupAssociations();
        initialized = true;
    }
    yield _1.sequelize.authenticate();
    yield _1.sequelize.sync();
    yield seedAdminUser();
    console.log("Conexao com PostgreSQL estabelecida e tabelas sincronizadas.");
});
exports.connectToDatabase = connectToDatabase;
