"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CoursesControllers_1 = require("../controllers/CoursesControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/disciplinas", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("admin"), CoursesControllers_1.createCourse);
router.get("/disciplinas", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("admin"), CoursesControllers_1.getCourses);
exports.default = router;
