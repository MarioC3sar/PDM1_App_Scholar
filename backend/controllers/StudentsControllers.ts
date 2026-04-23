import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      },
    );

    res.json({ token });
  } catch (error) {
    console.error("Erro durante o login:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

export const logout = (req: Request, res: Response) => {
  // Para logout, basta remover o token do lado do cliente
  res.json({ message: "Logout bem-sucedido" });
};

const createStudent = (req: Request, res: Response) => {
  res.json({ message: "Criar estudante" });
};

const getStudents = (req: Request, res: Response) => {
  res.json({ message: "Listar estudantes" });
};

const getStudentById = (req: Request, res: Response) => {
  res.json({ message: "Obter estudante por ID" });
};

const updateStudent = (req: Request, res: Response) => {
  res.json({ message: "Atualizar estudante" });
};

const deleteStudent = (req: Request, res: Response) => {
  res.json({ message: "Excluir estudante" });
};

export {
    createStudent, deleteStudent, getStudentById, getStudents, updateStudent
};

