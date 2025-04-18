const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Task = sequelize.define("Task", {
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
  priority: {
    type: DataTypes.ENUM("low", "medium", "high"),
    defaultValue: "medium",
  },
  status: {
    type: DataTypes.ENUM("todo", "in_progress", "completed"),
    defaultValue: "todo",
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Task;
