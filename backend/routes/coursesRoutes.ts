import { Router } from "express";
import { createCourse, getCourses } from "../controllers/CoursesControllers";

const router = Router();

router.post("/disciplinas", createCourse);
router.get("/disciplinas", getCourses);

export default router;
