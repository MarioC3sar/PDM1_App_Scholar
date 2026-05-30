import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

// Carrega as variáveis do arquivo .env
dotenv.config();

export default defineConfig({
    datasource: {
        url: process.env.DATABASE_URL,
    },
});