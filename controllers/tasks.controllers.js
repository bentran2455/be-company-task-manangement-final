var express = require("express");
var Task = require("../models/task");
var User = require("../models/user");

// must check body for : existence, and other requirements per task schema.
const createTask = async (req, res) => {
  const { name, status, description, assignee } = req.body;
  try {
    const checkExistence = await Task.exists({ name: name });
    if (checkExistence) {
      res.status(400).json({
        message: "Task name is existed in the system",
      });
      return;
    }
    const newTask = await Task.create({
      name,
      status,
      description,
      assignee,
    });
    res.status(200).json({
      message: "Success",
      task: newTask,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const error = Object.values(err.errors).map((err) => err.message);
      res.status(400).json({
        error: err._message,
        message: error[1],
      });
    }
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignee");
    if (tasks.length === 0) {
      res.status(200).json({
        message: "No task found",
      });
    } else
      res.status(200).json({
        message: "Success",
        tasks: tasks,
      });
  } catch (err) {
    if (err.name === "ValidationError") {
      const error = Object.values(err.errors).map((err) => err.message);
      res.status(400).json({
        error: err._message,
        message: error[1],
      });
    }
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    res.status(200).json({
      message: "Success",
      task: task,
    });
  } catch (err) {
    res.status(400).json({
      message: "No task found",
    });
  }
};

module.exports = { createTask, getTasks, getTaskById };
