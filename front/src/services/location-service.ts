const fallbackStates = ["SP", "RJ", "MG", "PR", "SC"];

const fallbackCities: Record<string, string[]> = {
  SP: ["Sao Paulo", "Sao Jose dos Campos", "Campinas"],
  RJ: ["Rio de Janeiro", "Niteroi", "Petropolis"],
  MG: ["Belo Horizonte", "Uberlandia", "Juiz de Fora"],
  PR: ["Curitiba", "Londrina", "Maringa"],
  SC: ["Florianopolis", "Joinville", "Blumenau"],
};

export const loadStates = async (): Promise<string[]> => {
  try {
    const response = await fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
    );
    const data = (await response.json()) as Array<{ sigla: string }>;
    return data.map((item) => item.sigla).sort();
  } catch {
    return fallbackStates;
  }
};

export const loadCities = async (uf: string): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
    );
    const data = (await response.json()) as Array<{ nome: string }>;
    return data.map((item) => item.nome).sort();
  } catch {
    return fallbackCities[uf] ?? [];
  }
};
