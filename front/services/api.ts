import axios from "axios";
import * as SecureStore from "expo-secure-store";

const IP_DA_MAQUINA = process.env.IP || "192.168.96.65";

const api = axios.create({
  // Já deixamos o /api no final para você não precisar repetir nas telas
  baseURL: `http://${IP_DA_MAQUINA}:3000/api`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
