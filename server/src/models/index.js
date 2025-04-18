const User = require("./User");
const Project = require("./Project");
const Task = require("./Task");
const ProjectUser = require("./ProjectUser");

// User-Project associations (many-to-many for members)
User.belongsToMany(Project, { through: ProjectUser, as: "memberProjects" });
Project.belongsToMany(User, { through: ProjectUser, as: "members" });

// User-Project associations (created projects)
User.hasMany(Project, { as: "createdProjects", foreignKey: "createdBy" });
Project.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

// Project-Task associations (one-to-many)
Project.hasMany(Task);
Task.belongsTo(Project);

// User-Task associations (one-to-many)
User.hasMany(Task, { as: "assignedTasks", foreignKey: "assignedTo" });
Task.belongsTo(User, { as: "assignee", foreignKey: "assignedTo" });

// User-Task associations (created tasks)
User.hasMany(Task, { as: "createdTasks", foreignKey: "createdBy" });
Task.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

module.exports = {
  User,
  Project,
  Task,
  ProjectUser,
};
