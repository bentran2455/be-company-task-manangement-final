var aqp = require("api-query-params");
var User = require("../models/user");

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
      .select({ password: 0 });
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

module.exports = { getUsers, getAllTasks };
