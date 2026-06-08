import { Perfil, SituacaoNota } from "@prisma/client";
import prisma from "../prismaClient";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

type UpdateStudentGradeInput = {
  nota1?: number;
  nota2?: number;
  faltas?: number;
};

const computeSituacao = (media: number): SituacaoNota => {
  if (media >= 7) return SituacaoNota.APROVADO;
  if (media < 4) return SituacaoNota.REPROVADO;
  return SituacaoNota.CURSANDO;
};

const parseOptionalNumber = (
  value: unknown,
  fieldName: string,
): number | undefined => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new AppError(`Valor inválido para ${fieldName}.`, 400);
  }

  return parsed;
};

const ensureGradeBounds = (grade: number, fieldName: string, min: number, max: number) => {
  if (grade < min || grade > max) {
    throw new AppError(
      `${fieldName} deve estar entre ${min} e ${max}.`,
      400,
    );
  }
};

const ensureFaltas = (faltas: number) => {
  if (!Number.isInteger(faltas) || faltas < 0) {
    throw new AppError("Faltas deve ser um inteiro maior ou igual a zero.", 400);
  }
};

const getProfessorByUserId = async (userId: number) => {
  return prisma.professor.findUnique({
    where: { usuarioId: userId },
    select: { id: true, nome: true },
  });
};

export const getDashboardStats = async () => {
  const [approvedCount, concludedCount, totalGrades] = await Promise.all([
    prisma.nota.count({
      where: { situacao: SituacaoNota.APROVADO },
    }),
    prisma.nota.count({
      where: {
        situacao: {
          in: [SituacaoNota.APROVADO, SituacaoNota.REPROVADO],
        },
      },
    }),
    prisma.nota.count(),
  ]);

  const approvalRate =
    concludedCount > 0 ? (approvedCount / concludedCount) * 100 : 0;

  return {
    approvedCount,
    concludedCount,
    totalGrades,
    approvalRate,
  };
};

export const listProfessorDisciplines = async (userId: number) => {
  const professor = await getProfessorByUserId(userId);

  if (!professor) {
    throw new AppError("Professor não encontrado para o usuário autenticado.", 403);
  }

  const disciplinas = await prisma.disciplina.findMany({
    where: { professorId: professor.id },
    select: {
      id: true,
      nome: true,
      semestre: true,
      cargaHoraria: true,
      curso: { select: { id: true, nome: true } },
      _count: { select: { notas: true } },
    },
    orderBy: [{ semestre: "asc" }, { nome: "asc" }],
  });

  return {
    professor: {
      id: professor.id,
      nome: professor.nome,
    },
    disciplinas: disciplinas.map((disciplina) => ({
      id: disciplina.id,
      nome: disciplina.nome,
      semestre: disciplina.semestre,
      cargaHoraria: disciplina.cargaHoraria,
      curso: disciplina.curso,
      totalAlunos: disciplina._count.notas,
    })),
  };
};

export const getProfessorDisciplineGrades = async (
  userId: number,
  disciplinaId: number,
  perfil: Perfil,
) => {
  const professor =
    perfil === "PROFESSOR" ? await getProfessorByUserId(userId) : null;

  if (perfil === "PROFESSOR" && !professor) {
    throw new AppError("Professor não encontrado para o usuário autenticado.", 403);
  }

  const disciplina = await prisma.disciplina.findFirst({
    where: {
      id: disciplinaId,
      ...(professor ? { professorId: professor.id } : {}),
    },
    include: {
      curso: { select: { id: true, nome: true } },
      notas: {
        include: {
          aluno: {
            select: {
              id: true,
              nome: true,
              matricula: true,
            },
          },
        },
        orderBy: {
          aluno: {
            nome: "asc",
          },
        },
      },
    },
  });

  if (!disciplina) {
    throw new AppError("Disciplina não encontrada ou sem permissão de acesso.", 404);
  }

  return {
    disciplina: {
      id: disciplina.id,
      nome: disciplina.nome,
      semestre: disciplina.semestre,
      curso: disciplina.curso,
    },
    alunos: disciplina.notas.map((nota) => ({
      id: nota.id,
      alunoId: nota.aluno.id,
      aluno: nota.aluno.nome,
      matricula: nota.aluno.matricula,
      nota1: nota.nota1,
      nota2: nota.nota2,
      media: nota.media,
      faltas: nota.faltas,
      situacao: nota.situacao,
    })),
  };
};

export const updateStudentGrade = async (
  userId: number,
  perfil: Perfil,
  notaId: number,
  data: UpdateStudentGradeInput,
) => {
  const grade = await prisma.nota.findUnique({
    where: { id: notaId },
    include: {
      disciplina: {
        select: {
          id: true,
          nome: true,
          professorId: true,
        },
      },
      aluno: {
        select: {
          id: true,
          nome: true,
          matricula: true,
        },
      },
    },
  });

  if (!grade) {
    throw new AppError("Registro de nota não encontrado.", 404);
  }

  if (perfil === "PROFESSOR") {
    const professor = await getProfessorByUserId(userId);

    if (!professor) {
      throw new AppError("Professor não encontrado para o usuário autenticado.", 403);
    }

    if (grade.disciplina.professorId !== professor.id) {
      throw new AppError("Você não tem permissão para editar esta nota.", 403);
    }
  }

  const nextNota1 = parseOptionalNumber(data.nota1, "nota1");
  const nextNota2 = parseOptionalNumber(data.nota2, "nota2");
  const nextFaltas = parseOptionalNumber(data.faltas, "faltas");

  if (nextNota1 !== undefined) {
    ensureGradeBounds(nextNota1, "nota1", 0, 10);
  }

  if (nextNota2 !== undefined) {
    ensureGradeBounds(nextNota2, "nota2", 0, 10);
  }

  if (nextFaltas !== undefined) {
    ensureFaltas(nextFaltas);
  }

  const nota1 = nextNota1 ?? grade.nota1;
  const nota2 = nextNota2 ?? grade.nota2;
  const faltas = nextFaltas ?? grade.faltas;

  const media =
    nota1 !== null && nota2 !== null ? (Number(nota1) + Number(nota2)) / 2 : null;
  const situacao = media === null ? SituacaoNota.CURSANDO : computeSituacao(media);

  const notaAtualizada = await prisma.nota.update({
    where: { id: grade.id },
    data: {
      nota1,
      nota2,
      faltas,
      media,
      situacao,
    },
    include: {
      disciplina: {
        select: {
          id: true,
          nome: true,
        },
      },
      aluno: {
        select: {
          id: true,
          nome: true,
          matricula: true,
        },
      },
    },
  });

  return {
    message: "Notas atualizadas com sucesso.",
    nota: {
      id: notaAtualizada.id,
      alunoId: notaAtualizada.aluno.id,
      aluno: notaAtualizada.aluno.nome,
      matricula: notaAtualizada.aluno.matricula,
      disciplinaId: notaAtualizada.disciplina.id,
      disciplina: notaAtualizada.disciplina.nome,
      nota1: notaAtualizada.nota1,
      nota2: notaAtualizada.nota2,
      media: notaAtualizada.media,
      faltas: notaAtualizada.faltas,
      situacao: notaAtualizada.situacao,
    },
  };
};
