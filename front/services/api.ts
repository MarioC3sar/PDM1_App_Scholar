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

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
