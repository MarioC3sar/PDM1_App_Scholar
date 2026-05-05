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
    nome: "Joao Academico",
    email: credentials.login,
    perfil: "admin",
  };
};
