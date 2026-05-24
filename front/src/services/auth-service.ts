import { LoginCredentials, User } from "@/types";

export const loginWithMockApi = async (
  credentials: LoginCredentials,
): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (!credentials.login.trim() || !credentials.password.trim()) {
    throw new Error("Informe login e senha.");
  }

  return {
    id: "u-1",
    nome: "Mario",
    email: credentials.login,
    perfil: credentials.login === "aluno@pdm.com"
      ? "aluno"
      : credentials.login === "professor@pdm.com"
        ? "professor"
        : "admin",
    // Para o aluno, simulamos o vinculo com uma matricula para permitir restringir a consulta.
    matricula: credentials.login === "aluno@pdm.com" ? "2024001" : undefined,
  };
};
