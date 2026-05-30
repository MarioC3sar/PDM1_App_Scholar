import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        // Ajustado para maiúsculo batendo com o Prisma
        perfil: "ALUNO" | "PROFESSOR" | "ADMIN";
        email?: string;
        nome?: string;
      };
    }
  }
}