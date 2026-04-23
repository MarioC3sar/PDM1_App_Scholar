import { Router } from "express";
import { getGrades } from "../controllers/GradeControllers";

const router = Router();
router.get("/grades/:matricula", getGrades);

export default router;
