const {userService} = require("../services")
const _ = require("lodash")

exports.userById = async (req, res, next) => {
  await userService.findUserById(req,res,next);
};

exports.getAllUsers = async (req, res) => {
  await userService.getAllUsers(req,res);
};

exports.getUserById= async (req,res) => {
  await userService.getUserById(req,res);
}


exports.updateUser = async (req, res) => {
  await userService.updateUserById(req,res);
};

exports.deleteUser = async (req,res) => {
  await userService.deleteUserById(req,res);
}
