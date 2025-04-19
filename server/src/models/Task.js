const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Project = require("./Project");

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
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
    references: {
      model: "Projects",
      key: "id",
    },
  },
  assignedTo: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: "Users",
      key: "id",
    },
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
});

module.exports = Task;
