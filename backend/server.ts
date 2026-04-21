import { connectToDatabase } from "./database/connection";

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log("Servidor iniciado e conectado ao banco de dados.");
  } catch {
    console.error("Falha ao iniciar o servidor por erro de conexão com banco.");
    process.exit(1);
  }
};

startServer();
