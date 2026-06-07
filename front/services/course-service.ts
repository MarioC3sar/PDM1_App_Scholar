import api, { getApiErrorMessage } from "@/services/api";

export interface ApiCourse {
  id: number;
  nome: string;
  descricao?: string | null;
}

type GetCoursesResponse = {
  total: number;
  cursos: ApiCourse[];
};

export const getCoursesFromApi = async (): Promise<ApiCourse[]> => {
  try {
    const response = await api.get<GetCoursesResponse>("/cursos");
    return response.data.cursos ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Falha ao buscar cursos."));
  }
};
