import bcrypt from "bcrypt";
import dotenv from "dotenv";
import prisma from "../prismaClient";

dotenv.config();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email) {
    throw new Error("ADMIN_EMAIL is required");
  }

  if (!password) {
    throw new Error("ADMIN_PASSWORD is required");
  }

  const senhaHash = await bcrypt.hash(password, 10);

  const admin = await prisma.usuario.upsert({
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

  console.log(`ADMIN criado/atualizado: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
