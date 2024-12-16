const Project = require("../models/project");
const aqp = require("api-query-params");

const createProject = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Project data cannot be empty",
      });
    }

    const project = new Project(req.body);
    const newProject = await project.save();

    return res.status(201).json({
      success: true,
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
    const checkDelete = await Project.findById(req.params.id);
    if (!checkDelete) {
      throw new Error("Cannot find project ID");
    }
    if (checkDelete.deleted === true) {
      throw new Error("The project is already deleted");
    }
    await Project.deleteById(req.params.id);
    res.status(200).json({
      message: "Successfully deleted project",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: err.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new Error("Project not found");
    }

    if (req.body.name) project.name = req.body.name;
    if (req.body.description) project.description = req.body.description;

    if (req.body.tasks) {
      project.tasks = req.body.tasks;
    }

    const updatedProject = await project.save();
    await updatedProject.populate("tasks");

    res.status(200).json({
      success: true,
      message: "Success",
      project: updatedProject,
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
