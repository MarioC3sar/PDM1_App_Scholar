import * as dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({ path: "backend/.env" });

export const sequelize = new Sequelize(
  process.env.DB_NAME || "Nome do banco de dados",
  process.env.DB_USER || "username",
  process.env.DB_PASSWORD || "password",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    dialect: "postgres",
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  },
);

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error);
    throw error;
  }
};
