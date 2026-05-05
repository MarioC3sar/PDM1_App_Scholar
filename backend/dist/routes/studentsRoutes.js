"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const StudentsControllers_1 = require("../controllers/StudentsControllers");
const router = (0, express_1.Router)();
router.post("/alunos", StudentsControllers_1.createStudent);
router.get("/alunos", StudentsControllers_1.getStudents);
exports.default = router;
