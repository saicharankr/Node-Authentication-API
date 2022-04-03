
//Validations for creating the post
exports.createPostValidations = (req, res, next) => {
  //title
  req.check("title", "This field cannot be empty").notEmpty();
  req
    .check("title", "Title must be between 4 and 150 characters long")
    .isLength({
      min: 4,
      max: 150,
    });

  //body

  req.check("body", "This field cannot be empty").notEmpty();
  req
    .check("body", "Title must be between 10 and 2000 characters long")
    .isLength({
      min: 10,
      max: 2000,
    });

  //check for errors
  const errors = req.validationErrors();

  if (errors) {
    const firstError = errors.map((error) => error.msg);
    return res.status(400).json({ error: firstError });
  }

  //move to next middleware
  next();
};

exports.signUpValidations = (req, res, next) => {
  //name should not null
  const result = req.body;
  req.check("firstName", "First name is required").notEmpty();

  req.check("userName", "username cannot be blank").notEmpty();

  //email should not be null,valid and atleast should have 5 char
  req
    .check("email")
    .notEmpty()
    .withMessage("Email cannot be blank")
    .matches(/[^@]+@[^@]+\.[^@]+/)
    .withMessage("Not a valid email");

  //password should not be empty,and min length od 6 to 15 characters
  req
    .check("password")
    .notEmpty()
    .withMessage("password cannot be blank")
    .isLength({
      min: 6,
      max: 18,
    })
    .withMessage("Password must be atleast 6 chars long and less then 18 chars")
    .matches(/\d/)
    .withMessage("Password should contain atleast one number");

  // req.check("confirmPassword", "Please enter the Confirm password").notEmpty();

  if (result.password != result.confirmPassword) {
    return res.status(403).json({
      error: true,
      message: "Password and confirm password does not match",
    });
    //errorsList.push("Password and confirm password does not match");
  }
  //check for errors
  const errors = req.validationErrors();
  if (errors) {
    var firstError = errors.map((err) => err.msg)[0];
    return res.status(400).json({ error: true, message: firstError });
  }

  //move to next middleware
  next();
};

exports.signinValidations = async (req, res, next) => {
  //email should not be null,valid and atleast should have 5 char
  req
    .check("email")
    .notEmpty()
    .withMessage("Email cannot be blank")
    .matches(/[^@]+@[^@]+\.[^@]+/)
    .withMessage("Not a valid email");

  //password should not be empty,and min length od 6 to 15 characters
  req
    .check("password")
    .notEmpty()
    .withMessage("password cannot be blank")
    .isLength({
      min: 6,
      max: 18,
    })
    .withMessage("Password must be atleast 6 chars long and less then 18 chars")
    .matches(/\d/)
    .withMessage("Password should contain atleast one number");

  //check for errors
  const errors = req.validationErrors();
  if (errors) {
    var firstError = errors.map((err) => err.msg)[0];
    return res.status(400).json({ error: true, message: firstError });
  }

  //move to next middleware
  next();
};

exports.forgotPasswordValidations = async (req, res, next) => {
  
  //email should not be null,valid and atleast should have 5 char
  req
    .check("email")
    .notEmpty()
    .withMessage("Email cannot be blank")
    .matches(/[^@]+@[^@]+\.[^@]+/)
    .withMessage("Not a valid email");

  //check for errors
  const errors = req.validationErrors();
  if (errors) {
    var firstError = errors.map((err) => err.msg)[0];
    return res.status(400).json({ error: true, message: firstError });
  }

  //move to next middleware
  next();
};

exports.resetPasswordValidations = async (req, res, next) => {

  //password should not be empty,and min length od 6 to 15 characters
  req
    .check("password")
    .notEmpty()
    .withMessage("password cannot be blank")
    .isLength({
      min: 6,
      max: 18,
    })
    .withMessage("Password must be atleast 6 chars long and less then 18 chars")
    .matches(/\d/)
    .withMessage("Password should contain atleast one number");

    if (result.password != result.confirmPassword) {
      return res.status(403).json({
        error: true,
        message: "Password and confirm password does not match",
      });
    }

  //check for errors
  const errors = req.validationErrors();
  if (errors) {
    var firstError = errors.map((err) => err.msg)[0];
    return res.status(400).json({ error: true, message: firstError });
  }

  //move to next middleware
  next();
};