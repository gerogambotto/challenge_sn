const { DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
const { Sequelize, DataTypes } = require("sequelize");

// Database Configuration
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
