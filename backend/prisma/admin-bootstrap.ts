import bcrypt from "bcryptjs";
import prisma from "../prismaClient";

export const bootstrapAdmin = async (email: string, password: string) => {
  const senhaHash = await bcrypt.hash(password, 10);

  return prisma.usuario.upsert({
    where: { email },
    update: {
      senhaHash,
      perfil: "ADMIN",
      primeiroAcesso: false,
    },
    create: {
      email,
      senhaHash,
      perfil: "ADMIN",
      primeiroAcesso: false,
    },
  });
};
