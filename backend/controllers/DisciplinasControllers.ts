import { Request, Response } from "express";
import prisma from "../prismaClient";



// Agora exigimos os IDs exatos, evitando erros de digitação e homônimos
const requiredFields = [
  "nome",
  "cargaHoraria",
  "professorId",
  "cursoId",
  "semestre",
];

export const createDisciplina = async (req: Request, res: Response) => {
  try {
    const missingFields = requiredFields.filter(
        (field) => !req.body[field] || String(req.body[field]).trim() === ""
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Campos obrigatórios ausentes.",
        campos: missingFields,
      });
    }

    const { nome, cargaHoraria, professorId, cursoId, semestre } = req.body;

    // 1. Verifica se o Professor existe
    const teacher = await prisma.professor.findUnique({
      where: { id: Number(professorId) },
    });

    if (!teacher) {
      return res.status(400).json({
        message: "Professor não encontrado. Verifique o ID informado.",
      });
    }

    // 2. Verifica se o Curso existe
    const curso = await prisma.curso.findUnique({
      where: { id: Number(cursoId) },
    });

    if (!curso) {
      return res.status(400).json({
        message: "Curso base não encontrado. Verifique o ID informado.",
      });
    }

    // 3. Cria a disciplina e já vincula os IDs
    const disciplina = await prisma.disciplina.create({
      data: {
        nome: String(nome),
        cargaHoraria: Number(cargaHoraria),
        semestre: String(semestre),
        professorId: teacher.id,
        cursoId: curso.id,
      },
      // Pede pro Prisma devolver a disciplina recém-criada JÁ com os dados do professor e curso
      include: {
        professor: { select: { nome: true } },
        curso: { select: { nome: true } }
      }
    });

    return res.status(201).json({
      message: "Disciplina cadastrada com sucesso.",
      disciplina,
    });

  } catch (error) {
    console.error("Erro ao criar disciplina:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const getDisciplinas = async (_req: Request, res: Response) => {
  try {
    const disciplinas = await prisma.disciplina.findMany({
      // include substitui os "joins" complexos do Sequelize de forma elegante
      include: {
        professor: {
          select: { nome: true }, // Traz apenas o nome para não vazar dados sensíveis
        },
        curso: {
          select: { nome: true },
        }
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json({ total: disciplinas.length, disciplinas });
  } catch (error) {
    console.error("Erro ao buscar disciplinas:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};