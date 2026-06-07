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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentAccount = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const zodController_1 = require("../schemas/zodController");
const INSTITUTIONAL_EMAIL_DOMAIN = (_a = process.env.INSTITUTIONAL_EMAIL_DOMAIN) !== null && _a !== void 0 ? _a : "aluno.scholar.edu.br";
const TEMPORARY_PASSWORD = (_b = process.env.TEMP_STUDENT_PASSWORD) !== null && _b !== void 0 ? _b : "Aluno@2026";
const removeAccents = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const sanitizeNamePart = (value) => removeAccents(value)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
const buildEmailBase = (nome) => {
    var _a;
    const parts = nome
        .trim()
        .split(/\s+/)
        .map(sanitizeNamePart)
        .filter(Boolean);
    const firstName = (_a = parts[0]) !== null && _a !== void 0 ? _a : "aluno";
    const lastName = parts.length > 1 ? parts[parts.length - 1] : "aluno";
    return `${firstName}.${lastName}`;
};
const buildUniqueInstitutionalEmail = (tx, nome) => __awaiter(void 0, void 0, void 0, function* () {
    const baseEmail = buildEmailBase(nome);
    let counter = 0;
    while (true) {
        const candidate = `${baseEmail}${counter > 0 ? counter : ""}@${INSTITUTIONAL_EMAIL_DOMAIN}`.toLowerCase();
        const existing = yield tx.usuario.findUnique({
            where: { email: candidate },
            select: { id: true },
        });
        if (!existing) {
            return candidate;
        }
        counter += 1;
    }
});
const createStudentAccount = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const data = zodController_1.createStudentAccountSchema.parse(input);
    return prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        const email = yield buildUniqueInstitutionalEmail(tx, data.nome);
        const senhaHash = yield bcryptjs_1.default.hash(TEMPORARY_PASSWORD, 10);
        const usuario = yield tx.usuario.create({
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
        const aluno = yield tx.aluno.create({
            data: {
                nome: data.nome,
                matricula: data.matricula,
                semestre: data.semestre,
                emailPessoal: data.email,
                cursoId: data.cursoId,
                usuarioId: usuario.id,
                telefone: (_a = data.telefone) !== null && _a !== void 0 ? _a : null,
                cep: (_b = data.cep) !== null && _b !== void 0 ? _b : null,
                logradouro: (_c = data.logradouro) !== null && _c !== void 0 ? _c : null,
                numero: (_d = data.numero) !== null && _d !== void 0 ? _d : null,
                bairro: (_e = data.bairro) !== null && _e !== void 0 ? _e : null,
                cidade: (_f = data.cidade) !== null && _f !== void 0 ? _f : null,
                estado: (_g = data.estado) !== null && _g !== void 0 ? _g : null,
            },
            select: {
                id: true,
                nome: true,
                matricula: true,
                semestre: true,
                emailPessoal: true,
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
        const disciplinasDoSemestre = yield tx.disciplina.findMany({
            where: {
                cursoId: data.cursoId,
                semestre: data.semestre,
            },
            select: { id: true },
        });
        if (disciplinasDoSemestre.length > 0) {
            yield tx.nota.createMany({
                data: disciplinasDoSemestre.map((disciplina) => ({
                    alunoId: aluno.id,
                    disciplinaId: disciplina.id,
                })),
                skipDuplicates: true,
            });
        }
        return {
            usuario,
            aluno,
            senhaTemporaria: TEMPORARY_PASSWORD,
        };
    }));
});
exports.createStudentAccount = createStudentAccount;
