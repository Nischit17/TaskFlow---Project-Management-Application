const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const { Op } = require("sequelize");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      projectId,
      assignedTo,
    } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      projectId,
      assignedTo,
      createdBy: req.user.id,
    });

    const taskWithDetails = await Task.findByPk(task.id, {
      include: [
        { model: Project, attributes: ["id", "title"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
    });

    res.status(201).json(taskWithDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const { search, status, priority, projectId, assignedTo } = req.query;
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

    if (priority) {
      where.priority = priority;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { model: Project, attributes: ["id", "title"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single task
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: Project, attributes: ["id", "title"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedTo } =
      req.body;
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.update({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
    });

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        { model: Project, attributes: ["id", "title"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get project tasks
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignedTo } = req.query;
    const where = { projectId };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { model: Project, attributes: ["id", "title"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user tasks
exports.getUserTasks = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, priority, projectId } = req.query;
    const where = { assignedTo: userId };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    const tasks = await Task.findAll({
      where,
      include: [
        { model: Project, attributes: ["id", "title"] },
        { model: User, as: "assignee", attributes: ["id", "name", "email"] },
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
