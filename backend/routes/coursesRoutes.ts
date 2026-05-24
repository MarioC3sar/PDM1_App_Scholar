import { Router } from "express";
import { createCourse, getCourses } from "../controllers/CoursesControllers";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

router.post("/disciplinas", authenticate, authorize("admin"), createCourse);
router.get("/disciplinas", authenticate, authorize("admin"), getCourses);

export default router;
