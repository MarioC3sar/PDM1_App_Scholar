import { isAxiosError } from "axios";
import api from "@/services/api";
import { Teacher, TeacherFormData } from "@/types";

type CreateTeacherResponse = {
  message: string;
  professor: {
    id: number;
    nome: string;
    titulacao: string;
    area: string;
    tempoDocencia?: string | null;
  };
  email_acesso: string;
  senha_temporaria: string;
};

type TeachersResponse = {
  total: number;
  professores: Array<{
    id: number;
    nome: string;
    titulacao: string;
    area: string;
    tempoDocencia?: string | null;
    email: string;
  }>;
};

export const getTeachersFromApi = async (): Promise<Teacher[]> => {
  try {
    const response = await api.get<TeachersResponse>("/professores");

    return (response.data.professores ?? []).map((professor) => ({
      id: String(professor.id),
      nome: professor.nome,
      titulacao: professor.titulacao,
      area: professor.area,
      tempoDocencia: professor.tempoDocencia ?? "",
      email: professor.email,
    }));
  } catch (error) {
    if (isAxiosError(error)) {
      const backendMessage =
        (error.response?.data as { message?: string; detalhes?: { message?: string } } | undefined)
          ?.message ??
        (error.response?.data as { detalhes?: { message?: string } } | undefined)
          ?.detalhes?.message;

      throw new Error(backendMessage ?? "Falha ao buscar professores.");
    }

    throw error instanceof Error
      ? error
      : new Error("Falha ao buscar professores.");
  }
};

export const createTeacherOnApi = async (
  teacher: TeacherFormData,
): Promise<{
  teacher: Teacher;
  emailAccess: string;
  temporaryPassword: string;
}> => {
  try {
    const response = await api.post<CreateTeacherResponse>("/professores", {
      nome: teacher.nome.trim(),
      titulacao: teacher.titulacao.trim(),
      area: teacher.area.trim(),
      tempoDocencia: teacher.tempoDocencia.trim(),
      email: teacher.email.trim(),
    });

    return {
      teacher: {
        id: String(response.data.professor.id),
        nome: response.data.professor.nome,
        titulacao: response.data.professor.titulacao,
        area: response.data.professor.area,
        tempoDocencia: response.data.professor.tempoDocencia ?? "",
        email: response.data.email_acesso,
      },
      emailAccess: response.data.email_acesso,
      temporaryPassword: response.data.senha_temporaria,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      const backendMessage =
        (error.response?.data as { message?: string; detalhes?: { message?: string } } | undefined)
          ?.message ??
        (error.response?.data as { detalhes?: { message?: string } } | undefined)
          ?.detalhes?.message;

      throw new Error(backendMessage ?? "Falha ao cadastrar professor.");
    }

    throw error instanceof Error
      ? error
      : new Error("Falha ao cadastrar professor.");
  }
};
