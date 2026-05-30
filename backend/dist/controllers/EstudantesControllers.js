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
exports.getStudents = exports.createStudent = void 0;
const zodController_1 = require("../schemas/zodController");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
// Atualizamos 'curso' para 'cursoId'. O 'email' continua aqui pois vamos recebê-lo e salvar no Usuario.
const requiredFields = [
    "nome",
    "matricula",
    "cursoId",
    "email",
    "telefone",
    "cep",
    "logradouro",
    "numero",
    "bairro",
    "cidade",
    "estado",
];
const createStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. O Zod analisa o req.body contra o esquema que criamos
        const validacao = zodController_1.alunoSchema.safeParse(req.body);
        // 2. Se a validação falhar, o Zod já nos diz exatamente onde foi o erro
        if (!validacao.success) {
            return res.status(400).json({
                message: "Erro na validação dos dados.",
                // Formata os erros do Zod de um jeito amigável para o Frontend ler
                detalhes: validacao.error.format(),
            });
        }
        // 3. Se passou, pegamos os dados já validados e perfeitamente tipados!
        const dadosValidados = validacao.data;
        // Verifica se a matrícula já existe
        const existingStudent = yield prismaClient_1.default.aluno.findUnique({
            where: { matricula: dadosValidados.matricula },
        });
        if (existingStudent) {
            return res.status(409).json({ message: "Matrícula já cadastrada." });
        }
        // Verifica se o e-mail já existe
        const existingUser = yield prismaClient_1.default.usuario.findUnique({
            where: { email: dadosValidados.email },
        });
        if (existingUser) {
            return res.status(409).json({ message: "E-mail já está em uso." });
        }
        // Gera o Hash da senha (matricula)
        const senhaHash = yield bcryptjs_1.default.hash(dadosValidados.matricula, 10);
        // Cria o Usuário e o Aluno na mesma transação
        const novoUsuario = yield prismaClient_1.default.usuario.create({
            data: {
                email: dadosValidados.email,
                senhaHash: senhaHash,
                perfil: "ALUNO",
                aluno: {
                    create: {
                        nome: dadosValidados.nome,
                        matricula: dadosValidados.matricula,
                        cursoId: dadosValidados.cursoId,
                        telefone: dadosValidados.telefone,
                        cep: dadosValidados.cep,
                        logradouro: dadosValidados.logradouro,
                        numero: dadosValidados.numero,
                        bairro: dadosValidados.bairro,
                        cidade: dadosValidados.cidade,
                        estado: dadosValidados.estado,
                    }
                }
            },
            include: { aluno: true }
        });
        return res.status(201).json({
            message: "Aluno cadastrado com sucesso.",
            aluno: novoUsuario.aluno,
            email_acesso: novoUsuario.email
        });
    }
    catch (error) {
        console.error("Erro ao cadastrar aluno:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.createStudent = createStudent;
const getStudents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const alunos = yield prismaClient_1.default.aluno.findMany({
            orderBy: { id: "desc" },
            // O include resolve as ligações e traz os dados das outras tabelas
            include: {
                curso: { select: { nome: true } },
                usuario: { select: { email: true } } // Busca o email do aluno lá na tabela usuario
            }
        });
        // Formata o retorno para manter compatibilidade com o seu App (App Scholar)
        const alunosFormatados = alunos.map(aluno => (Object.assign(Object.assign({}, aluno), { email: aluno.usuario.email, curso: aluno.curso.nome // Exibe o texto "Engenharia" em vez do ID "1"
         })));
        return res.json({ total: alunosFormatados.length, alunos: alunosFormatados });
    }
    catch (error) {
        console.error("Erro ao buscar alunos:", error);
        return res.status(500).json({ message: "Erro interno do servidor." });
    }
});
exports.getStudents = getStudents;
