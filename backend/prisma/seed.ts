import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import prisma from "../prismaClient";

dotenv.config();

async function main() {
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

    const adminSenhaHash = await bcrypt.hash(adminPassword, 10);

    const AdminUser = await prisma.usuario.upsert({
        where: { email: adminEmail },
        update: {
            senhaHash: adminSenhaHash,
            perfil: "ADMIN",
            primeiroAcesso: false,
        },
        create: {
            email: adminEmail,
            senhaHash: adminSenhaHash,
            perfil: "ADMIN",
            primeiroAcesso: false,
        },
    });

    console.log(`Admin criado/atualizado: ${AdminUser.email}`);


    const profUser = await prisma.usuario.upsert({
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
    const dsm = await prisma.curso.upsert({
        where: { nome: 'Desenvolvimento de Software Multiplataforma' },
        update: {},
        create: {
            nome: 'Desenvolvimento de Software Multiplataforma',
            descricao: 'Formação em desenvolvimento web, mobile e práticas ágeis de engenharia de software.',
        },
    });

    const meioAmbiente = await prisma.curso.upsert({
        where: { nome: 'Meio Ambiente' },
        update: {},
        create: {
            nome: 'Meio Ambiente',
            descricao: 'Formação focada em sustentabilidade, gestão ambiental e ecologia.',
        },
    });

    const geo = await prisma.curso.upsert({
        where: { nome: 'Geoprocessamento' },
        update: {},
        create: {
            nome: 'Geoprocessamento',
            descricao: 'Formação em sistemas de informação geográfica, cartografia e análise de dados espaciais.',
        },
    });

    console.log('Cursos criados!');

    await prisma.disciplina.deleteMany({
        where: {
            cursoId: {
                in: [dsm.id, meioAmbiente.id, geo.id],
            },
        },
    });

    // 3. Criar as Disciplinas de DSM (com matérias até o 4º semestre)
    await prisma.disciplina.createMany({
        data: [
            { nome: 'Desenvolvimento Web III', cargaHoraria: 80, semestre: '4', cursoId: dsm.id, professorId },
            { nome: 'Engenharia de Software II', cargaHoraria: 80, semestre: '4', cursoId: dsm.id, professorId },
            { nome: 'Estrutura de Dados', cargaHoraria: 80, semestre: '3', cursoId: dsm.id, professorId },
            { nome: 'Sistemas Operacionais', cargaHoraria: 80, semestre: '2', cursoId: dsm.id, professorId },
        ],
        skipDuplicates: true,
    });

    // 4. Criar as Disciplinas de Meio Ambiente
    await prisma.disciplina.createMany({
        data: [
            { nome: 'Avaliação de Impactos Ambientais', cargaHoraria: 80, semestre: '3', cursoId: meioAmbiente.id, professorId },
            { nome: 'Legislação Ambiental', cargaHoraria: 40, semestre: '2', cursoId: meioAmbiente.id, professorId },
            { nome: 'Ecologia Aplicada', cargaHoraria: 80, semestre: '1', cursoId: meioAmbiente.id, professorId },
        ],
        skipDuplicates: true,
    });

    // 5. Criar as Disciplinas de Geoprocessamento
    await prisma.disciplina.createMany({
        data: [
            { nome: 'Sistemas de Informação Geográfica', cargaHoraria: 80, semestre: '2', cursoId: geo.id, professorId },
            { nome: 'Topografia e Geodésia', cargaHoraria: 80, semestre: '1', cursoId: geo.id, professorId },
            { nome: 'Processamento Digital de Imagens', cargaHoraria: 80, semestre: '4', cursoId: geo.id, professorId },
        ],
        skipDuplicates: true,
    });

    console.log('Disciplinas criadas com sucesso!');
    console.log('Seed finalizado!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
