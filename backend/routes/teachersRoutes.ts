import { Router } from "express";
import { createTeacher, getTeachers } from "../controllers/TeachersControllers";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/professores", authenticate, authorize("admin"), createTeacher);
router.get("/professores", authenticate, authorize("admin"), getTeachers);

export default router;
