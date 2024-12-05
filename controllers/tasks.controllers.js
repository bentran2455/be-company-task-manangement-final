const { validationResult } = require("express-validator");
var Task = require("../models/task");
var User = require("../models/user");
var aqp = require("api-query-params");
const { uploadFile } = require("../services/UploadFile");
const createTask = async (req, res) => {
  const task = new Task(req.body);
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  try {
    if (req.files) {
      const uploadResult = await uploadFile(req.files);
      if (uploadResult.success === true) {
        task.file = uploadResult.path;
      }
    }
    const newTask = await task.save();
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
  const { filter } = aqp(req.query);
  delete filter.page;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = page !== 1 ? limit * page : null;
  try {
    const tasks = await Task.find(filter)
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1, updatedAt: -1 })
      .populate("assignee", "name");
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

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignee",
      "name"
    );
    if (!task) {
      throw new Error("Task not found");
    }
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

const updateTask = async (req, res) => {
  let newStatus = req.body.status;
  try {
    const rqTask = await Task.findById(req.params.id);
    if (!rqTask) {
      throw new Error("Task not found");
    }
    if (!newStatus) {
      return res.status(200).json({
        message: "Success",
        task: rqTask,
      });
    }
    if (rqTask.status === "Done" && newStatus !== "Archive") {
      throw new Error(
        "Done status cannot be changed to other value except Archive"
      );
    } else {
      const updateTask = await Task.findByIdAndUpdate(
        req.params.id,
        { status: newStatus },
        { new: true }
      );
      await updateTask.save();
      res.status(200).json({
        message: "Success",
        "update task": updateTask,
      });
    }
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

const assignTask = async (req, res) => {
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
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
};
