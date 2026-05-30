import dotenv from "dotenv";
import cors from "cors";
import express from "express";

// Importa o NOVO arquivo central de rotas que criamos
import routes from "./routes/routes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

// Toda a mágica das rotas (Login, Alunos, etc) agora acontece em uma única linha!
app.use("/api", routes);

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

const startServer = async () => {
  // O Prisma faz a conexão com o banco de forma automática na primeira requisição,
  // então não precisamos mais daquele 'await connectToDatabase()' antigo.

  app.listen(PORT, () => {
    console.log(`🚀 Servidor AppScholar iniciado com sucesso na porta ${PORT}.`);
  });
};

startServer().catch((error) => {
  console.error("Falha ao iniciar o servidor:", error);
  process.exit(1);
});