var express = require("express");
var router = express.Router();

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} = require("../controllers/projects.controllers");

router.post("/", createProject);

router.get("/", getProjects);

router.put("/:id", updateProject);

router.delete("/:id", deleteProject);

module.exports = router;
