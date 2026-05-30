"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.alunoSchema = void 0;
const zod_1 = require("zod");
// Define as regras de validação para criar um aluno
exports.alunoSchema = zod_1.z.object({
    nome: zod_1.z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
    matricula: zod_1.z.string().min(5, "A matrícula deve ter no mínimo 5 caracteres."),
    cursoId: zod_1.z.coerce.number().int().positive("O ID do curso deve ser um número válido e positivo."),
    email: zod_1.z.string().email("Formato de e-mail inválido."),
    telefone: zod_1.z.string().optional(), // optional() permite que o campo venha vazio
    cep: zod_1.z.string().length(8, "O CEP deve ter exatamente 8 números.").optional(),
    logradouro: zod_1.z.string().optional(),
    numero: zod_1.z.string().optional(),
    bairro: zod_1.z.string().optional(),
    cidade: zod_1.z.string().optional(),
    estado: zod_1.z.string().length(2, "O estado deve ter 2 letras (ex: SP).").optional(),
});
