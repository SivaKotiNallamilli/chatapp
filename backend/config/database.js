const path = require("path");
const { Sequelize } = require("sequelize");

// Resolve exact absolute path to avoid multiple DB file issues
const dbPath = path.resolve(__dirname, "../database.sqlite");

console.log("🔥 SQLITE DB PATH:", dbPath);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbPath,
  logging: console.log, // set false in production if you want clean logs
});

module.exports = sequelize;