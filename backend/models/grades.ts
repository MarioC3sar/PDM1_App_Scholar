import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index";

interface GradeAttributes {
  id: number;
  studentId: number;
  courseId: number;
  grade: number;
  createdAt: Date;
  updatedAt: Date;
}

type GradeCreationAttributes = Optional<
  GradeAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export class Grade
  extends Model<GradeAttributes, GradeCreationAttributes>
  implements GradeAttributes
{
  public id!: number;
  public studentId!: number;
  public courseId!: number;
  public grade!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Grade.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    grade: {
      type: DataTypes.FLOAT,
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
