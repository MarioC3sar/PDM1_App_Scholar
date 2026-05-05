import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";
import { Course } from "./courses";
import { Student } from "./student";

export interface GradeAttributes {
  id: number;
  alunoId: number;
  disciplinaId: number;
  nota1: number;
  nota2: number;
  media: number;
  situacao: "Aprovado" | "Reprovado" | "Em analise";
}

type GradeCreationAttributes = Optional<GradeAttributes, "id" | "media" | "situacao">;

export class Grade
  extends Model<GradeAttributes, GradeCreationAttributes>
  implements GradeAttributes
{
  declare id: number;
  declare alunoId: number;
  declare disciplinaId: number;
  declare nota1: number;
  declare nota2: number;
  declare media: number;
  declare situacao: "Aprovado" | "Reprovado" | "Em analise";
  declare aluno?: Student;
  declare disciplina?: Course;
}

Grade.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    alunoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "aluno_id",
    },
    disciplinaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "disciplina_id",
    },
    nota1: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    nota2: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    media: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    situacao: {
      type: DataTypes.ENUM("Aprovado", "Reprovado", "Em analise"),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "notas",
    timestamps: false,
  },
);
