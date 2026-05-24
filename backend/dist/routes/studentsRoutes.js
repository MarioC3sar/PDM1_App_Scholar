"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StudentsControllers_1 = require("../controllers/StudentsControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/alunos", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("admin"), StudentsControllers_1.createStudent);
router.get("/alunos", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("admin"), StudentsControllers_1.getStudents);
exports.default = router;
