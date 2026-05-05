"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const connection_1 = require("./database/connection");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const coursesRoutes_1 = __importDefault(require("./routes/coursesRoutes"));
const gradeRoutes_1 = __importDefault(require("./routes/gradeRoutes"));
const studentsRoutes_1 = __importDefault(require("./routes/studentsRoutes"));
const teachersRoutes_1 = __importDefault(require("./routes/teachersRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 3000);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api", authRoutes_1.default);
app.use("/api", studentsRoutes_1.default);
app.use("/api", teachersRoutes_1.default);
app.use("/api", coursesRoutes_1.default);
app.use("/api", gradeRoutes_1.default);
app.get("/", (_req, res) => {
    res.json({
        message: "API academica AppScholar em execucao.",
        endpoints: [
            "POST /api/login",
            "POST /api/alunos",
            "POST /api/professores",
            "POST /api/disciplinas",
            "GET /api/boletim/:matricula",
        ],
    });
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, connection_1.connectToDatabase)();
    app.listen(PORT, () => {
        console.log(`Servidor AppScholar iniciado na porta ${PORT}.`);
    });
});
startServer().catch((error) => {
    console.error("Falha ao iniciar o servidor:", error);
    process.exit(1);
});
