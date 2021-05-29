const User = require("../models/userModel");
exports.signUpValidations = async (req, res, next) => {
  //name should not null
  const result = req.body;
  req.check("firstName", "First name is required").notEmpty();

  //email should not be null,valid and atleast should have 5 char
  req
    .check("email", "Its not the valid email address")
    .matches(/[^@]+@[^@]+\.[^@]+/)
    .isLength({
      min: 5,
      max: 2000,
    });

  //password should not be empty,and min length od 6 to 15 characters
  req.check("password", "Please enter the password").notEmpty();
  req
    .check("password")
    .isLength({
      min: 6,
      max: 18,
    })
    .withMessage("Password must be atleast 6 chars long and less then 18 chars")
    .matches(/\d/)
    .withMessage("It should contain atleast one number");

    req.check("confirm_password", "Please enter the password").notEmpty();
  //Checking if user already exist
  const userExist = await User.findOne({ email: result.email });
  if (userExist) {
    return res.status(403).json({
      error: true,
      message: "Email is already in use",
    });
  }

  const userNameExist = await User.findOne({ username: result.username });
  if (userNameExist) {
    return res.status(403).json({
      error: true,
      message: "UserName is already in use",
    });
  }

  if (result.password != result.confirm_password) {
    return res.status(403).json({
      error: true,
      message: "Password and confirm password does not match",
    });
  }
  //check for errors
  const errors = req.validationErrors();

  if (errors) {
    return res.status(400).json({ error: true, message: errors });
  }

  //move to next middleware
  next();
};
