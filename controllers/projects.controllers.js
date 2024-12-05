var Task = require("../models/task");
var Project = require("../models/project");
var aqp = require("api-query-params");

const createProject = async (req, res) => {
  const project = new Project(req.body);
  try {
    const newProject = await project.save();
    res.status(201).json({
      message: "Success",
      newProject: newProject,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const getProjects = async (req, res) => {
  const { filter } = aqp(req.query);
  delete filter.page;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = page !== 1 ? limit * page : null;
  try {
    const projects = await Project.find(filter)
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1, updatedAt: -1 })
      .populate("assignee", "name");
    res.status(200).json({
      message: "Success",
      projects: projects,
      page: page,
      total: projects.length,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const error = Object.values(err.errors).map((err) => err.message);
      res.status(400).json({
        error: err._message,
        message: error[1],
      });
    } else {
      res.status(400).json({
        message: "No project found",
      });
    }
  }
};

const deleteProject = async (req, res) => {
  try {
    const checkDelete = await Task.findById(req.params.id);
    if (!checkDelete) {
      throw new Error("Cannot find task ID");
    }
    if (checkDelete.deleted === true) {
      throw new Error("The task is already deleted");
    }
    await Task.deleteById(req.params.id);
    res.status(200).json({
      message: "Successfully deleted task",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
};

const updateProject = async (req, res) => {
  if (!req.body.assignee) {
    return res.status(400).json({
      message: "Assignee is required and cannot be empty",
    });
  }
  try {
    const user = await User.findById(req.body.assignee);
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw new Error("Task not found");
    }
    if (!user) {
      throw new Error("User not found");
    }

    if (!task.assignee) {
      task.assignee = req.body.assignee;
      user.tasks.push(req.params.id);
    } else {
      throw new Error("Task is already assigned");
    }

    await task.populate("assignee", "name");
    await user.populate("tasks", { select: "name description status" });
    await task.save();
    await user.save();
    res.status(200).json({
      message: "Success",
      task: task,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
};
