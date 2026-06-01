"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStudentGrade = exports.getProfessorDisciplineGrades = exports.listProfessorDisciplines = exports.AppError = void 0;
const client_1 = require("@prisma/client");
const prismaClient_1 = __importDefault(require("../prismaClient"));
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
const computeSituacao = (media) => {
    if (media >= 7)
        return client_1.SituacaoNota.APROVADO;
    if (media < 4)
        return client_1.SituacaoNota.REPROVADO;
    return client_1.SituacaoNota.CURSANDO;
};
const parseOptionalNumber = (value, fieldName) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        throw new AppError(`Valor inválido para ${fieldName}.`, 400);
    }
    return parsed;
};
const ensureGradeBounds = (grade, fieldName, min, max) => {
    if (grade < min || grade > max) {
        throw new AppError(`${fieldName} deve estar entre ${min} e ${max}.`, 400);
    }
};
const ensureFaltas = (faltas) => {
    if (!Number.isInteger(faltas) || faltas < 0) {
        throw new AppError("Faltas deve ser um inteiro maior ou igual a zero.", 400);
    }
};
const getProfessorByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prismaClient_1.default.professor.findUnique({
        where: { usuarioId: userId },
        select: { id: true, nome: true },
    });
});
const listProfessorDisciplines = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const professor = yield getProfessorByUserId(userId);
    if (!professor) {
        throw new AppError("Professor não encontrado para o usuário autenticado.", 403);
    }
    const disciplinas = yield prismaClient_1.default.disciplina.findMany({
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
});
exports.listProfessorDisciplines = listProfessorDisciplines;
const getProfessorDisciplineGrades = (userId, disciplinaId, perfil) => __awaiter(void 0, void 0, void 0, function* () {
    const professor = perfil === "PROFESSOR" ? yield getProfessorByUserId(userId) : null;
    if (perfil === "PROFESSOR" && !professor) {
        throw new AppError("Professor não encontrado para o usuário autenticado.", 403);
    }
    const disciplina = yield prismaClient_1.default.disciplina.findFirst({
        where: Object.assign({ id: disciplinaId }, (professor ? { professorId: professor.id } : {})),
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
});
exports.getProfessorDisciplineGrades = getProfessorDisciplineGrades;
const updateStudentGrade = (userId, perfil, notaId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const grade = yield prismaClient_1.default.nota.findUnique({
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
        const professor = yield getProfessorByUserId(userId);
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
    const nota1 = nextNota1 !== null && nextNota1 !== void 0 ? nextNota1 : grade.nota1;
    const nota2 = nextNota2 !== null && nextNota2 !== void 0 ? nextNota2 : grade.nota2;
    const faltas = nextFaltas !== null && nextFaltas !== void 0 ? nextFaltas : grade.faltas;
    const media = nota1 !== null && nota2 !== null ? (Number(nota1) + Number(nota2)) / 2 : null;
    const situacao = media === null ? client_1.SituacaoNota.CURSANDO : computeSituacao(media);
    const notaAtualizada = yield prismaClient_1.default.nota.update({
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
});
exports.updateStudentGrade = updateStudentGrade;
