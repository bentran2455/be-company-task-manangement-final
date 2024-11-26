const Task = require("../models/task");
const { body } = require("express-validator");

const nameExistenceValidator = body("name").custom(async (value) => {
  if (value) {
    const task = await Task.exists({ name: value });
    if (task) {
      throw new Error("Employee name is existed in the system");
    }
  } else return;
});

module.exports = { nameExistenceValidator };
