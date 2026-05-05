import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export const login = async (req: Request, res: Response) => {
  const { login: rawLogin, email, password, senha } = req.body as {
    login?: string;
    email?: string;
    password?: string;
    senha?: string;
  };

  const loginValue = rawLogin ?? email ?? "";
  const passwordValue = password ?? senha ?? "";

  if (!loginValue.trim() || !passwordValue.trim()) {
    return res.status(400).json({
      message: "Login/email e senha sao obrigatorios.",
    });
  }

  const user = await User.findOne({
    where: {
      email: loginValue,
    },
  });

  const userByLogin = user ?? (await User.findOne({ where: { login: loginValue } }));

  if (!userByLogin) {
    return res.status(401).json({ message: "Usuario nao encontrado." });
  }

  const isPasswordValid = await bcrypt.compare(
    passwordValue,
    userByLogin.senhaHash,
  );

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Senha invalida." });
  }

  const token = jwt.sign(
    { id: userByLogin.id, perfil: userByLogin.perfil },
    process.env.JWT_SECRET || "appscholar-secret",
    { expiresIn: "1h" },
  );

  return res.json({
    token,
    usuario: {
      nome: userByLogin.nome,
      perfil: userByLogin.perfil,
      email: userByLogin.email,
    },
  });
};

export const logout = (_req: Request, res: Response) =>
  res.json({ message: "Logout efetuado no cliente." });
