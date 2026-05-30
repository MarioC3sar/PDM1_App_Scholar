import bcrypt from "bcryptjs";
import { Perfil } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../prismaClient";
import { firstAccessPasswordSchema } from "../schemas/zodController";

dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const { login: rawLogin, email, password } = req.body as {
      login?: string;
      email?: string;
      password?: string;
    };

    const loginValue = rawLogin ?? email ?? "";
    const passwordValue = password ?? "";

    if (!loginValue.trim() || !passwordValue.trim()) {
      return res.status(400).json({
        message: "Login/email e senha sao obrigatorios.",
      });
    }

    const user = await prisma.usuario.findFirst({
      where: {
        OR: [{ email: loginValue }, { aluno: { matricula: loginValue } }],
      },
      include: {
        aluno: true,
        professor: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuario nao encontrado." });
    }

    const isPasswordValid = await bcrypt.compare(passwordValue, user.senhaHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha invalida." });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET nao definido nas variaveis de ambiente!");
    }

    const token = jwt.sign(
      { id: user.id, perfil: user.perfil },
      secret,
      { expiresIn: "1h" },
    );

    const nomeDoUsuario = user.aluno?.nome || user.professor?.nome || "Administrador";

    return res.json({
      token,
      usuario: {
        id: user.id,
        nome: nomeDoUsuario,
        perfil: user.perfil,
        email: user.email,
        primeiroAcesso: user.primeiroAcesso,
        matricula: user.aluno?.matricula,
      },
    });
  } catch (error) {
    console.error("Erro interno na rota de login:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.json({ message: "Logout efetuado no cliente." });
};

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body as {
      email?: string;
      senha?: string;
    };

    if (!email?.trim()) {
      return res.status(400).json({
        message: "O e-mail e obrigatorio.",
      });
    }

    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "E-mail ja esta em uso por outro usuario." });
    }

    const senhaTemporaria = senha?.trim() || email.split("@")[0];
    const senhaHash = await bcrypt.hash(senhaTemporaria, 10);

    const novoUsuario = await prisma.usuario.create({
      data: {
        email,
        senhaHash,
        perfil: Perfil.ADMIN,
        primeiroAcesso: false,
      },
      select: {
        id: true,
        email: true,
        perfil: true,
        primeiroAcesso: true,
      },
    });

    return res.status(201).json({
      message: "Usuario administrador cadastrado com sucesso.",
      usuario: novoUsuario,
      senha_temporaria: senhaTemporaria,
    });
  } catch (error) {
    console.error("Erro ao cadastrar admin:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const completeFirstAccess = async (req: Request, res: Response) => {
  try {
    const validacao = firstAccessPasswordSchema.safeParse(req.body);

    if (!validacao.success) {
      return res.status(400).json({
        message: "Senha invalida.",
        detalhes: validacao.error.format(),
      });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Usuario nao autenticado." });
    }

    if (req.user.perfil === "ADMIN") {
      return res.status(400).json({
        message: "Administradores nao usam troca de senha obrigatoria.",
      });
    }

    const usuarioAtual = await prisma.usuario.findUnique({
      where: { id: req.user.id },
      select: { id: true, primeiroAcesso: true },
    });

    if (!usuarioAtual) {
      return res.status(404).json({ message: "Usuario nao encontrado." });
    }

    if (!usuarioAtual.primeiroAcesso) {
      return res.status(400).json({
        message: "A senha ja foi alterada anteriormente.",
      });
    }

    const senhaHash = await bcrypt.hash(validacao.data.novaSenha, 10);

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: req.user.id },
      data: {
        senhaHash,
        primeiroAcesso: false,
      },
      select: {
        id: true,
        email: true,
        perfil: true,
        primeiroAcesso: true,
      },
    });

    return res.json({
      message: "Senha alterada com sucesso.",
      usuario: usuarioAtualizado,
    });
  } catch (error) {
    console.error("Erro ao concluir primeiro acesso:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};
