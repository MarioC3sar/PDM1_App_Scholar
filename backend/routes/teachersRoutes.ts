import { Router } from "express";
import { createTeacher, getTeachers } from "../controllers/TeachersControllers";

const router = Router();

router.post("/professores", createTeacher);
router.get("/professores", getTeachers);

export default router;
