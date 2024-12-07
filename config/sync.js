// sync.js
const sequelize = require("./db");
const User = require("../models/user");
const List = require("../models/list");
const Task = require("../models/task");

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Tablas sincronizadas.");
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error);
  }
};

syncDatabase();
