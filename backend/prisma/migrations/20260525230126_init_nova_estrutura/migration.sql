-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('ADMIN', 'PROFESSOR', 'ALUNO');

-- CreateEnum
CREATE TYPE "SituacaoNota" AS ENUM ('CURSANDO', 'APROVADO', 'REPROVADO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cursos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alunos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "telefone" TEXT,
    "cep" TEXT,
    "logradouro" TEXT,
    "numero" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" VARCHAR(2),
    "usuario_id" INTEGER NOT NULL,
    "curso_id" INTEGER NOT NULL,

    CONSTRAINT "alunos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professores" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "titulacao" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "tempo_docencia" TEXT,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "professores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplinas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "carga_horaria" INTEGER NOT NULL,
    "semestre" TEXT NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "professor_id" INTEGER NOT NULL,

    CONSTRAINT "disciplinas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notas" (
    "id" SERIAL NOT NULL,
    "nota1" DOUBLE PRECISION,
    "nota2" DOUBLE PRECISION,
    "media" DOUBLE PRECISION,
    "faltas" INTEGER NOT NULL DEFAULT 0,
    "situacao" "SituacaoNota" NOT NULL DEFAULT 'CURSANDO',
    "aluno_id" INTEGER NOT NULL,
    "disciplina_id" INTEGER NOT NULL,

    CONSTRAINT "notas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cursos_nome_key" ON "cursos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_matricula_key" ON "alunos"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "alunos_usuario_id_key" ON "alunos"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "professores_usuario_id_key" ON "professores"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "notas_aluno_id_disciplina_id_key" ON "notas"("aluno_id", "disciplina_id");

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professores" ADD CONSTRAINT "professores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplinas" ADD CONSTRAINT "disciplinas_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "cursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplinas" ADD CONSTRAINT "disciplinas_professor_id_fkey" FOREIGN KEY ("professor_id") REFERENCES "professores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas" ADD CONSTRAINT "notas_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "alunos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas" ADD CONSTRAINT "notas_disciplina_id_fkey" FOREIGN KEY ("disciplina_id") REFERENCES "disciplinas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
