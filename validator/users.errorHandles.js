const User = require("../models/user");
const { body } = require("express-validator");

const nameExistenceValidator = body("name")
  .exists()
  .withMessage("Employee name is required")
  .custom(async (value) => {
    const user = await User.exists({ name: value });
    if (user) {
      throw new Error("Employee name is existed in the system");
    }
    return true;
  });

module.exports = { nameExistenceValidator };
