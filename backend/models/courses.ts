import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";
import { Teacher } from "./teacher";

export interface CourseAttributes {
  id: number;
  nome: string;
  cargaHoraria: number;
  professorId: number;
  curso: string;
  semestre: string;
}

type CourseCreationAttributes = Optional<CourseAttributes, "id">;

export class Course
  extends Model<CourseAttributes, CourseCreationAttributes>
  implements CourseAttributes
{
  declare id: number;
  declare nome: string;
  declare cargaHoraria: number;
  declare professorId: number;
  declare curso: string;
  declare semestre: string;
  declare professor?: Teacher;
}

Course.init(
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
    cargaHoraria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "carga_horaria",
    },
    professorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "professor_id",
    },
    curso: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semestre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "disciplinas",
    timestamps: false,
  },
);
