const { validationResult } = require("express-validator");
const Task = require("../models/task");
const aqp = require("api-query-params");
const Project = require("../models/project");

// const errors = validationResult(req);
// if (!errors.isEmpty()) {
//   return res.status(400).json({ errors: errors.array() });
// }

const createTask = async (req, res) => {
  const task = new Task(req.body);
  const projectDoc = await Project.findById(req.body.project);
  try {
    const newTask = await task.save();
    if (projectDoc) {
      console.log("projectDoc", projectDoc);
      await Project.findByIdAndUpdate(
        req.body.project,
        { $push: { tasks: newTask._id } },
        { new: true }
      );
    } else {
      throw new Error("Project not found");
    }
    res.status(201).json({
      success: true,
      task: newTask,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const error = Object.values(err.errors).map((err) => err.message);
      res.status(400).json({
        error: err._message,
        message: error[0],
      });
    } else {
      res.status(400).json({
        message: err.message,
      });
    }
  }
};

const getTasks = async (req, res) => {
  const filters = aqp(req.query);
  function clean(obj) {
    for (var value in obj) {
      if (obj[value] === "All" || obj[value] === "" || obj[value] === null) {
        delete obj[value];
      } else if (obj.assigned === false) {
        delete obj.assigned;
        obj.assignee = { $exists: false };
      } else if (obj.assigned === true) {
        delete obj.assigned;
        obj.assignee = { $exists: true };
      }
    }
    return obj;
  }
  const cleanFilters = clean(filters.filter);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = page !== 1 ? limit * page : null;
  try {
    const tasks = await Task.find(cleanFilters)
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1, updatedAt: -1 })
      .populate("assignee", { name: 1, email: 1 })
      .populate("project", { name: 1 });
    res.status(200).json({
      message: "Success",
      tasks: tasks,
      page: page,
      total: tasks.length,
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
        message: "No task found",
      });
    }
  }
};

const getTasksOfProject = async (req, res) => {
  console.log(req.params.id);
  try {
    const tasks = await Task.find({ project: req.params.id })
      .populate("assignee", { name: 1, email: 1 })
      .sort({ createdAt: -1, updatedAt: -1 });
    res.status(200).json({
      message: "Success",
      tasks: tasks,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const updateTask = async (req, res) => {
  let data = req.body;
  console.log("data", data);
  try {
    const rqTask = await Task.findById(req.params.id);
    if (!rqTask) {
      throw new Error("Task not found");
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        project: data.project || null,
        name: data.name || null,
        description: data.description || null,
        status: data.status || null,
        priority: data.priority || null,
        assignee: data.assignee || null,
        deadline: data.deadline || null,
      },
      { new: true }
    );
    await updatedTask.save();
    res.status(200).json({
      success: true,
      updatedTask: updatedTask,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const deleteTask = async (req, res) => {
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

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTasksOfProject,
};
