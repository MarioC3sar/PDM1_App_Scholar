import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import prisma from "../prismaClient";
import { createStudentAccountSchema } from "../schemas/zodController";

const INSTITUTIONAL_EMAIL_DOMAIN =
  process.env.INSTITUTIONAL_EMAIL_DOMAIN ?? "instituicao.edu.br";
const TEMPORARY_PASSWORD = process.env.TEMP_STUDENT_PASSWORD ?? "Aluno@2026";

const removeAccents = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const sanitizeNamePart = (value: string) =>
  removeAccents(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const buildEmailBase = (nome: string) => {
  const parts = nome
    .trim()
    .split(/\s+/)
    .map(sanitizeNamePart)
    .filter(Boolean);

  const firstName = parts[0] ?? "aluno";
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "aluno";

  return `${firstName}.${lastName}`;
};

const buildUniqueInstitutionalEmail = async (
  tx: Prisma.TransactionClient,
  nome: string,
) => {
  const baseEmail = buildEmailBase(nome);
  let counter = 0;

  while (true) {
    const candidate = `${baseEmail}${counter > 0 ? counter : ""}@${INSTITUTIONAL_EMAIL_DOMAIN}`.toLowerCase();

    const existing = await tx.usuario.findUnique({
      where: { email: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    counter += 1;
  }
};

export type CreateStudentAccountInput = z.infer<typeof createStudentAccountSchema>;

export type CreateStudentAccountResult = {
  usuario: {
    id: number;
    email: string;
    primeiroAcesso: boolean;
  };
  aluno: {
    id: number;
    nome: string;
    matricula: string;
    telefone: string | null;
    cep: string | null;
    logradouro: string | null;
    numero: string | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
    cursoId: number;
  };
  senhaTemporaria: string;
};

export const createStudentAccount = async (
  input: CreateStudentAccountInput,
): Promise<CreateStudentAccountResult> => {
  const data = createStudentAccountSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    const email = await buildUniqueInstitutionalEmail(tx, data.nome);
    const senhaHash = await bcrypt.hash(TEMPORARY_PASSWORD, 10);

    const usuario = await tx.usuario.create({
      data: {
        email,
        senhaHash,
        perfil: "ALUNO",
        primeiroAcesso: true,
      },
      select: {
        id: true,
        email: true,
        primeiroAcesso: true,
      },
    });

    const aluno = await tx.aluno.create({
      data: {
        nome: data.nome,
        matricula: data.matricula,
        cursoId: data.cursoId,
        usuarioId: usuario.id,
        telefone: data.telefone ?? null,
        cep: data.cep ?? null,
        logradouro: data.logradouro ?? null,
        numero: data.numero ?? null,
        bairro: data.bairro ?? null,
        cidade: data.cidade ?? null,
        estado: data.estado ?? null,
      },
      select: {
        id: true,
        nome: true,
        matricula: true,
        telefone: true,
        cep: true,
        logradouro: true,
        numero: true,
        bairro: true,
        cidade: true,
        estado: true,
        cursoId: true,
      },
    });

    return {
      usuario,
      aluno,
      senhaTemporaria: TEMPORARY_PASSWORD,
    };
  });
};
