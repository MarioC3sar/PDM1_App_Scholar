"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../database");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    login: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    senhaHash: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: "senha_hash",
    },
    nome: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    perfil: {
        type: sequelize_1.DataTypes.ENUM("aluno", "professor", "admin"),
        allowNull: false,
        defaultValue: "admin",
    },
}, {
    sequelize: database_1.sequelize,
    tableName: "usuarios",
    timestamps: false,
});
