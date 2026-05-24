import { Router } from "express";
import { createStudent, getStudents } from "../controllers/StudentsControllers";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/alunos", authenticate, authorize("admin"), createStudent);
router.get("/alunos", authenticate, authorize("admin"), getStudents);

export default router;
