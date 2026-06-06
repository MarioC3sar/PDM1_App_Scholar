import dotenv from "dotenv";
import { bootstrapAdmin } from "./admin-bootstrap";

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

  const admin = await bootstrapAdmin(email, password);

  console.log(`ADMIN criado/atualizado: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
