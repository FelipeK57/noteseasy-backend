const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const List = sequelize.define("List", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emoji: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

List.belongsTo(User, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});

module.exports = List;
