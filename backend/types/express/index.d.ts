import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        perfil: "aluno" | "professor" | "admin";
        email: string;
        nome: string;
      };
    }
  }
}

