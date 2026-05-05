import { Request, Response } from "express";
import { Teacher } from "../models/teacher";

const requiredFields = ["nome", "titulacao", "area", "tempoDocencia", "email"];

export const createTeacher = async (req: Request, res: Response) => {
  const missingFields = requiredFields.filter(
    (field) => !String(req.body[field] ?? "").trim(),
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatorios ausentes.",
      campos: missingFields,
    });
  }

  const teacher = await Teacher.create({
    nome: req.body.nome,
    titulacao: req.body.titulacao,
    area: req.body.area,
    tempoDocencia: req.body.tempoDocencia,
    email: req.body.email,
  });

  return res.status(201).json({
    message: "Professor cadastrado com sucesso.",
    professor: teacher,
  });
};

export const getTeachers = async (_req: Request, res: Response) => {
  const professores = await Teacher.findAll({ order: [["id", "DESC"]] });
  return res.json({ total: professores.length, professores });
};
