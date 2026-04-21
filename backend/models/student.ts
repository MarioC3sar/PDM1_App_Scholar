import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index";

interface StudentAttributes {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  createdAt: Date;
  updatedAt: Date;
}

type StudentCreationAttributes = Optional<
  StudentAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class Student
  extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes
{
  public id!: number;
  public nome!: string;
  public email!: string;
  public telefone!: string;
  public cep!: string;
  public logradouro!: string;
  public numero!: string;
  public bairro!: string;
  public cidade!: string;
  public estado!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    telefone: {
      type: new DataTypes.STRING(20),
      allowNull: false,
    },
    cep: {
      type: new DataTypes.STRING(10),
      allowNull: false,
    },
    logradouro: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    numero: {
      type: new DataTypes.STRING(10),
      allowNull: false,
    },
    bairro: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    cidade: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    estado: {
      type: new DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "students",
    sequelize, // passing the `sequelize` instance is required
  },
);
