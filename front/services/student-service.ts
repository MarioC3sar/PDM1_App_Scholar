import { isAxiosError } from "axios";
import api from "@/services/api";
import { Student, StudentFormData, StudentAccountResult } from "@/types";
import { ApiCourse, getCoursesFromApi } from "@/services/course-service";

type CreateStudentResponse = {
  message: string;
  aluno: {
    id: number;
    nome: string;
    matricula: string;
    telefone?: string | null;
    cep?: string | null;
    logradouro?: string | null;
    numero?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
    cursoId: number;
  };
  usuario: {
    id: number;
    email: string;
    primeiroAcesso: boolean;
  };
  senhaTemporaria: string;
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
    throw new Error(
      `Curso "${courseValue}" nao encontrado. Cadastre o curso no banco ou use um nome/id valido.`,
    );
  }

  return course;
};

export const createStudentOnApi = async (
  student: StudentFormData,
): Promise<StudentAccountResult> => {
  try {
    const course = await resolveCourse(student.curso);

    const payload = {
      nome: student.nome.trim(),
      matricula: student.matricula.trim(),
      cursoId: course.id,
      telefone: student.telefone.trim(),
      cep: student.cep.trim(),
      logradouro: student.logradouro.trim(),
      numero: student.numero.trim(),
      bairro: student.bairro.trim(),
      cidade: student.cidade.trim(),
      estado: student.estado.trim().toUpperCase(),
    };

    const response = await api.post<CreateStudentResponse>("/alunos", payload);
    const aluno = response.data.aluno;

    const mappedStudent: Student = {
      id: String(aluno.id),
      nome: aluno.nome,
      matricula: aluno.matricula,
      curso: course.nome,
      email: response.data.usuario.email,
      telefone: aluno.telefone ?? "",
      cep: aluno.cep ?? "",
      logradouro: aluno.logradouro ?? "",
      numero: aluno.numero ?? "",
      bairro: aluno.bairro ?? "",
      cidade: aluno.cidade ?? "",
      estado: aluno.estado ?? "",
    };

    return {
      student: mappedStudent,
      emailInstitucional: response.data.usuario.email,
      senhaTemporaria: response.data.senhaTemporaria,
      primeiroAcesso: response.data.usuario.primeiroAcesso,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      const backendMessage =
        (error.response?.data as { message?: string; detalhes?: { message?: string } } | undefined)
          ?.message ??
        (error.response?.data as { detalhes?: { message?: string } } | undefined)
          ?.detalhes?.message;

      throw new Error(backendMessage ?? "Falha ao cadastrar aluno.");
    }

    throw error instanceof Error
      ? error
      : new Error("Falha ao cadastrar aluno.");
  }
};
