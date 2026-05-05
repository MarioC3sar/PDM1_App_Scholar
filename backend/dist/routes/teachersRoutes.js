"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TeachersControllers_1 = require("../controllers/TeachersControllers");
const router = (0, express_1.Router)();
router.post("/professores", TeachersControllers_1.createTeacher);
router.get("/professores", TeachersControllers_1.getTeachers);
exports.default = router;
