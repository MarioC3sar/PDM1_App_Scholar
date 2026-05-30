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
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// Importa o NOVO arquivo central de rotas que criamos
const routes_1 = __importDefault(require("./routes/routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 3000);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Toda a mágica das rotas (Login, Alunos, etc) agora acontece em uma única linha!
app.use("/api", routes_1.default);
app.get("/", (_req, res) => {
    res.json({
        message: "API Acadêmica AppScholar em execução (Versão Prisma 🚀).",
        endpoints_principais: [
            "POST /api/login",
            "POST /api/alunos",
            "POST /api/professores",
            "POST /api/disciplinas",
            "GET /api/notas/:matricula",
        ],
    });
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    // O Prisma faz a conexão com o banco de forma automática na primeira requisição,
    // então não precisamos mais daquele 'await connectToDatabase()' antigo.
    app.listen(PORT, () => {
        console.log(`🚀 Servidor AppScholar iniciado com sucesso na porta ${PORT}.`);
    });
});
startServer().catch((error) => {
    console.error("Falha ao iniciar o servidor:", error);
    process.exit(1);
});
