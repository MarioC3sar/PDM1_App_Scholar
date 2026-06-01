"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstAccessPasswordSchema = exports.createStudentAccountSchema = void 0;
const zod_1 = require("zod");
const passwordStrength = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
exports.createStudentAccountSchema = zod_1.z
    .object({
    nome: zod_1.z.string().min(3, "O nome deve ter no minimo 3 caracteres."),
    matricula: zod_1.z.string().min(5, "A matricula deve ter no minimo 5 caracteres."),
    cursoId: zod_1.z.coerce.number().int().positive("O ID do curso deve ser um numero valido e positivo."),
    email: zod_1.z.string().email("O e-mail pessoal deve ser valido."),
    telefone: zod_1.z.string().optional(),
    cep: zod_1.z.string().length(8, "O CEP deve ter exatamente 8 numeros.").optional(),
    logradouro: zod_1.z.string().optional(),
    numero: zod_1.z.string().optional(),
    bairro: zod_1.z.string().optional(),
    cidade: zod_1.z.string().optional(),
    estado: zod_1.z.string().length(2, "O estado deve ter 2 letras (ex: SP).").optional(),
})
    .strict();
exports.firstAccessPasswordSchema = zod_1.z.object({
    novaSenha: zod_1.z
        .string()
        .min(8, "A senha deve ter no minimo 8 caracteres.")
        .regex(passwordStrength, "A senha deve ter maiuscula, minuscula, numero e caractere especial."),
});
