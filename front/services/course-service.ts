import api from "@/services/api";

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
  const response = await api.get<GetCoursesResponse>("/cursos");
  return response.data.cursos ?? [];
};
