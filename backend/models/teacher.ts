import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index";

interface TeacherAttributes {
  id: number;
  nome: string;
  titulacao: string;
  areaAtuacao: string;
  tempoDocencia: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type TeacherCreationAttributes = Optional<
  TeacherAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class Teacher
  extends Model<TeacherAttributes, TeacherCreationAttributes>
  implements TeacherAttributes
{
  public id!: number;
  public nome!: string;
  public titulacao!: string;
  public areaAtuacao!: string;
  public tempoDocencia!: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Teacher.init(
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
    titulacao: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    areaAtuacao: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    tempoDocencia: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(128),
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
    sequelize,
  },
);
