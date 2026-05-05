"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CoursesControllers_1 = require("../controllers/CoursesControllers");
const router = (0, express_1.Router)();
router.post("/disciplinas", CoursesControllers_1.createCourse);
router.get("/disciplinas", CoursesControllers_1.getCourses);
exports.default = router;
