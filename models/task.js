const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const List = require("./list");

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed"),
    allowNull: false,
  },
});

Task.belongsTo(List, {
  foreignKey: "listId",
  onDelete: "CASCADE",
});

module.exports = Task;
