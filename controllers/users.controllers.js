var aqp = require("api-query-params");
var User = require("../models/user");

const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json({
      message: "Success",
      user: newUser,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      console.log("error");
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

const getUsers = async (req, res) => {
  const { filter } = aqp(req.query);
  delete filter.page;
  console.log(filter);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = page !== 1 ? limit * page : null;
  try {
    const users = await User.find(filter)
      .limit(limit)
      .skip(offset)
      .sort({ createdAt: -1, updatedAt: -1 })
      .populate("tasks", { select: "name description status" });
    res.status(200).json({
      message: "Success",
      users: users,
      page: page,
      total: users.length,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const getAllTasks = async (req, res) => {
  if (!req.params.id) {
    return res.status(500).json({
      message: "User id is required",
    });
  }
  try {
    const user = await User.findById(req.params.id).populate(
      "tasks",
      "name description status"
    );
    if (!user) {
      throw new Error("No user found");
    }
    const tasks = user.tasks;
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

module.exports = { createUser, getUsers, getAllTasks };
