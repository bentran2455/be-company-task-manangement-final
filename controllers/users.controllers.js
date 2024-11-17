var express = require("express");
var User = require("../models/user");

// must check body for : existence, including name , name's value is a valid string.
const createUser = async (req, res) => {
  const { name, role } = req.body;
  try {
    const newUser = await User.create({
      name,
      role,
    });
    res.status(200).json({
      message: "Success",
      user: newUser,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const error = Object.values(err.errors).map((err) => err.message);
      res.status(400).json({
        error: err._message,
        message: error[0],
      });
    }
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).limit(10);
    res.status(200).json({
      message: "Success",
      users: users,
    });
  } catch (err) {
    res.status(400).json({
      message: "No user found",
    });
  }
};

//Get user info by name
const getUserByName = async (req, res) => {
  const rqName = req.query.name;
  try {
    const user = await User.find({ name: rqName }).limit(10);
    res.status(200).json({
      message: "Success",
      users: user,
    });
  } catch (err) {
    res.status(400).json({
      message: "No user found",
    });
  }
};

module.exports = { createUser, getUsers, getUserByName };
