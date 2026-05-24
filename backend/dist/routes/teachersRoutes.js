"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TeachersControllers_1 = require("../controllers/TeachersControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/professores", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("admin"), TeachersControllers_1.createTeacher);
router.get("/professores", authMiddleware_1.authenticate, (0, authMiddleware_1.authorize)("admin"), TeachersControllers_1.getTeachers);
exports.default = router;
