import { Request, Response } from "express";
import { Course } from "../models/courses";
import { Grade } from "../models/grades";
import { Student } from "../models/student";

export const getGrades = async (req: Request, res: Response) => {
  const { matricula } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Nao autenticado." });
  }

  // Aluno so pode consultar o proprio boletim.
  if (req.user.perfil === "aluno") {
    const selfStudent = await Student.findOne({ where: { email: req.user.email } });

    if (!selfStudent) {
      return res.status(403).json({
        message:
          "Aluno autenticado nao esta vinculado a uma matricula. Verifique o email cadastrado.",
      });
    }

    if (selfStudent.matricula !== matricula) {
      return res.status(403).json({ message: "Acesso negado ao boletim de outro aluno." });
    }
  }

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

const computeSituacao = (media: number): Grade["situacao"] => {
  if (media >= 6) return "Aprovado";
  if (media < 4) return "Reprovado";
  return "Em analise";
};

export const updateGrade = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nota1, nota2 } = req.body as { nota1?: number; nota2?: number };

  const grade = await Grade.findByPk(Number(id));
  if (!grade) {
    return res.status(404).json({ message: "Registro de nota nao encontrado." });
  }

  const nextNota1 = typeof nota1 === "number" ? nota1 : grade.nota1;
  const nextNota2 = typeof nota2 === "number" ? nota2 : grade.nota2;

  if (!Number.isFinite(nextNota1) || !Number.isFinite(nextNota2)) {
    return res.status(400).json({ message: "nota1 e nota2 devem ser numeros." });
  }

  const media = (nextNota1 + nextNota2) / 2;

  grade.nota1 = nextNota1;
  grade.nota2 = nextNota2;
  grade.media = media;
  grade.situacao = computeSituacao(media);

  await grade.save();

  return res.json({
    message: "Notas atualizadas com sucesso.",
    nota: {
      id: grade.id,
      nota1: grade.nota1,
      nota2: grade.nota2,
      media: grade.media,
      situacao: grade.situacao,
    },
  });
};
