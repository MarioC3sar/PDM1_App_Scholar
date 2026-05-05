import { Request, Response } from "express";
import { Course } from "../models/courses";
import { Grade } from "../models/grades";
import { Student } from "../models/student";

export const getGrades = async (req: Request, res: Response) => {
  const { matricula } = req.params;

  const student = await Student.findOne({ where: { matricula } });

  if (!student) {
    return res.status(404).json({ message: "Aluno nao encontrado." });
  }

  const studentGrades = await Grade.findAll({
    where: { alunoId: student.id },
    include: [{ model: Course, as: "disciplina", attributes: ["nome"] }],
    order: [["id", "ASC"]],
  });

  return res.json({
    aluno: student.nome,
    matricula: student.matricula,
    disciplinas: studentGrades.map((grade) => ({
      disciplina: grade.disciplina?.nome ?? "Disciplina nao encontrada",
      nota1: grade.nota1,
      nota2: grade.nota2,
      media: grade.media,
      situacao: grade.situacao,
    })),
  });
};
