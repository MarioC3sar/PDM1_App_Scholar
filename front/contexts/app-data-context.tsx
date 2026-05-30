import { loadCities, loadStates } from "@/services/location-service";
import { getAddressByCep } from "@/services/address-service";
import { getCoursesFromApi } from "@/services/course-service";
import { createStudentOnApi } from "@/services/student-service";
import {
  AcademicContextType,
  Course,
  CourseFormData,
  GradeEntry,
  Student,
  StudentFormData,
  Teacher,
  TeacherFormData,
} from "@/types";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

const initialTeachers: Teacher[] = [
  {
    id: "t-1",
    nome: "Ana Paula Lima",
    titulacao: "Mestre",
    area: "Engenharia de Software",
    tempoDocencia: "8 anos",
    email: "ana.lima@appscholar.edu",
  },
];

const initialCourses: Course[] = [
  {
    id: "c-1",
    nome: "Programacao Mobile",
    cargaHoraria: "80",
    professorResponsavel: "Ana Paula Lima",
    curso: "DSM",
    semestre: "4",
  },
  {
    id: "c-2",
    nome: "Banco de Dados",
    cargaHoraria: "60",
    professorResponsavel: "Ana Paula Lima",
    curso: "DSM",
    semestre: "3",
  },
];

const initialStudents: Student[] = [
  {
    id: "s-1",
    nome: "Maria Souza",
    matricula: "2024001",
    curso: "DSM",
    email: "maria@appscholar.edu",
    telefone: "(11) 99999-1111",
    cep: "12245000",
    logradouro: "Rua das Flores",
    numero: "120",
    bairro: "Centro",
    cidade: "Sao Jose dos Campos",
    estado: "SP",
  },
];

const initialGrades: GradeEntry[] = [
  {
    id: "g-1",
    matricula: "2024001",
    aluno: "Maria Souza",
    disciplina: "Programacao Mobile",
    nota1: 8,
    nota2: 7,
    media: 7.5,
    situacao: "Aprovado",
  },
  {
    id: "g-2",
    matricula: "2024001",
    aluno: "Maria Souza",
    disciplina: "Banco de Dados",
    nota1: 6,
    nota2: 5,
    media: 5.5,
    situacao: "Em analise",
  },
];

export const AcademicContext = createContext<AcademicContextType | undefined>(
  undefined,
);

interface ProviderProps {
  children: React.ReactNode;
}

export const AcademicProvider: React.FC<ProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableCourses, setAvailableCourses] = useState<
    { id: number; nome: string; descricao?: string | null }[]
  >([]);
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setCourses(initialCourses);
    setGrades(initialGrades);
  }, []);

  const addStudent = useCallback(async (student: StudentFormData) => {
    const result = await createStudentOnApi(student);
    setStudents((prev) => [result.student, ...prev]);
    return result;
  }, []);

  const addTeacher = useCallback(async (teacher: TeacherFormData) => {
    const newTeacher: Teacher = { id: `t-${Date.now()}`, ...teacher };
    setTeachers((prev) => [newTeacher, ...prev]);
  }, []);

  const addCourse = useCallback(async (course: CourseFormData) => {
    const newCourse: Course = { id: `c-${Date.now()}`, ...course };
    setCourses((prev) => [newCourse, ...prev]);
  }, []);

  const updateGrade = useCallback(
    async (gradeId: string, updates: Pick<GradeEntry, "nota1" | "nota2">) => {
      setGrades((prev) =>
        prev.map((grade) => {
          if (grade.id !== gradeId) return grade;

          const nota1 = updates.nota1;
          const nota2 = updates.nota2;
          const media = (nota1 + nota2) / 2;
          const situacao =
            media >= 6 ? "Aprovado" : media < 4 ? "Reprovado" : "Em analise";

          return { ...grade, nota1, nota2, media, situacao };
        }),
      );
    },
    [],
  );

  const searchAddressByCep = useCallback(
    async (cep: string) => getAddressByCep(cep),
    [],
  );

  const hydrateStates = useCallback(async () => {
    setLoadingStates(true);
    try {
      setStates(await loadStates());
    } finally {
      setLoadingStates(false);
    }
  }, []);

  const hydrateCities = useCallback(async (uf: string) => {
    if (!uf) {
      setCities([]);
      return;
    }

    setLoadingCities(true);
    try {
      setCities(await loadCities(uf));
    } finally {
      setLoadingCities(false);
    }
  }, []);

  const hydrateCourses = useCallback(async () => {
    setLoadingCourses(true);
    try {
      setAvailableCourses(await getCoursesFromApi());
    } finally {
      setLoadingCourses(false);
    }
  }, []);

  const value = useMemo<AcademicContextType>(
    () => ({
      students,
      teachers,
      courses,
      availableCourses,
      grades,
      states,
      cities,
      loadingStates,
      loadingCities,
      loadingCourses,
      addStudent,
      addTeacher,
      addCourse,
      updateGrade,
      searchAddressByCep,
      loadStates: hydrateStates,
      loadCitiesByState: hydrateCities,
      loadCourses: hydrateCourses,
    }),
    [
      students,
      teachers,
      courses,
      availableCourses,
      grades,
      states,
      cities,
      loadingStates,
      loadingCities,
      loadingCourses,
      addStudent,
      addTeacher,
      addCourse,
      updateGrade,
      searchAddressByCep,
      hydrateStates,
      hydrateCities,
      hydrateCourses,
    ],
  );

  return (
    <AcademicContext.Provider value={value}>{children}</AcademicContext.Provider>
  );
};
