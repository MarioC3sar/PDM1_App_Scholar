"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grade = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class Grade extends sequelize_1.Model {
}
exports.Grade = Grade;
Grade.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    alunoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "aluno_id",
    },
    disciplinaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "disciplina_id",
    },
    nota1: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    nota2: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    media: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    situacao: {
        type: sequelize_1.DataTypes.ENUM("Aprovado", "Reprovado", "Em analise"),
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "notas",
    timestamps: false,
});
