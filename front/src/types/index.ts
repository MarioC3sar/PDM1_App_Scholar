export interface LoginCredentials {
  login: string;
  password: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: "aluno" | "professor" | "admin";
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export interface Student {
  id: string;
  nome: string;
  matricula: string;
  curso: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface StudentFormData {
  nome: string;
  matricula: string;
  curso: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Teacher {
  id: string;
  nome: string;
  titulacao: string;
  area: string;
  tempoDocencia: string;
  email: string;
}

export interface TeacherFormData {
  nome: string;
  titulacao: string;
  area: string;
  tempoDocencia: string;
  email: string;
}

export interface Course {
  id: string;
  nome: string;
  cargaHoraria: string;
  professorResponsavel: string;
  curso: string;
  semestre: string;
}

export interface CourseFormData {
  nome: string;
  cargaHoraria: string;
  professorResponsavel: string;
  curso: string;
  semestre: string;
}

export interface GradeEntry {
  id: string;
  matricula: string;
  aluno: string;
  disciplina: string;
  nota1: number;
  nota2: number;
  media: number;
  situacao: "Aprovado" | "Reprovado" | "Em analise";
}

export interface AcademicContextType {
  students: Student[];
  teachers: Teacher[];
  courses: Course[];
  grades: GradeEntry[];
  states: string[];
  cities: string[];
  loadingStates: boolean;
  loadingCities: boolean;
  addStudent: (student: StudentFormData) => Promise<void>;
  addTeacher: (teacher: TeacherFormData) => Promise<void>;
  addCourse: (course: CourseFormData) => Promise<void>;
  searchAddressByCep: (cep: string) => Promise<Partial<StudentFormData>>;
  loadStates: () => Promise<void>;
  loadCitiesByState: (uf: string) => Promise<void>;
}

export interface ValidationErrors {
  [key: string]: string;
}