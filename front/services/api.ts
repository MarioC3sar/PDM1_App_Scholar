import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

if (!API_URL) {
  throw new Error(
    "EXPO_PUBLIC_API_URL nao definido. Configure a URL do backend do Render.",
  );
}

const api = axios.create({
  // Base URL configuravel por ambiente.
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

type ApiErrorPayload = {
  message?: string;
  detalhes?: {
    message?: string;
  };
};

const fallbackByStatus: Record<number, string> = {
  400: "Requisição inválida.",
  401: "Sessão expirada ou inválida. Faça login novamente.",
  403: "Você não tem permissão para acessar este recurso.",
  404: "Recurso não encontrado.",
  409: "Já existe um registro com esses dados.",
  422: "Não foi possível processar os dados enviados.",
  500: "Erro interno no servidor.",
};

export const getApiErrorMessage = (
  error: unknown,
  fallbackMessage = "Falha na requisição.",
): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : fallbackMessage;
  }

  const responseData = error.response?.data as ApiErrorPayload | undefined;
  const backendMessage = responseData?.message ?? responseData?.detalhes?.message;

  if (backendMessage?.trim()) {
    return backendMessage.trim();
  }

  const status = error.response?.status;
  if (status && fallbackByStatus[status]) {
    return fallbackByStatus[status];
  }

  return fallbackMessage;
};

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
