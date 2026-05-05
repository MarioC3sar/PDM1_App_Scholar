import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface UserAttributes {
  id: number;
  login: string;
  email: string;
  senhaHash: string;
  nome: string;
  perfil: "aluno" | "professor" | "admin";
}

type UserCreationAttributes = Optional<UserAttributes, "id">;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare login: string;
  declare email: string;
  declare senhaHash: string;
  declare nome: string;
  declare perfil: "aluno" | "professor" | "admin";
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senhaHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "senha_hash",
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    perfil: {
      type: DataTypes.ENUM("aluno", "professor", "admin"),
      allowNull: false,
      defaultValue: "admin",
    },
  },
  {
    sequelize,
    tableName: "usuarios",
    timestamps: false,
  },
);
