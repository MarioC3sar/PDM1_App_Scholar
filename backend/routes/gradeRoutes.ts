import { Router } from "express";
import { getGrades, updateGrade } from "../controllers/GradeControllers";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.get("/boletim/:matricula", authenticate, authorize("aluno", "professor"), getGrades);
router.patch("/notas/:id", authenticate, authorize("professor"), updateGrade);

export default router;
