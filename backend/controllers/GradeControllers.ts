import { Request, Response } from "express";
import { Course } from "../models/courses";
import { Grade } from "../models/grades";
import { Student } from "../models/student";

export const getGrades = async (req: Request, res: Response) => {
  try {
    const { matricula } = req.params;
    const student = await Student.findOne({ where: { matricula } as any });
    if (!student) {
      return res.status(404).json({ message: "Estudante não encontrado" });
    }

    const grades = await Grade.findAll({
      where: { studentId: student.id },
      include: [{ model: Course, attributes: ["name"] }],
    });

    const formattedGrades = {
      student: student.nome,
      course: grades.map((n: any) => ({
        course: n.course.name,
        grade1: n.grade1,
        grade2: n.grade2,
        media: n.media,
        situation: n.situation,
      })),
    };

    return res.json(formattedGrades);
  } catch (error) {
    console.error("Erro ao obter notas:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};
