import { Router } from "express";

import {
    createStudent,
    deleteStudent,
    getStudentById,
    getStudents,
} from "../controllers/StudentsControllers";
import * as StudentsControllers from "../controllers/StudentsControllers";

const updateStudent =
    (StudentsControllers as any).updateStudent ??
    (StudentsControllers as any).updateStudents;

const router = Router();
router.post("/students", createStudent);
router.get("/students", getStudents);
router.get("/students/:id", getStudentById);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

export default router;
