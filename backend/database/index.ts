import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DATABASE_URL ?? "sqlite::memory:",
  {
    logging: false,
  },
);
