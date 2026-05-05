"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class Course extends sequelize_1.Model {
}
exports.Course = Course;
Course.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    cargaHoraria: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "carga_horaria",
    },
    professorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: "professor_id",
    },
    curso: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    semestre: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "disciplinas",
    timestamps: false,
});
