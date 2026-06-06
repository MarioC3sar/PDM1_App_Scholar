import prisma from '../prismaClient';

async function main() {
    console.log('Iniciando o seed...');

    // 1. Criar um Usuário e Professor genérico para vincular às disciplinas
    // (Usando upsert para não dar erro se rodar o seed mais de uma vez)
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
    });

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

    // 3. Criar as Disciplinas de DSM (com matérias até o 4º semestre)
    await prisma.disciplina.createMany({
        data: [
            { nome: 'Desenvolvimento Web III', cargaHoraria: 80, semestre: '4', cursoId: dsm.id, professorId: profUser.id },
            { nome: 'Engenharia de Software II', cargaHoraria: 80, semestre: '4', cursoId: dsm.id, professorId: profUser.id },
            { nome: 'Estrutura de Dados', cargaHoraria: 80, semestre: '3', cursoId: dsm.id, professorId: profUser.id },
            { nome: 'Sistemas Operacionais', cargaHoraria: 80, semestre: '2', cursoId: dsm.id, professorId: profUser.id },
        ],
        skipDuplicates: true,
    });

    // 4. Criar as Disciplinas de Meio Ambiente
    await prisma.disciplina.createMany({
        data: [
            { nome: 'Avaliação de Impactos Ambientais', cargaHoraria: 80, semestre: '3', cursoId: meioAmbiente.id, professorId: profUser.id },
            { nome: 'Legislação Ambiental', cargaHoraria: 40, semestre: '2', cursoId: meioAmbiente.id, professorId: profUser.id },
            { nome: 'Ecologia Aplicada', cargaHoraria: 80, semestre: '1', cursoId: meioAmbiente.id, professorId: profUser.id },
        ],
        skipDuplicates: true,
    });

    // 5. Criar as Disciplinas de Geoprocessamento
    await prisma.disciplina.createMany({
        data: [
            { nome: 'Sistemas de Informação Geográfica', cargaHoraria: 80, semestre: '2', cursoId: geo.id, professorId: profUser.id },
            { nome: 'Topografia e Geodésia', cargaHoraria: 80, semestre: '1', cursoId: geo.id, professorId: profUser.id },
            { nome: 'Processamento Digital de Imagens', cargaHoraria: 80, semestre: '4', cursoId: geo.id, professorId: profUser.id },
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
