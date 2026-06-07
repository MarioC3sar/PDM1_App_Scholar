import * as SecureStore from "expo-secure-store";
import api, { getApiErrorMessage } from "@/services/api";
import { LoginCredentials, User } from "@/types";

type LoginResponse = {
  token: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
    perfil: "ADMIN" | "PROFESSOR" | "ALUNO" | string;
    primeiroAcesso: boolean;
    matricula?: string;
  };
};

const normalizePerfil = (perfil: string): User["perfil"] => {
  switch (perfil.toUpperCase()) {
    case "ADMIN":
      return "admin";
    case "PROFESSOR":
      return "professor";
    case "ALUNO":
      return "aluno";
    default:
      return "admin";
  }
};

export const loginWithApi = async (
  credentials: LoginCredentials,
): Promise<User> => {
  if (!credentials.login.trim() || !credentials.password.trim()) {
    throw new Error("Informe login e senha.");
  }

  try {
    const response = await api.post<LoginResponse>("/login", {
      login: credentials.login,
      password: credentials.password,
    });

    const { token, usuario } = response.data;

    await SecureStore.setItemAsync("userToken", token);

    return {
      id: String(usuario.id),
      nome: usuario.nome,
      email: usuario.email,
      perfil: normalizePerfil(usuario.perfil),
      firstAccess:
        usuario.perfil.toUpperCase() === "ADMIN" ? false : usuario.primeiroAcesso,
      matricula: usuario.matricula,
    };
  } catch (error) {
    console.error("Erro na requisicao de login:", error);
    throw new Error(
      getApiErrorMessage(error, "Falha na autenticacao. Verifique suas credenciais."),
    );
  }
};

export const changeFirstAccessPassword = async (
  newPassword: string,
): Promise<void> => {
  await api.put("/auth/first-access", {
    novaSenha: newPassword,
  });
};
