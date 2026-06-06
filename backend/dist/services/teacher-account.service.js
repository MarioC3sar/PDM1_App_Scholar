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
exports.createTeacherAccount = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const zodController_1 = require("../schemas/zodController");
const INSTITUTIONAL_EMAIL_DOMAIN = (_a = process.env.INSTITUTIONAL_EMAIL_DOMAIN) !== null && _a !== void 0 ? _a : "professor.scholar.edu.br";
const TEMPORARY_PASSWORD = (_b = process.env.TEMP_TEACHER_PASSWORD) !== null && _b !== void 0 ? _b : "Professor@2026";
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
    const firstName = (_a = parts[0]) !== null && _a !== void 0 ? _a : "professor";
    const lastName = parts.length > 1 ? parts[parts.length - 1] : "professor";
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
const createTeacherAccount = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const data = zodController_1.createTeacherAccountSchema.parse(input);
    return prismaClient_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const email = yield buildUniqueInstitutionalEmail(tx, data.nome);
        const senhaHash = yield bcryptjs_1.default.hash(TEMPORARY_PASSWORD, 10);
        const usuario = yield tx.usuario.create({
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
        const professor = yield tx.professor.create({
            data: {
                nome: data.nome,
                titulacao: data.titulacao,
                area: data.area,
                tempoDocencia: (_a = data.tempoDocencia) !== null && _a !== void 0 ? _a : null,
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
    }));
});
exports.createTeacherAccount = createTeacherAccount;
