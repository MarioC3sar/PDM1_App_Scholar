import { loadCities, loadStates } from "@/services/location-service";
import { getAddressByCep } from "@/services/address-service";
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
import React, { createContext, useEffect, useMemo, useState } from "react";

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
    endereco: "Rua das Flores, 120",
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
  const [grades, setGrades] = useState<GradeEntry[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    setStudents(initialStudents);
    setTeachers(initialTeachers);
    setCourses(initialCourses);
    setGrades(initialGrades);
  }, []);

  const addStudent = async (student: StudentFormData) => {
    const newStudent: Student = { id: `s-${Date.now()}`, ...student };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const addTeacher = async (teacher: TeacherFormData) => {
    const newTeacher: Teacher = { id: `t-${Date.now()}`, ...teacher };
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  const addCourse = async (course: CourseFormData) => {
    const newCourse: Course = { id: `c-${Date.now()}`, ...course };
    setCourses((prev) => [newCourse, ...prev]);
  };

  const searchAddressByCep = async (cep: string) => getAddressByCep(cep);

  const hydrateStates = async () => {
    setLoadingStates(true);
    try {
      setStates(await loadStates());
    } finally {
      setLoadingStates(false);
    }
  };

  const hydrateCities = async (uf: string) => {
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
  };

  const value = useMemo<AcademicContextType>(
    () => ({
      students,
      teachers,
      courses,
      grades,
      states,
      cities,
      loadingStates,
      loadingCities,
      addStudent,
      addTeacher,
      addCourse,
      searchAddressByCep,
      loadStates: hydrateStates,
      loadCitiesByState: hydrateCities,
    }),
    [cities, courses, grades, loadingCities, loadingStates, states, students, teachers],
  );

  return (
    <AcademicContext.Provider value={value}>{children}</AcademicContext.Provider>
  );
};
