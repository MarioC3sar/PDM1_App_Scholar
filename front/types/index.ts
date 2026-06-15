export interface LoginCredentials {
  login: string;
  password: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  perfil: "aluno" | "professor" | "admin" | "ALUNO" | "PROFESSOR" | "ADMIN";
  firstAccess: boolean;
  matricula?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  completeFirstAccess: () => void;
  logout: () => void;
}

export interface Student {
  id: string;
  nome: string;
  matricula: string;
  semestre: string;
  curso: string;
  emailPessoal: string;
  emailInstitucional: string;
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
  semestre: string;
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

export interface TeacherAccountResult {
  teacher: Teacher;
  emailPersonal: string | null;
  emailAccess: string;
  temporaryPassword: string;
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

export interface CourseOption {
  id: number;
  nome: string;
  descricao?: string | null;
}

export interface StudentAccountResult {
  student: Student;
  emailInstitucional: string;
  senhaTemporaria: string;
  primeiroAcesso: boolean;
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
  availableCourses: CourseOption[];
  grades: GradeEntry[];
  states: string[];
  cities: string[];
  loadingStates: boolean;
  loadingCities: boolean;
  loadingCourses: boolean;
  loadingDisciplines: boolean;
  loadingStudents: boolean;
  loadingTeachers: boolean;
  addStudent: (student: StudentFormData) => Promise<StudentAccountResult>;
  addTeacher: (teacher: TeacherFormData) => Promise<TeacherAccountResult>;
  addCourse: (course: CourseFormData) => Promise<void>;
  updateGrade: (gradeId: string, updates: Pick<GradeEntry, "nota1" | "nota2">) => Promise<void>;
  searchAddressByCep: (cep: string) => Promise<Partial<StudentFormData>>;
  loadStates: () => Promise<void>;
  loadCitiesByState: (uf: string) => Promise<void>;
  loadCourses: () => Promise<void>;
  loadDisciplines: () => Promise<void>;
  loadStudents: () => Promise<void>;
  loadTeachers: () => Promise<void>;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface Aviso {
  id: number;
  titulo: string;
  mensagem: string;
  perfil_alvo: "todos" | "ALUNO" | "PROFESSOR";
  data_criacao: string;
}
