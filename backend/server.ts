import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import { bootstrapAdmin } from "./prisma/admin-bootstrap";

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

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const admin = await bootstrapAdmin(adminEmail, adminPassword);
    console.log(`Admin bootstrap concluido: ${admin.email}`);
  } else {
    console.log(
      "ADMIN_EMAIL/ADMIN_PASSWORD nao definidos; bootstrap de admin ignorado.",
    );
  }

  app.listen(PORT, () => {
    console.log(`🚀 Servidor AppScholar iniciado com sucesso na porta ${PORT}.`);
  });
};

startServer().catch((error) => {
  console.error("Falha ao iniciar o servidor:", error);
  process.exit(1);
});
