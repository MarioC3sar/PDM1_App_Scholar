// ========== AUTENTICAÇÃO ==========

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

// ========== USUÁRIO ==========

export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "teacher" | "admin";
  createdAt: string;
}

// ========== ALUNO ==========

export interface Student {
  id: string;
  name: string;
  matricula: string;
  course: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentFormData {
  name: string;
  matricula: string;
  course: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
}

// ========== PROFESSOR ==========

export interface Teacher {
  id: string;
  name: string;
  titulacao: string;
  areaAtuacao: string;
  tempoDocencia: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherFormData {
  name: string;
  titulacao: string;
  areaAtuacao: string;
  tempoDocencia: string;
  email: string;
}

// ========== DISCIPLINA ==========

export interface Course {
  id: string;
  nome: string;
  cargaHoraria: number;
  professorId: string;
  professorNome?: string;
  curso: string;
  semestre: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFormData {
  nome: string;
  cargaHoraria: number;
  professorId: string;
  curso: string;
  semestre: number;
}

// ========== BOLETIM / NOTAS ==========

export interface Grade {
  id: string;
  studentId: string;
  studentNome?: string;
  courseId: string;
  courseNome?: string;
  nota1: number;
  nota2: number;
  media: number;
  situacao: "aprovado" | "reprovado" | "pendente";
  createdAt: string;
  updatedAt: string;
}

export interface GradeFormData {
  studentId: string;
  courseId: string;
  nota1: number;
  nota2: number;
}

// ========== RESPOSTA DE API ==========

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ========== ERROS ==========

export interface FormError {
  field: string;
  message: string;
}

export interface ValidationError {
  [key: string]: string;
}
