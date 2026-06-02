import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import prisma from "../prismaClient";
import { createTeacherAccountSchema } from "../schemas/zodController";

const INSTITUTIONAL_EMAIL_DOMAIN =
  process.env.INSTITUTIONAL_EMAIL_DOMAIN ?? "professor.scholar.edu.br";
const TEMPORARY_PASSWORD = process.env.TEMP_TEACHER_PASSWORD ?? "Professor@2026";

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

  const firstName = parts[0] ?? "professor";
  const lastName = parts.length > 1 ? parts[parts.length - 1] : "professor";

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

export type CreateTeacherAccountInput = z.infer<typeof createTeacherAccountSchema>;

export type CreateTeacherAccountResult = {
  usuario: {
    id: number;
    email: string;
    primeiroAcesso: boolean;
  };
  professor: {
    id: number;
    nome: string;
    titulacao: string;
    area: string;
    tempoDocencia: string | null;
    emailPessoal: string | null;
  };
  senhaTemporaria: string;
};

export const createTeacherAccount = async (
  input: CreateTeacherAccountInput,
): Promise<CreateTeacherAccountResult> => {
  const data = createTeacherAccountSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    const email = await buildUniqueInstitutionalEmail(tx, data.nome);
    const senhaHash = await bcrypt.hash(TEMPORARY_PASSWORD, 10);

    const usuario = await tx.usuario.create({
      data: {
        email,
        senhaHash,
        perfil: "PROFESSOR",
        primeiroAcesso: true,
      },
      select: {
        id: true,
        email: true,
        primeiroAcesso: true,
      },
    });

    const professor = await tx.professor.create({
      data: {
        nome: data.nome,
        titulacao: data.titulacao,
        area: data.area,
        tempoDocencia: data.tempoDocencia ?? null,
        emailPessoal: data.email,
        usuarioId: usuario.id,
      },
      select: {
        id: true,
        nome: true,
        titulacao: true,
        area: true,
        tempoDocencia: true,
        emailPessoal: true,
      },
    });

    return {
      usuario,
      professor,
      senhaTemporaria: TEMPORARY_PASSWORD,
    };
  });
};
