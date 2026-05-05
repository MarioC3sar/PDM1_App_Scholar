"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class Student extends sequelize_1.Model {
}
exports.Student = Student;
Student.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    matricula: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    curso: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    telefone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cep: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    endereco: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cidade: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: sequelize_1.DataTypes.STRING(2),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "alunos",
    timestamps: false,
});
