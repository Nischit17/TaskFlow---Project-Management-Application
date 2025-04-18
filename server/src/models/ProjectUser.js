const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProjectUser = sequelize.define("ProjectUser", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("member", "admin"),
    defaultValue: "member",
  },
});

module.exports = ProjectUser;
