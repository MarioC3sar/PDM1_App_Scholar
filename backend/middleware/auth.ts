import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const autenticar = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token não fornecido ou inválido." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET não configurado.");

        // O TS agora aceita o req.user naturalmente graças ao seu arquivo global!
        const decoded = jwt.verify(token, secret) as any;

        req.user = {
            id: decoded.id,
            perfil: decoded.perfil
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "Sessão expirada ou token inválido." });
    }
};

export const autorizar = (perfisPermitidos: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (!req.user) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }

        if (!perfisPermitidos.includes(req.user.perfil)) {
            return res.status(403).json({
                message: "Acesso negado. Você não tem permissão para realizar esta ação."
            });
        }

        next();
    };
};