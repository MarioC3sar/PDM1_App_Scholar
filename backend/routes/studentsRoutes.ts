import { Router } from "express";
import { createStudent, getStudents } from "../controllers/StudentsControllers";

const router = Router();

router.post("/alunos", createStudent);
router.get("/alunos", getStudents);

export default router;
