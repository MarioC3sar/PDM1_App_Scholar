import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

type JwtPayload = {
  id: number;
  perfil: "aluno" | "professor" | "admin";
};

const getBearerToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header) return null;

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  return token;
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = getBearerToken(req);
  if (!token) {
    return res.status(401).json({ message: "Token ausente." });
  }

  try {
    const secret = process.env.JWT_SECRET || "appscholar-secret";
    const decoded = jwt.verify(token, secret) as JwtPayload;

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Usuario nao encontrado." });
    }

    req.user = {
      id: user.id,
      perfil: user.perfil,
      email: user.email,
      nome: user.nome,
    };

    return next();
  } catch {
    return res.status(401).json({ message: "Token invalido ou expirado." });
  }
};

export const authorize =
  (...allowed: Array<"aluno" | "professor" | "admin">) =>
  (req: Request, res: Response, next: NextFunction) => {
    const perfil = req.user?.perfil;
    if (!perfil) {
      return res.status(401).json({ message: "Nao autenticado." });
    }

    // Admin sempre tem acesso total
    if (perfil === "admin") {
      return next();
    }

    if (!allowed.includes(perfil)) {
      return res.status(403).json({ message: "Acesso negado." });
    }

    return next();
  };
