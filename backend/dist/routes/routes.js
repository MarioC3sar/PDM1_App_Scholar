"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Importa os Middlewares
const auth_1 = require("../middleware/auth");
// Importa os Controllers
const AuthControllers_1 = require("../controllers/AuthControllers");
const EstudantesControllers_1 = require("../controllers/EstudantesControllers");
const ProfessoresControllers_1 = require("../controllers/ProfessoresControllers");
const DisciplinasControllers_1 = require("../controllers/DisciplinasControllers");
const NotasControllers_1 = require("../controllers/NotasControllers");
const CursosControllers_1 = require("../controllers/CursosControllers");
const router = (0, express_1.Router)();
// ==========================================
// ROTAS PÚBLICAS (Qualquer um pode acessar)
// ==========================================
router.post("/login", AuthControllers_1.login);
router.post("/logout", AuthControllers_1.logout);
router.post("/admins", AuthControllers_1.createAdmin);
// Aplica o middleware de autenticação para TODAS as rotas abaixo desta linha
router.use(auth_1.autenticar);
// ==========================================
// ROTAS DE ADMINISTRAÇÃO (Criação de Dados)
// ==========================================
router.post("/cursos", (0, auth_1.autorizar)(["ADMIN"]), CursosControllers_1.createCurso);
router.post("/alunos", (0, auth_1.autorizar)(["ADMIN"]), EstudantesControllers_1.createStudent);
router.post("/professores", (0, auth_1.autorizar)(["ADMIN"]), ProfessoresControllers_1.createTeacher);
router.post("/disciplinas", (0, auth_1.autorizar)(["ADMIN"]), DisciplinasControllers_1.createDisciplina);
// ==========================================
// ROTAS DE LISTAGEM GERAL (Leitura de Dados)
// ==========================================
router.get("/cursos", (0, auth_1.autorizar)(["ADMIN", "PROFESSOR", "ALUNO"]), CursosControllers_1.getCursos);
router.get("/disciplinas", (0, auth_1.autorizar)(["ADMIN", "PROFESSOR", "ALUNO"]), DisciplinasControllers_1.getDisciplinas);
router.get("/alunos", (0, auth_1.autorizar)(["ADMIN", "PROFESSOR"]), EstudantesControllers_1.getStudents);
router.get("/professores", (0, auth_1.autorizar)(["ADMIN"]), ProfessoresControllers_1.getTeachers);
// ==========================================
// ROTAS ACADÊMICAS (Notas e Faltas)
// ==========================================
// O Aluno acessa o próprio boletim (ou o Admin/Prof para consultar)
router.get("/notas/:matricula", (0, auth_1.autorizar)(["ALUNO", "ADMIN", "PROFESSOR"]), NotasControllers_1.getGrades);
// Apenas Professores (e Admins) podem editar uma nota/falta
router.put("/notas/:id", (0, auth_1.autorizar)(["PROFESSOR", "ADMIN"]), NotasControllers_1.updateGrade);
exports.default = router;
