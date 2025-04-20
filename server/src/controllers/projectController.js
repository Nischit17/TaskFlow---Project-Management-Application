const Project = require("../models/Project");
const User = require("../models/User");
const { Op } = require("sequelize");

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, dueDate, status, members } = req.body;
    const project = await Project.create({
      title,
      description,
      dueDate,
      status,
      createdBy: req.user.id,
    });

    if (members && members.length > 0) {
      await project.addMembers(members);
    }

    const projectWithMembers = await Project.findByPk(project.id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "members", attributes: ["id", "name", "email"] },
      ],
    });

    res.status(201).json(projectWithMembers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const { search, status } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const projects = await Project.findAll({
      where,
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "members", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "members", attributes: ["id", "name", "email"] },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { title, description, dueDate, status, members } = req.body;
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.update({
      title,
      description,
      dueDate,
      status,
    });

    if (members) {
      await project.setMembers(members);
    }

    const updatedProject = await Project.findByPk(project.id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "members", attributes: ["id", "name", "email"] },
      ],
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.destroy();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add members to project
exports.addProjectMembers = async (req, res) => {
  try {
    const { members } = req.body;
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.addMembers(members);

    const updatedProject = await Project.findByPk(project.id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "members", attributes: ["id", "name", "email"] },
      ],
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Remove members from project
exports.removeProjectMembers = async (req, res) => {
  try {
    const { members } = req.body;
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await project.removeMembers(members);

    const updatedProject = await Project.findByPk(project.id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "members", attributes: ["id", "name", "email"] },
      ],
    });

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
