import { Router } from "express";
import { autenticar, autorizar } from "../middleware/auth";
import { completeFirstAccess, createAdmin, login, logout } from "../controllers/AuthControllers";
import { createStudent, getStudents } from "../controllers/EstudantesControllers";
import { createTeacher, getTeachers } from "../controllers/ProfessoresControllers";
import { createDisciplina, getDisciplinas, updateDisciplina } from "../controllers/DisciplinasControllers";
import {
  getDashboardStatsController,
  getGrades,
  getMyGrades,
  getProfessorDisciplines,
  getProfessorDisciplineStudents,
  updateGrade,
} from "../controllers/NotasControllers";
import { createCurso, getCursos } from "../controllers/CursosControllers";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/admins", createAdmin);

router.use(autenticar);

router.put("/auth/first-access", completeFirstAccess);

router.post("/cursos", autorizar(["ADMIN"]), createCurso);
router.post("/alunos", autorizar(["ADMIN"]), createStudent);
router.post("/professores", autorizar(["ADMIN"]), createTeacher);
router.post("/disciplinas", autorizar(["ADMIN"]), createDisciplina);
router.put("/disciplinas/:id", autorizar(["ADMIN"]), updateDisciplina);

router.get("/cursos", autorizar(["ADMIN", "PROFESSOR", "ALUNO"]), getCursos);
router.get("/disciplinas", autorizar(["ADMIN", "PROFESSOR", "ALUNO"]), getDisciplinas);
router.get("/alunos", autorizar(["ADMIN", "PROFESSOR"]), getStudents);
router.get("/professores", autorizar(["ADMIN"]), getTeachers);
router.get("/dashboard/stats", autorizar(["ADMIN"]), getDashboardStatsController);

router.get("/notas/me", autorizar(["ALUNO"]), getMyGrades);
router.get("/notas/:matricula", autorizar(["ALUNO", "ADMIN", "PROFESSOR"]), getGrades);
router.get("/professores/me/disciplinas", autorizar(["PROFESSOR"]), getProfessorDisciplines);
router.get(
  "/professores/me/disciplinas/:disciplinaId/notas",
  autorizar(["PROFESSOR", "ADMIN"]),
  getProfessorDisciplineStudents,
);
router.put("/notas/:id", autorizar(["PROFESSOR", "ADMIN"]), updateGrade);

export default router;
