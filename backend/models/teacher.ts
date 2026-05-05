import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface TeacherAttributes {
  id: number;
  nome: string;
  titulacao: string;
  area: string;
  tempoDocencia: string;
  email: string;
}

type TeacherCreationAttributes = Optional<TeacherAttributes, "id">;

export class Teacher
  extends Model<TeacherAttributes, TeacherCreationAttributes>
  implements TeacherAttributes
{
  declare id: number;
  declare nome: string;
  declare titulacao: string;
  declare area: string;
  declare tempoDocencia: string;
  declare email: string;
}

Teacher.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    titulacao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tempoDocencia: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "tempo_docencia",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    tableName: "professores",
    timestamps: false,
  },
);
