import { z } from "zod";

const passwordStrength = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const createStudentAccountSchema = z
  .object({
    nome: z.string().min(3, "O nome deve ter no minimo 3 caracteres."),
    matricula: z.string().min(5, "A matricula deve ter no minimo 5 caracteres."),
    cursoId: z.coerce.number().int().positive("O ID do curso deve ser um numero valido e positivo."),
    email: z.string().email("O e-mail pessoal deve ser valido."),
    telefone: z.string().optional(),
    cep: z.string().length(8, "O CEP deve ter exatamente 8 numeros.").optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    bairro: z.string().optional(),
    cidade: z.string().optional(),
    estado: z.string().length(2, "O estado deve ter 2 letras (ex: SP).").optional(),
  })
  .strict();

export const firstAccessPasswordSchema = z.object({
  novaSenha: z
    .string()
    .min(8, "A senha deve ter no minimo 8 caracteres.")
    .regex(
      passwordStrength,
      "A senha deve ter maiuscula, minuscula, numero e caractere especial.",
    ),
});
