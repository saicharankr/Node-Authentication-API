const User = require("../models/user.model");
// const { logger } = require("../helpers/logging");
const { userService, authService } = require("../services");
const passport = require('passport');
//const expressJwt = require("express-jwt");


exports.signUp = async (req, res) => {
  await userService.createUser(req, res);
};

exports.signin = async (req, res) => {
  await authService.loginUser(req, res);
};

exports.Activate = async (req, res) => {
  await authService.activeUser(req,res);
};

exports.ForgotPassword = async (req, res) => {
  await authService.forgotPassword(req,res);
};

exports.ResetPassword = async (req, res) => {
  await authService.resetPassword(req,res);
};

//Option 1 : - Jwt validation using expressJwt package
// exports.requireSignin = expressJwt({
//   secret: process.env.JWT_SECRET,
//   algorithms: ["HS256"],
//   userProperty: "auth",
// });

//Option 2 : - Jwt validation using passport.js package
exports.requireSignin = passport.authenticate('jwt', { session: false });

exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.json({
    error: false,
    message: "Signout Successful",
  });
};

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.user && req.profile.userId == req.user.userId;
  if (!user) {
    return res.status(403).json({
      error: true,
      message: "Access denied",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!(req.profile.role === 0)) {
    return res.status(403).json({
      error: true,
      message: "Admin resource! Access denied",
    });
  }
  next();
};

