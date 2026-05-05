"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GradeControllers_1 = require("../controllers/GradeControllers");
const router = (0, express_1.Router)();
router.get("/boletim/:matricula", GradeControllers_1.getGrades);
exports.default = router;
