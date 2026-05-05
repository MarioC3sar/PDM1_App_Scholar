import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectToDatabase } from "./database/connection";
import authRoutes from "./routes/authRoutes";
import coursesRoutes from "./routes/coursesRoutes";
import gradeRoutes from "./routes/gradeRoutes";
import studentsRoutes from "./routes/studentsRoutes";
import teachersRoutes from "./routes/teachersRoutes";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", studentsRoutes);
app.use("/api", teachersRoutes);
app.use("/api", coursesRoutes);
app.use("/api", gradeRoutes);

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

const startServer = async () => {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor AppScholar iniciado na porta ${PORT}.`);
  });
};

startServer().catch((error) => {
  console.error("Falha ao iniciar o servidor:", error);
  process.exit(1);
});
