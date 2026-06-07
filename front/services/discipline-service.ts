import { isAxiosError } from "axios";
import api, { getApiErrorMessage } from "@/services/api";
import { Course, CourseFormData } from "@/types";
import { getCoursesFromApi, ApiCourse } from "@/services/course-service";
import { getTeachersFromApi } from "@/services/teacher-service";

type CreateDisciplineResponse = {
  message: string;
  disciplina: {
    id: number;
    nome: string;
    cargaHoraria: number;
    semestre: string;
    professor?: { nome: string };
    curso?: { nome: string };
  };
};

type DisciplinesResponse = {
  total: number;
  disciplinas: Array<{
    id: number;
    nome: string;
    cargaHoraria: number;
    semestre: string;
    professor?: { nome: string };
    curso?: { nome: string };
  }>;
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const resolveCourse = async (courseValue: string): Promise<ApiCourse> => {
  const cursos = await getCoursesFromApi();
  const normalizedValue = normalizeText(courseValue);

  const course = cursos.find(
    (item) =>
      normalizeText(item.nome) === normalizedValue ||
      String(item.id) === courseValue.trim(),
  );

  if (!course) {
    throw new Error(`Curso "${courseValue}" nao encontrado.`);
  }

  return course;
};

const resolveTeacher = async (teacherValue: string) => {
  const teachers = await getTeachersFromApi();
  const normalizedValue = normalizeText(teacherValue);

  const teacher = teachers.find(
    (item) =>
      normalizeText(item.nome) === normalizedValue ||
      String(item.id) === teacherValue.trim(),
  );

  if (!teacher) {
    throw new Error(`Professor "${teacherValue}" nao encontrado.`);
  }

  return teacher;
};

export const getDisciplinesFromApi = async (): Promise<Course[]> => {
  try {
    const response = await api.get<DisciplinesResponse>("/disciplinas");

    return (response.data.disciplinas ?? []).map((disciplina) => ({
      id: String(disciplina.id),
      nome: disciplina.nome,
      cargaHoraria: String(disciplina.cargaHoraria),
      professorResponsavel: disciplina.professor?.nome ?? "",
      curso: disciplina.curso?.nome ?? "",
      semestre: disciplina.semestre,
    }));
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(getApiErrorMessage(error, "Falha ao buscar disciplinas."));
    }

    throw error instanceof Error ? error : new Error("Falha ao buscar disciplinas.");
  }
};

export const createDisciplineOnApi = async (
  discipline: CourseFormData,
): Promise<Course> => {
  try {
    const [teacher, course] = await Promise.all([
      resolveTeacher(discipline.professorResponsavel),
      resolveCourse(discipline.curso),
    ]);

    const response = await api.post<CreateDisciplineResponse>("/disciplinas", {
      nome: discipline.nome.trim(),
      cargaHoraria: Number(discipline.cargaHoraria),
      professorId: Number(teacher.id),
      cursoId: Number(course.id),
      semestre: discipline.semestre.trim(),
    });

    return {
      id: String(response.data.disciplina.id),
      nome: response.data.disciplina.nome,
      cargaHoraria: String(response.data.disciplina.cargaHoraria),
      professorResponsavel: response.data.disciplina.professor?.nome ?? "",
      curso: response.data.disciplina.curso?.nome ?? "",
      semestre: response.data.disciplina.semestre,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(getApiErrorMessage(error, "Falha ao cadastrar disciplina."));
    }

    throw error instanceof Error ? error : new Error("Falha ao cadastrar disciplina.");
  }
};

export const updateDisciplineOnApi = async (
  disciplineId: string,
  discipline: Partial<CourseFormData>,
): Promise<Course> => {
  try {
    const payload: Record<string, string | number> = {};

    if (discipline.nome !== undefined && discipline.nome.trim() !== "") {
      payload.nome = discipline.nome.trim();
    }

    if (discipline.cargaHoraria !== undefined && discipline.cargaHoraria.trim() !== "") {
      payload.cargaHoraria = Number(discipline.cargaHoraria);
    }

    if (discipline.semestre !== undefined && discipline.semestre.trim() !== "") {
      payload.semestre = discipline.semestre.trim();
    }

    if (
      discipline.professorResponsavel !== undefined &&
      discipline.professorResponsavel.trim() !== ""
    ) {
      const teacher = await resolveTeacher(discipline.professorResponsavel);
      payload.professorId = Number(teacher.id);
    }

    if (discipline.curso !== undefined && discipline.curso.trim() !== "") {
      const course = await resolveCourse(discipline.curso);
      payload.cursoId = Number(course.id);
    }

    const response = await api.put<CreateDisciplineResponse>(
      `/disciplinas/${disciplineId}`,
      payload,
    );

    return {
      id: String(response.data.disciplina.id),
      nome: response.data.disciplina.nome,
      cargaHoraria: String(response.data.disciplina.cargaHoraria),
      professorResponsavel: response.data.disciplina.professor?.nome ?? "",
      curso: response.data.disciplina.curso?.nome ?? "",
      semestre: response.data.disciplina.semestre,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(getApiErrorMessage(error, "Falha ao atualizar disciplina."));
    }

    throw error instanceof Error ? error : new Error("Falha ao atualizar disciplina.");
  }
};
