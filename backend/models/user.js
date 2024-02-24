const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../configs/db");
// User Model
// Define el modelo User
const User = sequelize.define(
  "User",
  {
    // Definición de los campos de User
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    role: {
      // Nuevo campo role
      type: DataTypes.STRING, // Dependiendo de cómo definas los roles, puede ser STRING, INTEGER, etc.
      allowNull: false, // Ajusta según tus necesidades
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Role", // El nombre del modelo debe coincidir con la definición del modelo Role
        key: "id",
      },
    },
    status: {
      // Nueva columna status
      type: DataTypes.STRING, // Define el tipo de datos como STRING
      allowNull: false, // La columna no puede ser nula
      defaultValue: "activo", // Establece el valor predeterminado como "activo"
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "users", // Define el nombre de la tabla como "users"
  }
);

module.exports = User;
