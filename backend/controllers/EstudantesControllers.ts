import { Request, Response } from "express";
import prisma from "../prismaClient";
import { createStudentAccountSchema } from "../schemas/zodController";
import { createStudentAccount } from "../services/student-account.service";

export const createStudent = async (req: Request, res: Response) => {
  try {
    const validacao = createStudentAccountSchema.safeParse(req.body);

    if (!validacao.success) {
      return res.status(400).json({
        message: "Erro na validacao dos dados.",
        detalhes: validacao.error.format(),
      });
    }

    const resultado = await createStudentAccount(validacao.data);

    return res.status(201).json({
      message: "Aluno cadastrado com sucesso.",
      aluno: resultado.aluno,
      usuario: resultado.usuario,
      senhaTemporaria: resultado.senhaTemporaria,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    console.error("Erro ao cadastrar aluno:", error);
    return res.status(500).json({ message });
  }
};

export const getStudents = async (_req: Request, res: Response) => {
  try {
    const alunos = await prisma.aluno.findMany({
      orderBy: { id: "desc" },
      include: {
        curso: { select: { nome: true } },
        usuario: { select: { email: true, primeiroAcesso: true } },
      },
    });

    const alunosFormatados = alunos.map((aluno) => ({
      ...aluno,

      email: aluno.usuario.email,
      emailInstitucional: aluno.usuario.email,
      primeiroAcesso: aluno.usuario.primeiroAcesso,
      curso: aluno.curso.nome,
      semestre: aluno.semestre,
    }));

    return res.json({
      total: alunosFormatados.length,
      alunos: alunosFormatados,
    });
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};
