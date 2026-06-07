"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const admin_bootstrap_1 = require("./admin-bootstrap");
const prismaClient_1 = __importDefault(require("../prismaClient"));
dotenv_1.default.config();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Iniciando o seed...');
        // 1. Criar um Usuário e Professor genérico para vincular às disciplinas
        // (Usando upsert para não dar erro se rodar o seed mais de uma vez)
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminEmail) {
            throw new Error("ADMIN_EMAIL is required");
        }
        if (!adminPassword) {
            throw new Error("ADMIN_PASSWORD is required");
        }
        const AdminUser = yield (0, admin_bootstrap_1.bootstrapAdmin)(adminEmail, adminPassword);
        console.log(`Admin criado/atualizado: ${AdminUser.email}`);
        const profUser = yield prismaClient_1.default.usuario.upsert({
            where: { email: 'professor.padrao@fatec.sp.gov.br' },
            update: {},
            create: {
                email: 'professor.padrao@fatec.sp.gov.br',
                senhaHash: '$2b$10$ExemploDeHashBcryptParaAcesso', // Em produção, usar bcrypt real
                perfil: 'PROFESSOR',
                primeiroAcesso: false,
                professor: {
                    create: {
                        nome: 'João da Silva',
                        titulacao: 'Mestre',
                        area: 'Tecnologia e Gestão',
                        tempoDocencia: '10 anos',
                        emailPessoal: 'joao.silva2026@gmail.com',
                    },
                },
            },
            include: {
                professor: true,
            },
        });
        if (!profUser.professor) {
            throw new Error('Professor nao foi criado junto com o usuario.');
        }
        const professorId = profUser.professor.id;
        console.log('Professor  criado!');
        // 2. Criar os Cursos
        const dsm = yield prismaClient_1.default.curso.upsert({
            where: { nome: 'Desenvolvimento de Software Multiplataforma' },
            update: {},
            create: {
                nome: 'Desenvolvimento de Software Multiplataforma',
                descricao: 'Formação em desenvolvimento web, mobile e práticas ágeis de engenharia de software.',
            },
        });
        const meioAmbiente = yield prismaClient_1.default.curso.upsert({
            where: { nome: 'Meio Ambiente' },
            update: {},
            create: {
                nome: 'Meio Ambiente',
                descricao: 'Formação focada em sustentabilidade, gestão ambiental e ecologia.',
            },
        });
        const geo = yield prismaClient_1.default.curso.upsert({
            where: { nome: 'Geoprocessamento' },
            update: {},
            create: {
                nome: 'Geoprocessamento',
                descricao: 'Formação em sistemas de informação geográfica, cartografia e análise de dados espaciais.',
            },
        });
        console.log('Cursos criados!');
        yield prismaClient_1.default.disciplina.deleteMany({
            where: {
                cursoId: {
                    in: [dsm.id, meioAmbiente.id, geo.id],
                },
            },
        });
        // 3. Criar as Disciplinas de DSM (com matérias até o 4º semestre)
        yield prismaClient_1.default.disciplina.createMany({
            data: [
                { nome: 'Desenvolvimento Web III', cargaHoraria: 80, semestre: '4', cursoId: dsm.id, professorId },
                { nome: 'Engenharia de Software II', cargaHoraria: 80, semestre: '4', cursoId: dsm.id, professorId },
                { nome: 'Estrutura de Dados', cargaHoraria: 80, semestre: '3', cursoId: dsm.id, professorId },
                { nome: 'Sistemas Operacionais', cargaHoraria: 80, semestre: '2', cursoId: dsm.id, professorId },
            ],
            skipDuplicates: true,
        });
        // 4. Criar as Disciplinas de Meio Ambiente
        yield prismaClient_1.default.disciplina.createMany({
            data: [
                { nome: 'Avaliação de Impactos Ambientais', cargaHoraria: 80, semestre: '3', cursoId: meioAmbiente.id, professorId },
                { nome: 'Legislação Ambiental', cargaHoraria: 40, semestre: '2', cursoId: meioAmbiente.id, professorId },
                { nome: 'Ecologia Aplicada', cargaHoraria: 80, semestre: '1', cursoId: meioAmbiente.id, professorId },
            ],
            skipDuplicates: true,
        });
        // 5. Criar as Disciplinas de Geoprocessamento
        yield prismaClient_1.default.disciplina.createMany({
            data: [
                { nome: 'Sistemas de Informação Geográfica', cargaHoraria: 80, semestre: '2', cursoId: geo.id, professorId },
                { nome: 'Topografia e Geodésia', cargaHoraria: 80, semestre: '1', cursoId: geo.id, professorId },
                { nome: 'Processamento Digital de Imagens', cargaHoraria: 80, semestre: '4', cursoId: geo.id, professorId },
            ],
            skipDuplicates: true,
        });
        console.log('Disciplinas criadas com sucesso!');
        yield backfillExistingStudents();
        console.log('Seed finalizado!');
    });
}
const pickMostFrequentSemester = (values) => {
    var _a;
    const counts = new Map();
    for (const value of values) {
        const normalized = String(value).trim();
        if (!normalized) {
            continue;
        }
        counts.set(normalized, ((_a = counts.get(normalized)) !== null && _a !== void 0 ? _a : 0) + 1);
    }
    let selectedSemester = "";
    let selectedCount = 0;
    for (const [semester, count] of counts.entries()) {
        if (count > selectedCount) {
            selectedSemester = semester;
            selectedCount = count;
            continue;
        }
        if (count === selectedCount) {
            const currentSemester = Number(semester);
            const selectedSemesterNumber = Number(selectedSemester);
            if (Number.isFinite(currentSemester) &&
                (!Number.isFinite(selectedSemesterNumber) || currentSemester < selectedSemesterNumber)) {
                selectedSemester = semester;
            }
        }
    }
    return selectedSemester;
};
function backfillExistingStudents() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Iniciando backfill de alunos existentes...");
        const students = yield prismaClient_1.default.aluno.findMany({
            where: {
                semestre: "",
            },
            select: {
                id: true,
                nome: true,
                cursoId: true,
                semestre: true,
                notas: {
                    select: {
                        disciplinaId: true,
                        disciplina: {
                            select: {
                                semestre: true,
                            },
                        },
                    },
                },
            },
        });
        if (students.length === 0) {
            console.log("Nenhum aluno pendente de backfill encontrado.");
            return;
        }
        for (const student of students) {
            const semestresNasNotas = student.notas.map((nota) => nota.disciplina.semestre);
            const inferredSemester = pickMostFrequentSemester(semestresNasNotas) || "1";
            const disciplinasDoSemestre = yield prismaClient_1.default.disciplina.findMany({
                where: {
                    cursoId: student.cursoId,
                    semestre: inferredSemester,
                },
                select: { id: true },
            });
            yield prismaClient_1.default.aluno.update({
                where: { id: student.id },
                data: { semestre: inferredSemester },
            });
            if (disciplinasDoSemestre.length === 0) {
                console.log(`Aluno ${student.nome} atualizado para semestre ${inferredSemester}, mas sem disciplinas correspondentes no curso.`);
                continue;
            }
            const existingNoteIds = new Set(student.notas.map((nota) => nota.disciplinaId));
            const notesToCreate = disciplinasDoSemestre.filter((disciplina) => {
                return !existingNoteIds.has(disciplina.id);
            });
            if (notesToCreate.length > 0) {
                yield prismaClient_1.default.nota.createMany({
                    data: notesToCreate.map((disciplina) => ({
                        alunoId: student.id,
                        disciplinaId: disciplina.id,
                    })),
                    skipDuplicates: true,
                });
            }
            console.log(`Aluno ${student.nome} backfill concluído para semestre ${inferredSemester} com ${notesToCreate.length} notas criadas.`);
        }
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prismaClient_1.default.$disconnect();
}));
