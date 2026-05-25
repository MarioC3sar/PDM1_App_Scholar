import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import dotenv from "dotenv";

// Garante que as variáveis do .env sejam carregadas (útil se não tiver feito isso no index principal)
dotenv.config();

export const login = async (req: Request, res: Response) => {
  try {
    const { login: rawLogin, email, password } = req.body as {
      login?: string;
      email?: string;
      password?: string;
    };

    // Pega o que vier na requisição (seja no campo 'login' ou no 'email')
    const loginValue = rawLogin ?? email ?? "";
    const passwordValue = password ?? "";

    if (!loginValue.trim() || !passwordValue.trim()) {
      return res.status(400).json({
        message: "Login/email e senha são obrigatórios.",
      });
    }

    // Tenta buscar o usuário pelo email
    const user = await User.findOne({
      where: {
        email: loginValue,
      },
    });

    // Se não achar por email, tenta buscar pelo campo login (resolve o problema do "mario.alves")
    const userByLogin = user ?? (await User.findOne({ where: { login: loginValue } }));

    if (!userByLogin) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    // Compara a senha digitada com o hash salvo no banco
    const isPasswordValid = await bcrypt.compare(
        passwordValue,
        userByLogin.senhaHash,
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha inválida." });
    }

    // ------------------------------------------------------------------
    // CORREÇÃO AQUI: Validação do secret antes de gerar o Token
    // ------------------------------------------------------------------
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não definido nas variáveis de ambiente!");
    }

    const token = jwt.sign(
        { id: userByLogin.id, perfil: userByLogin.perfil },
        secret,
        { expiresIn: "1h" },
    );

    // Retorna os dados para o App Scholar
    return res.json({
      token,
      usuario: {
        id: userByLogin.id,
        nome: userByLogin.nome,
        perfil: userByLogin.perfil,
        email: userByLogin.email,
      },
    });

  } catch (error) {
    console.error("Erro interno na rota de login:", error);
    // Retorna status 500 para o frontend em vez de derrubar a API inteira
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const logout = (_req: Request, res: Response) => {
  res.json({ message: "Logout efetuado no cliente." });
};