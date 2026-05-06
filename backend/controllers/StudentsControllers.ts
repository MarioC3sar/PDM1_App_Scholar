import { Request, Response } from "express";
import { Student } from "../models/student";

const requiredFields = [
  "nome",
  "matricula",
  "curso",
  "email",
  "telefone",
  "cep",
  "logradouro",
  "numero",
  "bairro",
  "cidade",
  "estado",
];

export const createStudent = async (req: Request, res: Response) => {
  const missingFields = requiredFields.filter(
    (field) => !String(req.body[field] ?? "").trim(),
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatorios ausentes.",
      campos: missingFields,
    });
  }

  const existingStudent = await Student.findOne({
    where: { matricula: req.body.matricula },
  });

  if (existingStudent) {
    return res.status(409).json({ message: "Matricula ja cadastrada." });
  }

  const student = await Student.create({
    nome: req.body.nome,
    matricula: req.body.matricula,
    curso: req.body.curso,
    email: req.body.email,
    telefone: req.body.telefone,
    cep: req.body.cep,
    logradouro: req.body.logradouro,
    numero: req.body.numero,
    bairro: req.body.bairro,
    cidade: req.body.cidade,
    estado: req.body.estado,
  });

  return res.status(201).json({
    message: "Aluno cadastrado com sucesso.",
    aluno: student,
  });
};

export const getStudents = async (_req: Request, res: Response) => {
  const alunos = await Student.findAll({ order: [["id", "DESC"]] });
  return res.json({ total: alunos.length, alunos });
};