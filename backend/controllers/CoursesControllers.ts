import { Request, Response } from "express";
import { Course } from "../models/courses";
import { Teacher } from "../models/teacher";

const requiredFields = [
  "nome",
  "cargaHoraria",
  "professorResponsavel",
  "curso",
  "semestre",
];

export const createCourse = async (req: Request, res: Response) => {
  const missingFields = requiredFields.filter(
    (field) => !String(req.body[field] ?? "").trim(),
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Campos obrigatorios ausentes.",
      campos: missingFields,
    });
  }

  const teacher = await Teacher.findOne({
    where: { nome: req.body.professorResponsavel },
  });

  if (!teacher) {
    return res.status(400).json({
      message: "Professor responsavel nao encontrado. Cadastre o professor antes.",
    });
  }

  const course = await Course.create({
    nome: req.body.nome,
    cargaHoraria: Number(req.body.cargaHoraria),
    professorId: teacher.id,
    curso: req.body.curso,
    semestre: String(req.body.semestre),
  });

  return res.status(201).json({
    message: "Disciplina cadastrada com sucesso.",
    disciplina: {
      ...course.toJSON(),
      professorResponsavel: teacher.nome,
    },
  });
};

export const getCourses = async (_req: Request, res: Response) => {
  const disciplinas = await Course.findAll({
    include: [{ model: Teacher, as: "professor", attributes: ["nome"] }],
    order: [["id", "DESC"]],
  });

  return res.json({ total: disciplinas.length, disciplinas });
};
