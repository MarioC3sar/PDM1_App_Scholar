import { Request, Response } from "express";
import prisma from "../prismaClient";
import { createTeacherAccountSchema } from "../schemas/zodController";
import { createTeacherAccount } from "../services/teacher-account.service";

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const validacao = createTeacherAccountSchema.safeParse(req.body);

    if (!validacao.success) {
      return res.status(400).json({
        message: "Erro na validacao dos dados.",
        detalhes: validacao.error.format(),
      });
    }

    const resultado = await createTeacherAccount(validacao.data);

    return res.status(201).json({
      message: "Professor e usuario de acesso cadastrados com sucesso.",
      professor: resultado.professor,
      email_pessoal: resultado.professor.emailPessoal,
      email_acesso: resultado.usuario.email,
      senha_temporaria: resultado.senhaTemporaria,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    console.error("Erro ao cadastrar professor:", error);
    return res.status(500).json({ message });
  }
};

export const getTeachers = async (_req: Request, res: Response) => {
  try {
    const professores = await prisma.professor.findMany({
      orderBy: { id: "desc" },
      include: {
        usuario: { select: { email: true } },
      },
    });

    const professoresFormatados = professores.map((professor) => ({
      ...professor,
      email: professor.usuario.email,
    }));

    return res.json({
      total: professoresFormatados.length,
      professores: professoresFormatados,
    });
  } catch (error) {
    console.error("Erro ao buscar professores:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};
