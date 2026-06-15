import { Request, Response } from "express";
import prisma from "../prismaClient";
import { z } from "zod";

const createAvisoSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório."),
  mensagem: z.string().min(1, "A mensagem é obrigatória."),
  perfil_alvo: z.enum(["todos", "ALUNO", "PROFESSOR"]).default("todos"),
});

export const createAviso = async (req: Request, res: Response) => {
  try {
    const validacao = createAvisoSchema.safeParse(req.body);

    if (!validacao.success) {
      return res.status(400).json({
        message: "Erro na validação dos dados.",
        detalhes: validacao.error.format(),
      });
    }

    const { titulo, mensagem, perfil_alvo } = validacao.data;

    const aviso = await prisma.aviso.create({
      data: {
        titulo,
        mensagem,
        perfil_alvo,
      },
    });

    return res.status(201).json({
      message: "Aviso cadastrado com sucesso.",
      aviso,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno do servidor.";
    console.error("Erro ao cadastrar aviso:", error);
    return res.status(500).json({ message });
  }
};

export const getAvisos = async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = (req as any).user;
    let whereClause = {};

    if (user.perfil === "ALUNO") {
      whereClause = {
        perfil_alvo: {
          in: ["todos", "ALUNO"],
        },
      };
    } else if (user.perfil === "PROFESSOR") {
      whereClause = {
        perfil_alvo: {
          in: ["todos", "PROFESSOR"],
        },
      };
    }

    const avisos = await prisma.aviso.findMany({
      where: whereClause,
      orderBy: { data_criacao: "desc" },
    });

    return res.json(avisos);
  } catch (error) {
    console.error("Erro ao buscar avisos:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};
