import { loadCities, loadStates } from "@/services/location-service";
import { getAddressByCep } from "@/services/address-service";
import { getCoursesFromApi } from "@/services/course-service";
import { createDisciplineOnApi, getDisciplinesFromApi } from "@/services/discipline-service";
import { getTeachersFromApi, createTeacherOnApi } from "@/services/teacher-service";
import { createStudentOnApi, getStudentsFromApi } from "@/services/student-service";
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
  const [loadingDisciplines, setLoadingDisciplines] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingTeachers, setLoadingTeachers] = useState(false);



  const addStudent = useCallback(async (student: StudentFormData) => {
    const result = await createStudentOnApi(student);
    setStudents((prev) => [result.student, ...prev]);
    return result;
  }, []);

  const addTeacher = useCallback(async (teacher: TeacherFormData) => {
    const result = await createTeacherOnApi(teacher);
    setTeachers((prev) => [result.teacher, ...prev]);
  }, []);

  const addCourse = useCallback(async (course: CourseFormData) => {
    const newCourse = await createDisciplineOnApi(course);
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

  const hydrateDisciplines = useCallback(async () => {
    setLoadingDisciplines(true);
    try {
      setCourses(await getDisciplinesFromApi());
    } finally {
      setLoadingDisciplines(false);
    }
  }, []);

  const hydrateStudents = useCallback(async () => {
    setLoadingStudents(true);
    try {
      setStudents(await getStudentsFromApi());
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  const hydrateTeachers = useCallback(async () => {
    setLoadingTeachers(true);
    try {
      setTeachers(await getTeachersFromApi());
    } finally {
      setLoadingTeachers(false);
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
      loadingDisciplines,
      loadingStudents,
      loadingTeachers,
      addStudent,
      addTeacher,
      addCourse,
      updateGrade,
      searchAddressByCep,
      loadStates: hydrateStates,
      loadCitiesByState: hydrateCities,
      loadCourses: hydrateCourses,
      loadDisciplines: hydrateDisciplines,
      loadStudents: hydrateStudents,
      loadTeachers: hydrateTeachers,
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
      loadingDisciplines,
      loadingStudents,
      loadingTeachers,
      addStudent,
      addTeacher,
      addCourse,
      updateGrade,
      searchAddressByCep,
      hydrateStates,
      hydrateCities,
      hydrateCourses,
      hydrateDisciplines,
      hydrateStudents,
      hydrateTeachers,
    ],
  );

  return (
    <AcademicContext.Provider value={value}>{children}</AcademicContext.Provider>
  );
};
