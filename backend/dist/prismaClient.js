"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configura o pool de conexão nativo do PostgreSQL
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
// Cria o adaptador do Prisma
const adapter = new adapter_pg_1.PrismaPg(pool);
// Instancia o PrismaClient com o adaptador (Isso resolve o seu erro!)
const prisma = new client_1.PrismaClient({ adapter });
exports.default = prisma;
