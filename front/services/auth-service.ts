import { LoginCredentials, User } from "@/types";

export const loginWithApi = async (
  credentials: LoginCredentials,
): Promise<User> => {
  if (!credentials.login.trim() || !credentials.password.trim()) {
    throw new Error("Informe login e senha.");
  }

  try {
    const response = await fetch("http://192.168.15.13:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.login, 
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Falha na autenticação. Verifique suas credenciais."
      );
    }

    const data = await response.json();
    
    // O backend retorna { token, usuario: { id, nome, perfil, email } }
    return data.usuario as User;

  } catch (error) {
    console.error("Erro na requisição de login:", error);
    throw error; 
  }
};
