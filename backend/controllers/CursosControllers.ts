import { Request, Response } from "express";
import prisma from "../prismaClient";
import { z } from "zod";

// Molde de validação para o Curso
export const cursoSchema = z.object({
    nome: z.string().min(3, "O nome do curso deve ter no mínimo 3 caracteres."),
    descricao: z.string().optional(),
});

export const createCurso = async (req: Request, res: Response) => {
    try {
        const validacao = cursoSchema.safeParse(req.body);

        if (!validacao.success) {
            return res.status(400).json({
                message: "Erro na validação.",
                detalhes: validacao.error.format(),
            });
        }

        const { nome, descricao } = validacao.data;

        const existingCurso = await prisma.curso.findUnique({
            where: { nome },
        });

        if (existingCurso) {
            return res.status(409).json({ message: "Este curso já está cadastrado." });
        }

        const novoCurso = await prisma.curso.create({
            data: { nome, descricao },
        });

        return res.status(201).json({
            message: "Curso cadastrado com sucesso.",
            curso: novoCurso,
        });

    } catch (error) {
        console.error("Erro ao cadastrar curso:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};

export const getCursos = async (_req: Request, res: Response) => {
    try {
        const cursos = await prisma.curso.findMany({
            orderBy: { nome: "asc" },
        });

        return res.json({ total: cursos.length, cursos });
    } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
};