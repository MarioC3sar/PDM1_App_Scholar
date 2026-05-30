import api from "@/services/api";

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
  const response = await api.get<ProfessorDisciplinesResponse>("/professores/me/disciplinas");
  return response.data;
};

export const getProfessorDisciplineGrades = async (
  disciplinaId: number,
): Promise<ProfessorDisciplineGradesResponse> => {
  const response = await api.get<ProfessorDisciplineGradesResponse>(
    `/professores/me/disciplinas/${disciplinaId}/notas`,
  );
  return response.data;
};

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
  const response = await api.put(`/notas/${notaId}`, data);
  return response.data;
};
