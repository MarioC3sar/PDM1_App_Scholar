"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextId = exports.grades = exports.courses = exports.teachers = exports.students = exports.users = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const senhaPadrao = bcryptjs_1.default.hashSync("123456", 10);
exports.users = [
    {
        id: 1,
        login: "admin@appscholar.edu",
        email: "admin@appscholar.edu",
        senhaHash: senhaPadrao,
        nome: "Administrador",
        perfil: "admin",
    },
];
exports.students = [
    {
        id: 1,
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
exports.teachers = [
    {
        id: 1,
        nome: "Ana Paula Lima",
        titulacao: "Mestre",
        area: "Engenharia de Software",
        tempoDocencia: "8 anos",
        email: "ana.lima@appscholar.edu",
    },
];
exports.courses = [
    {
        id: 1,
        nome: "Programacao Mobile",
        cargaHoraria: 80,
        professorId: 1,
        professorResponsavel: "Ana Paula Lima",
        curso: "DSM",
        semestre: "4",
    },
    {
        id: 2,
        nome: "Banco de Dados",
        cargaHoraria: 60,
        professorId: 1,
        professorResponsavel: "Ana Paula Lima",
        curso: "DSM",
        semestre: "3",
    },
];
exports.grades = [
    {
        id: 1,
        alunoId: 1,
        disciplinaId: 1,
        nota1: 8,
        nota2: 7,
        media: 7.5,
        situacao: "Aprovado",
    },
    {
        id: 2,
        alunoId: 1,
        disciplinaId: 2,
        nota1: 6,
        nota2: 5,
        media: 5.5,
        situacao: "Em analise",
    },
];
const nextId = (collection) => collection.length === 0
    ? 1
    : Math.max(...collection.map((item) => item.id)) + 1;
exports.nextId = nextId;
