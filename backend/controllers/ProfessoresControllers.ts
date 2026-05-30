import { Request, Response } from "express";
import {  Perfil } from "@prisma/client";
import prisma from "../prismaClient";
import bcrypt from "bcryptjs";



const requiredFields = ["nome", "titulacao", "area", "tempoDocencia", "email"];

export const createTeacher = async (req: Request, res: Response) => {
  try {
    const missingFields = requiredFields.filter(
        (field) => !String(req.body[field] ?? "").trim(),
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Campos obrigatórios ausentes.",
        campos: missingFields,
      });
    }

    const { nome, titulacao, area, tempoDocencia, email } = req.body;

    // 1. Verifica se o e-mail já existe na tabela de Usuários (para evitar duplicidade no login)
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "E-mail já está em uso por outro usuário." });
    }

    // 2. Define uma senha padrão (ex: pegando a parte do email antes do '@')
    const senhaPadrao = email.split('@')[0];
    const senhaHash = await bcrypt.hash(senhaPadrao, 10);

    // 3. NESTED WRITE: Cria o Usuário E o Professor na mesma transação!
    const novoUsuario = await prisma.usuario.create({
      data: {
        email: email,
        senhaHash: senhaHash,
        perfil: Perfil.PROFESSOR, // Usa o Enum gerado pelo Prisma

        // Entra na tabela Professor e vincula o ID automaticamente
        professor: {
          create: {
            nome,
            titulacao,
            area,
            tempoDocencia
          }
        }
      },
      include: {
        professor: true
      }
    });

    return res.status(201).json({
      message: "Professor e usuário de acesso cadastrados com sucesso.",
      professor: novoUsuario.professor,
      email_acesso: novoUsuario.email,
      senha_temporaria: senhaPadrao // Envia a senha gerada para exibir na tela do Admin
    });

  } catch (error) {
    console.error("Erro ao cadastrar professor:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};


export const getTeachers = async (_req: Request, res: Response) => {
  try {
    const professores = await prisma.professor.findMany({
      orderBy: { id: "desc" },
      // Busca o email na tabela de usuários para devolver ao Frontend
      include: {
        usuario: { select: { email: true } }
      }
    });

    // Remonta o objeto para o App Scholar continuar funcionando perfeitamente
    const professoresFormatados = professores.map(prof => ({
      ...prof,
      email: prof.usuario.email // Puxa o email de volta para o nível principal do objeto
    }));

    return res.json({ total: professoresFormatados.length, professores: professoresFormatados });

  } catch (error) {
    console.error("Erro ao buscar professores:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};