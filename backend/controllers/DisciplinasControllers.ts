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

const optionalUpdateFields = [
  "nome",
  "cargaHoraria",
  "professorId",
  "cursoId",
  "semestre",
];

const resolveDisciplinaData = async (req: Request, res: Response) => {
  const missingFields = requiredFields.filter(
    (field) => !req.body[field] || String(req.body[field]).trim() === "",
  );

  if (missingFields.length > 0) {
    res.status(400).json({
      message: "Campos obrigatórios ausentes.",
      campos: missingFields,
    });
    return null;
  }

  const { nome, cargaHoraria, professorId, cursoId, semestre } = req.body;

  const teacher = await prisma.professor.findUnique({
    where: { id: Number(professorId) },
  });

  if (!teacher) {
    res.status(400).json({
      message: "Professor não encontrado. Verifique o ID informado.",
    });
    return null;
  }

  const curso = await prisma.curso.findUnique({
    where: { id: Number(cursoId) },
  });

  if (!curso) {
    res.status(400).json({
      message: "Curso base não encontrado. Verifique o ID informado.",
    });
    return null;
  }

  return {
    nome: String(nome),
    cargaHoraria: Number(cargaHoraria),
    semestre: String(semestre),
    professorId: teacher.id,
    cursoId: curso.id,
  };
};

export const createDisciplina = async (req: Request, res: Response) => {
  try {
    const data = await resolveDisciplinaData(req, res);
    if (!data) {
      return;
    }

    const disciplina = await prisma.disciplina.create({
      data,
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

export const updateDisciplina = async (req: Request, res: Response) => {
  try {
    const disciplinaId = Number(req.params.id);

    if (!Number.isFinite(disciplinaId)) {
      return res.status(400).json({ message: "Disciplina inválida." });
    }

    const providedFields = optionalUpdateFields.filter(
      (field) => req.body[field] !== undefined && String(req.body[field]).trim() !== "",
    );

    if (providedFields.length === 0) {
      return res.status(400).json({
        message: "Envie ao menos um campo para atualizar a disciplina.",
      });
    }

    const existing = await prisma.disciplina.findUnique({
      where: { id: disciplinaId },
      select: { id: true, nome: true, cargaHoraria: true, semestre: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Disciplina não encontrada." });
    }

    const data: {
      nome?: string;
      cargaHoraria?: number;
      semestre?: string;
      professorId?: number;
      cursoId?: number;
    } = {};

    if (req.body.nome !== undefined && String(req.body.nome).trim() !== "") {
      data.nome = String(req.body.nome).trim();
    }

    if (req.body.cargaHoraria !== undefined && String(req.body.cargaHoraria).trim() !== "") {
      const cargaHoraria = Number(req.body.cargaHoraria);

      if (!Number.isFinite(cargaHoraria)) {
        return res.status(400).json({ message: "Carga horária inválida." });
      }

      data.cargaHoraria = cargaHoraria;
    }

    if (req.body.semestre !== undefined && String(req.body.semestre).trim() !== "") {
      data.semestre = String(req.body.semestre).trim();
    }

    if (req.body.professorId !== undefined && String(req.body.professorId).trim() !== "") {
      const professorId = Number(req.body.professorId);

      if (!Number.isFinite(professorId)) {
        return res.status(400).json({ message: "Professor inválido." });
      }

      const teacher = await prisma.professor.findUnique({
        where: { id: professorId },
      });

      if (!teacher) {
        return res.status(400).json({
          message: "Professor não encontrado. Verifique o ID informado.",
        });
      }

      data.professorId = teacher.id;
    }

    if (req.body.cursoId !== undefined && String(req.body.cursoId).trim() !== "") {
      const cursoId = Number(req.body.cursoId);

      if (!Number.isFinite(cursoId)) {
        return res.status(400).json({ message: "Curso inválido." });
      }

      const curso = await prisma.curso.findUnique({
        where: { id: cursoId },
      });

      if (!curso) {
        return res.status(400).json({
          message: "Curso base não encontrado. Verifique o ID informado.",
        });
      }

      data.cursoId = curso.id;
    }

    if (Object.keys(data).length === 0) {
      return;
    }

    const disciplina = await prisma.disciplina.update({
      where: { id: disciplinaId },
      data,
      include: {
        professor: { select: { nome: true } },
        curso: { select: { nome: true } },
      },
    });

    return res.json({
      message: "Disciplina atualizada com sucesso.",
      disciplina,
    });
  } catch (error) {
    console.error("Erro ao atualizar disciplina:", error);
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
