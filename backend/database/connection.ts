import bcrypt from "bcryptjs";
import { sequelize } from ".";
import { Course } from "../models/courses";
import { Grade } from "../models/grades";
import { Student } from "../models/student";
import { Teacher } from "../models/teacher";
import { User } from "../models/user";

let initialized = false;

const setupAssociations = () => {
  Student.hasMany(Grade, { foreignKey: "alunoId", as: "notas" });
  Grade.belongsTo(Student, { foreignKey: "alunoId", as: "aluno" });

  Teacher.hasMany(Course, { foreignKey: "professorId", as: "disciplinas" });
  Course.belongsTo(Teacher, { foreignKey: "professorId", as: "professor" });

  Course.hasMany(Grade, { foreignKey: "disciplinaId", as: "notas" });
  Grade.belongsTo(Course, { foreignKey: "disciplinaId", as: "disciplina" });
};

const seedAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@appscholar.edu";
  const adminPassword = process.env.ADMIN_PASSWORD || "123456";
  const existingAdmin = await User.findOne({ where: { email: adminEmail } });

  if (existingAdmin) {
    return;
  }

  await User.create({
    login: adminEmail,
    email: adminEmail,
    senhaHash: await bcrypt.hash(adminPassword, 10),
    nome: "Administrador",
    perfil: "admin",
  });
};

export const connectToDatabase = async () => {
  if (!initialized) {
    setupAssociations();
    initialized = true;
  }

  await sequelize.authenticate();
  await sequelize.sync();
  await seedAdminUser();
  console.log("Conexao com PostgreSQL estabelecida e tabelas sincronizadas.");
};
