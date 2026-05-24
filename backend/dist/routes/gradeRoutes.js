"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GradeControllers_1 = require("../controllers/GradeControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/boletim/:matricula", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("aluno", "professor"), GradeControllers_1.getGrades);
router.patch("/notas/:id", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("professor"), GradeControllers_1.updateGrade);
exports.default = router;
