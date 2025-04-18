const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Project = sequelize.define("Project", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("active", "completed", "on_hold"),
    defaultValue: "active",
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Project;
