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
exports.updateGrade = exports.getGrades = void 0;
const client_1 = require("@prisma/client");
const prismaClient_1 = __importDefault(require("../prismaClient"));
// Atualizado para bater com o Enum SituacaoNota do esquema Prisma
const computeSituacao = (media) => {
    if (media >= 6)
        return client_1.SituacaoNota.APROVADO;
    if (media < 4)
        return client_1.SituacaoNota.REPROVADO;
    // Se a média estiver entre 4 e 5.9, ele não está aprovado nem reprovado direto (Exame/Análise).
    // Como no nosso schema usamos CURSANDO, APROVADO e REPROVADO, mantemos como CURSANDO ou podes
    // adicionar um status "EXAME" no seu schema.prisma futuramente se a faculdade tiver essa regra.
    return client_1.SituacaoNota.CURSANDO;
};
const getGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { matricula } = req.params;
        // Assumindo que o middleware de autenticação popula req.user
        if (!req.user) {
            return res.status(401).json({ message: "Não autenticado." });
        }
        // 1. REGRA DE SEGURANÇA: Aluno só pode consultar o próprio boletim.
        if (req.user.perfil === "ALUNO") {
            // Como o Prisma vinculou o id do Usuário direto ao Aluno, a busca é instantânea
            const selfStudent = yield prismaClient_1.default.aluno.findUnique({
                where: { usuarioId: req.user.id }
            });
            if (!selfStudent) {
                return res.status(403).json({
                    message: "Usuário autenticado não está vinculado a um aluno no sistema.",
                });
            }
            if (selfStudent.matricula !== matricula) {
                return res.status(403).json({ message: "Acesso negado. Você só pode visualizar o seu boletim." });
            }
        }
        // 2. BUSCA DO BOLETIM E RELAÇÕES (Fim dos joins complexos!)
        const student = yield prismaClient_1.default.aluno.findUnique({
            where: { matricula: String(matricula) },
            include: {
                notas: {
                    include: {
                        disciplina: { select: { nome: true } }
                    },
                    orderBy: { id: "asc" }
                }
            }
        });
        if (!student) {
            return res.status(404).json({ message: "Aluno não encontrado." });
        }
        // 3. RETORNO DOS DADOS
        return res.json({
            aluno: student.nome,
            matricula: student.matricula,
            disciplinas: student.notas.map((nota) => ({
                id: nota.id, // O ID da nota é útil se o professor for editar na tela do frontend
                disciplina: nota.disciplina.nome,
                nota1: nota.nota1,
                nota2: nota.nota2,
                media: nota.media,
                faltas: nota.faltas, // <-- Novo campo do banco de dados!
                situacao: nota.situacao,
            })),
        });
    }
    catch (error) {
        console.error("Erro ao buscar notas:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.getGrades = getGrades;
const updateGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Agora o professor também pode mandar as faltas no corpo da requisição
        const { nota1, nota2, faltas } = req.body;
        // Busca a nota atual no banco
        const grade = yield prismaClient_1.default.nota.findUnique({
            where: { id: Number(id) }
        });
        if (!grade) {
            return res.status(404).json({ message: "Registro de nota não encontrado." });
        }
        // Mantém o valor que já estava no banco caso o professor envie apenas 1 nota
        const nextNota1 = nota1 !== undefined ? Number(nota1) : grade.nota1;
        const nextNota2 = nota2 !== undefined ? Number(nota2) : grade.nota2;
        const nextFaltas = faltas !== undefined ? Number(faltas) : grade.faltas;
        let media = grade.media;
        let situacao = grade.situacao;
        // Só calcula a média se o aluno já tiver as duas notas lançadas
        if (nextNota1 !== null && nextNota2 !== null) {
            media = (nextNota1 + nextNota2) / 2;
            situacao = computeSituacao(media);
        }
        // Atualiza tudo no banco de uma vez só
        const notaAtualizada = yield prismaClient_1.default.nota.update({
            where: { id: Number(id) },
            data: {
                nota1: nextNota1,
                nota2: nextNota2,
                faltas: nextFaltas, // Atualiza as faltas
                media: media,
                situacao: situacao,
            }
        });
        return res.json({
            message: "Notas atualizadas com sucesso.",
            nota: notaAtualizada,
        });
    }
    catch (error) {
        console.error("Erro ao atualizar notas:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.updateGrade = updateGrade;
