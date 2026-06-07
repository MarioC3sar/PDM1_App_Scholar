import api, { getApiErrorMessage } from "@/services/api";

export type ProfessorDisciplineSummary = {
  id: number;
  nome: string;
  semestre: string;
  cargaHoraria: number;
  totalAlunos: number;
  curso: {
    id: number;
    nome: string;
  };
};

export type ProfessorDisciplinesResponse = {
  professor: {
    id: number;
    nome: string;
  };
  disciplinas: ProfessorDisciplineSummary[];
};

export type EditableDisciplineSummary = {
  id: number;
  nome: string;
  semestre: string;
  cargaHoraria: number;
  totalAlunos?: number;
  curso: {
    id?: number;
    nome: string;
  };
  professor?: {
    nome: string;
  };
};

type DisciplinesResponse = {
  total: number;
  disciplinas: EditableDisciplineSummary[];
};

export type ProfessorGradeItem = {
  id: number;
  alunoId: number;
  aluno: string;
  matricula: string;
  nota1: number | null;
  nota2: number | null;
  media: number | null;
  faltas: number;
  situacao: string;
};

export type ProfessorDisciplineGradesResponse = {
  disciplina: {
    id: number;
    nome: string;
    semestre: string;
    curso: {
      id: number;
      nome: string;
    };
  };
  alunos: ProfessorGradeItem[];
};

export type UpdateGradePayload = {
  nota1?: number;
  nota2?: number;
  faltas?: number;
};

export const getProfessorDisciplines = async (): Promise<ProfessorDisciplinesResponse> => {
  try {
    const response = await api.get<ProfessorDisciplinesResponse>("/professores/me/disciplinas");
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Falha ao carregar disciplinas do professor."),
    );
  }
};

export const getAllDisciplines = async (): Promise<EditableDisciplineSummary[]> => {
  try {
    const response = await api.get<DisciplinesResponse>("/disciplinas");
    return response.data.disciplinas ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Falha ao carregar disciplinas."));
  }
};

export const getDisciplineGrades = async (
  disciplinaId: number,
): Promise<ProfessorDisciplineGradesResponse> => {
  try {
    const response = await api.get<ProfessorDisciplineGradesResponse>(
      `/professores/me/disciplinas/${disciplinaId}/notas`,
    );
    return response.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Falha ao carregar notas da disciplina."),
    );
  }
};

export const getProfessorDisciplineGrades = getDisciplineGrades;

export const updateStudentGrade = async (
  notaId: number,
  data: UpdateGradePayload,
): Promise<{
  message: string;
  nota: ProfessorGradeItem & {
    disciplinaId: number;
    disciplina: string;
  };
}> => {
  try {
    const response = await api.put(`/notas/${notaId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Falha ao salvar alterações."));
  }
};
