import { StudentFormData } from "@/types";

interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export const getAddressByCep = async (
  cep: string,
): Promise<Partial<StudentFormData>> => {
  const sanitizedCep = cep.replace(/\D/g, "");

  if (sanitizedCep.length !== 8) {
    return {};
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${sanitizedCep}/json/`);
    const data = (await response.json()) as ViaCepResponse;

    if (data.erro) {
      return {};
    }

    return {
      cep: sanitizedCep,
      logradouro: data.logradouro ?? "",
      bairro: data.bairro ?? "",
      cidade: data.localidade ?? "",
      estado: data.uf ?? "",
    };
  } catch {
    return {};
  }
};