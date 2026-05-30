import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

// Configura o pool de conexão nativo do PostgreSQL
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

// Cria o adaptador do Prisma
const adapter = new PrismaPg(pool);

// Instancia o PrismaClient com o adaptador (Isso resolve o seu erro!)
const prisma = new PrismaClient({ adapter });

export default prisma;